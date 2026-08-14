/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { paginate } from "@/lib/pagination";
import { and, or, sql, asc, eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";

import { revalidatePath } from "next/cache";
import { cart, cartItem, product, rewardCoinsHistory } from "@/db/schema";
import { order, orderItem, payment, users } from "@/db/schema";
import { getProfile } from "../user/action";
import { calculateCheckoutPricing } from "../checkout/pricing";

export const fetchOrders = async ({
  page = 1,
  pageSize = 3,
  search = "",
  status = "",
  userId = "",
}) => {
  const filters = [];

  if (search && search.trim() !== "") {
    filters.push(or(sql`${order.id}::text ILIKE ${`%${search}%`}`));
  }

  if (status && status.trim() !== "") {
    filters.push(eq(order.status, status));
  }

  if (userId && userId.trim() !== "") {
    filters.push(eq(order.userId, userId));
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  return paginate({
    table: order,
    page,
    pageSize,
    where: whereClause,
    orderBy: asc(order.createdAt),
  });
};

/** Checkout payments linked to orders (purchase), with buyer details. */
export const fetchPurchasePayments = async ({
  page = 1,
  pageSize = 10,
  search = "",
  paymentStatus = "",
}) => {
  const filters = [];

  if (search && search.trim() !== "") {
    const q = `%${search.trim()}%`;
    filters.push(
      or(
        sql`${order.id}::text ILIKE ${q}`,
        sql`${payment.paymentId} ILIKE ${q}`,
        sql`${payment.paymentOrderId} ILIKE ${q}`,
        sql`COALESCE(${users.email}, '') ILIKE ${q}`,
        sql`COALESCE(${users.name}, '') ILIKE ${q}`,
      ),
    );
  }

  if (paymentStatus && paymentStatus.trim() !== "") {
    filters.push(eq(payment.paymentStatus, paymentStatus));
  }

  const whereClause = filters.length ? and(...filters) : undefined;
  const offset = (page - 1) * pageSize;

  const baseSelect = () =>
    db
      .select({
        payment,
        order,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(payment)
      .innerJoin(order, eq(payment.orderId, order.id))
      .leftJoin(users, eq(order.userId, users.id));

  const rows = whereClause
    ? await baseSelect()
      .where(whereClause)
      .orderBy(desc(payment.createdAt))
      .limit(pageSize)
      .offset(offset)
    : await baseSelect()
      .orderBy(desc(payment.createdAt))
      .limit(pageSize)
      .offset(offset);

  const countQuery = db
    .select({ count: sql<number>`count(*)::int` })
    .from(payment)
    .innerJoin(order, eq(payment.orderId, order.id))
    .leftJoin(users, eq(order.userId, users.id));

  const countResult = whereClause
    ? await countQuery.where(whereClause)
    : await countQuery;

  const total = Number(countResult[0]?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    data: rows,
    meta: {
      total,
      totalPages,
      page,
      pageSize,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

export const fetchOrderDetails = async (orderId: string) => {
  try {
    const orderInfo = await db
      .select({
        order,
        users,
        payment,
      })
      .from(order)
      .leftJoin(users, eq(order.userId, users.id))
      .leftJoin(payment, eq(payment.orderId, order.id))
      .where(eq(order.id, orderId))
      .limit(1);

    if (!orderInfo.length) return null;

    const rawItems = await db
      .select({
        item: orderItem,
        product: product,
      })
      .from(orderItem)
      .leftJoin(product, eq(orderItem.productId, product.id))
      .where(eq(orderItem.orderId, orderId));

    const items = rawItems.map((row) => ({
      ...row.item,
      product: row.product,
    }));

    return {
      ...orderInfo[0],
      items,
    };
  } catch (error) {
    console.error("fetchOrderDetails error:", error);
    throw new Error("Failed to fetch order details");
  }
};

export const changeOrderStatus = async (id: string, status: string) => {
  const result = await db
    .update(order)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(eq(order.id, id))
    .returning();

  return result[0];
};

export async function getOrdersCount() {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(order);

    return Number(result[0]?.count ?? 0);
  } catch (error) {
    console.error("getOrdersCount failed:", error);
    return 0;
  }
}

export async function getTotalRevenue() {
  try {
    const result = await db
      .select({ total: sql<number>`coalesce(sum(${order.totalAmount}), 0)::int` })
      .from(order);

    return Number(result[0]?.total ?? 0);
  } catch (error) {
    console.error("getTotalRevenue failed:", error);
    return 0;
  }
}

export async function updateOrderStatus(id: string, status: string | any) {
  await changeOrderStatus(id, status);
  revalidatePath("/admin/order");
}
// export async function createOrder({
//   items,
//   userId,
//   fixedAmount,
//   address,
//   razorpayPaymentId,
//   razorpayOrderId,
// }: {
//   items: { productId: string; quantity: number }[];
//   userId: string;
//   fixedAmount: number;
//   address: any;
//   razorpayPaymentId: string;
//   razorpayOrderId: string;
// }) {
//   try {
//     if (!items || items.length === 0) {
//       throw new Error("Order items are required");
//     }

//     const productIds = items.map((i) => (i as any).productId || (i as any).productId);

//     const products = await db
//       .select()
//       .from(product)
//       .where(inArray(product.id, productIds));

//     if (products.length !== items.length) {
//       throw new Error("Some products not found");
//     }

//     const productMap = new Map(products.map((p) => [p.id, p]));

//     const safeAmount = Math.round(fixedAmount);

//     const result = await db.transaction(async (tx) => {
//       const insertedOrder = await tx
//         .insert(order)
//         .values({
//           userId,
//           status: "paid",
//           totalAmountPaid: safeAmount,
//           addressLine1: address.addressLine1,
//           addressLine2: address.addressLine2,
//           city: address.city,
//           state: address.state,
//           pincode: address.pincode,
//         })
//         .returning({ id: order.id });

//       const orderId = insertedOrder[0].id;

//       const orderItemsToInsert = items.map((item) => {
//         const Id = (item as any).productId || (item as any).productId;
//         const p = productMap.get(Id);

//         if (!p || !p.name || !p.slug || p.basePrice == null) {
//           throw new Error("Invalid product data");
//         }

//         return {
//           orderId,
//           productId: p.id,
//           quantity: item.quantity,
//           productName: p.name,
//           productSlug: p.slug,
//           productImage: p.bannerImage ?? null,
//           productSKU: p.sku ?? null,
//           productPrice: p.basePrice,
//         };
//       });

//       await Promise.all([
//         tx.insert(orderItem).values(orderItemsToInsert),
//         tx.insert(payment).values({
//           orderId,
//           paymentId: razorpayPaymentId,
//           paymentStatus: "success",
//           paymentMethod: "razorpay",
//           paymentAmount: safeAmount,
//           paymentCurrency: "INR",
//         }),
//       ]);

//       return { orderId };
//     });
//     const cartRes = await db
//       .select()
//       .from(cart)
//       .where(eq(cart.userId, userId))
//       .limit(1);

//     if (cartRes.length > 0) {
//       await db.delete(cartItem)
//         .where(eq(cartItem.cartId, cartRes[0].id));

//       await db.delete(cart)
//         .where(eq(cart.id, cartRes[0].id));
//     }
//     return {
//       success: true,
//       orderId: result.orderId,
//     };

//   } catch (error) {
//     console.error("Order creation failed:", error);
//     return {
//       success: false,
//       message: "Failed to create order",
//     };
//   }
// }

export async function createOrder({
  address,
  userId,
  razorpayPaymentId,
  razorpayOrderId,
  couponCode,
}: {
  userId: any;
  address: any;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  couponCode?: string | null;
}) {
  try {
    const pricing = await calculateCheckoutPricing({ userId, couponCode });
    const safeAmount = pricing.total;
    const discountAmount = pricing.discountAmount;
    const subtotalAmount = pricing.subtotal;

    const result = await db.transaction(async (tx) => {
      const insertedOrder = await tx
        .insert(order)
        .values({
          userId,
          status: "paid",
          totalAmount: safeAmount,
          subtotalAmount: subtotalAmount,
          discountAmount: discountAmount,
          couponCode: pricing.couponCode,
          addressLine1: address.street,
          addressLine2: address.locality,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        })
        .returning({ id: order.id });

      const orderId = insertedOrder[0].id;

      const orderItemsToInsert = pricing.items.map((item) => ({
        orderId,
        productId: item.product.id,
        quantity: item.quantity,
        productVarientBox: item.productVarientBox,
        productName: item.selectedSize ? `${item.product.name} (${item.selectedSize})` : item.product.name,
        productSlug: item.product.slug,
        productImage: item.product.bannerImage ?? null,
        productSKU: item.product.sku ?? null,
        productPrice: item.price,
      }));

      await Promise.all([
        tx.insert(orderItem).values(orderItemsToInsert),
        tx.insert(payment).values({
          orderId: orderId,
          paymentId: razorpayPaymentId,
          paymentStatus: "success",
          paymentMethod: "razorpay",
          paymentAmount: safeAmount,
          paymentMeta: "success",
          paymentOrderId: razorpayOrderId,
        }),
        tx.insert(rewardCoinsHistory).values({
          orderId: orderId,
          userId: userId,
          coins: safeAmount,
        }),

        await tx
          .update(users)
          .set({
            rewardOrderCoins: sql`${users.rewardOrderCoins} + ${safeAmount}`,
          })
          .where(eq(users.id, userId)),
      ]);

      return { orderId };
    });

    // This part is commented out because the cart is not used yet , we use localstorage for manage cart

    // const cartRes = await db.query.cart.findFirst({
    //   where: eq(cart.userId, userId),
    // });

    const cartRes = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    if (cartRes.length > 0) {
      const cartData = cartRes[0];

      await db.delete(cartItem).where(eq(cartItem.cartId, cartData.id));
      await db.delete(cart).where(eq(cart.id, cartData.id));
    }

    return {
      success: true,
      orderId: result.orderId,
      totalAmount: safeAmount,
      subtotalAmount,
      discountAmount,
      couponCode: pricing.couponCode,
      productNames: pricing.items
        .map((item) => item.product.name)
        .filter(Boolean)
        .join(", "),
    };
  } catch (error) {
    console.error("Order creation failed:", error);
    return {
      success: false,
      message: "Failed to create order",
    };
  }
}

export async function checkUserFirstOrder(userId: string) {
  try {
    const existingOrder = await db.select().from(order).where(eq(order.userId, userId)).limit(1);
    return existingOrder;
  } catch (error) {
    console.error("Error checking user's first order:", error);
    return [];
  }
}

export async function getOrdersByUserId() {
  try {
    const { userId } = await getProfile();
    const orders = await db
      .select()
      .from(order)
      .where(eq(order.userId, userId))
      .orderBy(desc(order.createdAt));

    const orderData = await Promise.all(
      orders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItem)
          .where(eq(orderItem.orderId, order.id));
        return {
          ...order,
          order_items: items,
        };
      }),
    );

    return orderData;
  } catch (error) {
    console.error(error);
  }
}

export async function getOrderById(orderId: string) {
  const rows = await db
    .select({
      order: order,
      item: orderItem,
      product: product,
      payment: payment,
    })
    .from(order)
    .leftJoin(orderItem, eq(order.id, orderItem.orderId))
    .leftJoin(product, eq(orderItem.productId, product.id))
    .leftJoin(payment, eq(order.id, payment.orderId))
    .where(eq(order.id, orderId));

  if (!rows.length) return null;

  const orderData = rows[0].order;

  const items = rows
    .filter((r) => r.item)
    .map((r) => ({
      ...r.item,
      product: r.product ?? null,
    }));

  const paymentData = rows[0].payment ?? null;

  return {
    ...orderData,
    items,
    payment: paymentData,
  };
}
