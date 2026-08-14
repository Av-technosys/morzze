/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { db } from "@/db";
import { cart, cartItem, product } from "@/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { requireUserWithRefresh } from "../user/action";

type CartMutationInput = {
  productId?: string;
  productVarientBox?: string | null;
  selectedSize?: string | null;
  quantity?: number;
  isTypeSubscription?: boolean;
  frequencyInMonths?: number | null;
  clientCartItemId?: string | null;
};

type CartTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

class CartMutationError extends Error {}

function normalizeRequestedQuantity(quantity?: number) {
  const numericQuantity = Number(quantity ?? 1);

  if (!Number.isFinite(numericQuantity)) {
    return null;
  }

  return Math.trunc(numericQuantity);
}

async function getCurrentUserIdForCart() {
  try {
    const { userId } = await requireUserWithRefresh();
    return userId ?? null;
  } catch {
    return null;
  }
}

async function getOrCreateLockedCart(tx: CartTransaction, userId: string) {
  let userCart = await tx
    .select()
    .from(cart)
    .where(eq(cart.userId, userId))
    .limit(1)
    .then((r) => r[0]);

  if (!userCart) {
    userCart = await tx
      .insert(cart)
      .values({
        id: uuidv4(),
        userId,
      })
      .returning()
      .then((r) => r[0]);
  }

  if (!userCart) {
    throw new Error("Unable to create cart");
  }

  await tx.execute(sql`SELECT id FROM cart WHERE id = ${userCart.id} FOR UPDATE`);

  return userCart;
}

function getCartItemWhere(
  cartId: string,
  productId: string,
  productVarientBox?: string | null,
  selectedSize?: string | null,
) {
  return and(
    eq(cartItem.cartId, cartId),
    eq(cartItem.productId, productId),
    productVarientBox
      ? eq(cartItem.productVarientBox, productVarientBox)
      : sql`${cartItem.productVarientBox} IS NULL`,
    selectedSize
      ? eq(cartItem.selectedSize, selectedSize)
      : sql`${cartItem.selectedSize} IS NULL`,
  );
}

export async function setUserCartItemQuantity(input: CartMutationInput) {
  const userId = await getCurrentUserIdForCart();

  if (!userId) {
    return { success: true, userIsNotLoggedIn: true };
  }

  if (!input.productId) {
    return { success: false, message: "Product id is required" };
  }

  const quantity = normalizeRequestedQuantity(input.quantity);

  if (quantity === null) {
    return { success: false, message: "Quantity is required" };
  }

  try {
    await db.transaction(async (tx) => {
      const [existingProduct] = await tx
        .select({ id: product.id })
        .from(product)
        .where(eq(product.id, input.productId!))
        .limit(1);

      if (!existingProduct) {
        throw new CartMutationError("Product not found");
      }

      const userCart = await getOrCreateLockedCart(tx, userId);
      const where = getCartItemWhere(
        userCart.id,
        input.productId!,
        input.productVarientBox ?? null,
        input.selectedSize ?? null,
      );

      if (quantity <= 0) {
        await tx.delete(cartItem).where(where);
        return;
      }

      const [existingItem] = await tx
        .select()
        .from(cartItem)
        .where(where)
        .limit(1);

      if (existingItem) {
        await tx
          .update(cartItem)
          .set({
            quantity,
            isTypeSubscription: input.isTypeSubscription ?? existingItem.isTypeSubscription,
            frequencyInMonths:
              input.frequencyInMonths ?? existingItem.frequencyInMonths,
            clientCartItemId:
              input.clientCartItemId ?? existingItem.clientCartItemId,
          })
          .where(eq(cartItem.id, existingItem.id));
        return;
      }

      await tx.insert(cartItem).values({
        id: uuidv4(),
        cartId: userCart.id,
        productId: input.productId!,
        productVarientBox: input.productVarientBox ?? null,
        selectedSize: input.selectedSize ?? null,
        quantity,
        isTypeSubscription: input.isTypeSubscription ?? false,
        frequencyInMonths: input.frequencyInMonths ?? null,
        clientCartItemId: input.clientCartItemId ?? null,
      });
    });

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Cart quantity sync failed:", error);

    if (error instanceof CartMutationError) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Failed to update cart" };
  }
}

export async function getCart() {
  try {
    const userId = await getCurrentUserIdForCart();

    if (!userId) {
      return { success: true, items: [], userIsNotLoggedIn: true };
    }

    const userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .then((r) => r[0]);

    if (!userCart) {
      return { success: true, items: [] };
    }

    const itemsWithDetails = await db
      .select({
        productId: cartItem.productId,
        productVarientBox: cartItem.productVarientBox,
        selectedSize: cartItem.selectedSize,
        isTypeSubscription: cartItem.isTypeSubscription,
        frequencyInMonths: cartItem.frequencyInMonths,
        quantity: cartItem.quantity,
        title: product.name,
        image: product.bannerImage,
        price: product.basePrice,
        sizePrices: product.sizePrices,
        originalPrice: product.strikethroughPrice,
        slug: product.slug,
        sku: product.sku,
      })
      .from(cartItem)
      .leftJoin(product, eq(cartItem.productId, product.id))
      .where(eq(cartItem.cartId, userCart.id));

    // Resolve size-specific prices
    const resolvedItems = itemsWithDetails.map((item: any) => {
      let finalPrice = item.price;
      if (item.selectedSize && item.sizePrices && item.sizePrices.length > 0) {
        const matched = item.sizePrices.find((sp: any) => sp.size === item.selectedSize);
        if (matched) {
          finalPrice = matched.price;
        }
      }
      return {
        ...item,
        price: finalPrice,
      };
    });

    return { success: true, items: resolvedItems };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { success: false, error: "Failed to fetch cart" };
  }
}
export async function addToCart(
  productId: string,
  quantity: any,
  selectedPlan: any,
  isSubscribed: any,
  cartSizes?: any,
  uuid?:any
) {
  try {
    const userId = await getCurrentUserIdForCart();

    if (!userId) {
      return {
        success: false,
        error: "UNAUTHORIZED",
      };
    }
    const result = await db.transaction(async (tx) => {
      // Get or create cart
      let existingCart = await tx
        .select()
        .from(cart)
        .where(eq(cart.userId, userId))
        .then((r) => r[0]);

      if (!existingCart) {
        const [newCart] = await tx
          .insert(cart)
          .values({
            id: uuidv4(),
            userId,
          })
          .returning();
        existingCart = newCart;
      }

      // Lock the cart row to prevent race conditions
      await tx.execute(
        sql`SELECT id FROM cart WHERE id = ${existingCart.id} FOR UPDATE`,
      );

      if (!cartSizes || cartSizes.length === 0) {
        // Check if item already exists
        const existingItem = await tx
          .select()
          .from(cartItem)
          .where(
            and(
              eq(cartItem.cartId, existingCart.id),
              eq(cartItem.productId, productId),
            ),
          )
          .then((r) => r[0]);

        if (existingItem) {
          const currentQuantity = existingItem.quantity ?? 0;
          const newQuantity = currentQuantity + quantity;
          // Update quantity
          await tx
            .update(cartItem)
            .set({ quantity: newQuantity })
            .where(eq(cartItem.id, existingItem.id));

          return {
            success: true,
            action: "updated",
            quantity: newQuantity,
          };
        } else {
          // Insert new item
          await tx.insert(cartItem).values({
            id: uuidv4(),
            cartId: existingCart.id,
            productId,
            quantity,
            isTypeSubscription: isSubscribed,
            frequencyInMonths:selectedPlan !== null && selectedPlan?.period,
          });

          return {
            success: true,
            action: "added",
            quantity,
          };
        }
      } else {
        await tx.insert(cartItem).values(
          cartSizes.map((size: any) => ({
            id: uuidv4(),
            cartId: existingCart.id,
            productId,
            quantity: size.qty,
            productVarientBox: size.id,
            isTypeSubscription: isSubscribed,
            frequencyInMonths:selectedPlan !== null && selectedPlan?.period,
            clientCartItemId:uuid
          })),
        );

        return {
          success: true,
          action: "added",
          quantity,
        };
      }
    });

    revalidatePath("/cart");
    return result;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}

export async function removeFromCart(
  productId: string,
  uuid?: any,
  cartSizes?: any,
) {
  try {
    const userId = await getCurrentUserIdForCart();

    if (!userId) {
      return { success: true, userIsNotLoggedIn: true };
    }

    const result = await db.transaction(async (tx) => {
      const userCart = await tx
        .select()
        .from(cart)
        .where(eq(cart.userId, userId))
        .then((r) => r[0]);

      if (!userCart) {
        return { success: true };
      }

      // Lock the cart
      await tx.execute(
        sql`SELECT id FROM cart WHERE id = ${userCart.id} FOR UPDATE`,
      );

      if (!cartSizes || cartSizes.length === 0) {
        await tx.delete(cartItem).where(
          and(
            eq(cartItem.cartId, userCart.id),
            eq(cartItem.productId, productId),
            // eq(cartItem.uuid,uuid)  yeh krna hai jab cart me uuid set ho jaye tab taki vhi product remove ho jiski uuid match ho nhii toh yeh same productgvareint wale sbhii ko uda dega..
          ),
        );
      } else {
        await tx.delete(cartItem).where(
          and(
            eq(cartItem.cartId, userCart.id),
            eq(cartItem.productId, productId),
            eq(cartItem.clientCartItemId,uuid),
            inArray(
              cartItem.productVarientBox,
              cartSizes.map((item: any) => item.id),
            ),
            // eq(cartItem.uuid,uuid)  yeh krna hai jab cart me uuid set ho jaye tab taki vhi product remove ho jiski uuid match ho nhii toh yeh same productgvareint wale sbhii ko uda dega..
          ),
        );
      }

      return { success: true };
    });

    revalidatePath("/cart");
    return result;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return { success: false, error: "Failed to remove from cart" };
  }
}

export async function updateCartItemQuantity(
  productId: string,
  quantity: number,
) {
  try {
    const userId = await getCurrentUserIdForCart();

    if (!userId) {
      return { success: true, userIsNotLoggedIn: true };
    }

    if (quantity < 0) {
      return { success: false, error: "Invalid quantity" };
    }

    const result = await db.transaction(async (tx) => {
      const userCart = await tx
        .select()
        .from(cart)
        .where(eq(cart.userId, userId))
        .then((r) => r[0]);

      if (!userCart) {
        return { success: true };
      }

      // Lock the cart
      await tx.execute(
        sql`SELECT id FROM cart WHERE id = ${userCart.id} FOR UPDATE`,
      );

      if (quantity === 0) {
        // Remove item if quantity is 0
        await tx
          .delete(cartItem)
          .where(
            and(
              eq(cartItem.cartId, userCart.id),
              eq(cartItem.productId, productId),
            ),
          );
      } else {
        // Update quantity
        await tx
          .update(cartItem)
          .set({ quantity })
          .where(
            and(
              eq(cartItem.cartId, userCart.id),
              eq(cartItem.productId, productId),
            ),
          );
      }

      return { success: true };
    });

    revalidatePath("/cart");
    return result;
  } catch (error) {
    console.error("Error updating cart:", error);
    return { success: false, error: "Failed to update cart" };
  }
}

export async function clearCart() {
  try {
    const userId = await getCurrentUserIdForCart();

    if (!userId) {
      return { success: true, userIsNotLoggedIn: true };
    }

    const result = await db.transaction(async (tx) => {
      const userCart = await tx
        .select()
        .from(cart)
        .where(eq(cart.userId, userId))
        .then((r) => r[0]);

      if (!userCart) {
        return { success: true };
      }

      // Lock the cart
      await tx.execute(
        sql`SELECT id FROM cart WHERE id = ${userCart.id} FOR UPDATE`,
      );

      await tx.delete(cartItem).where(eq(cartItem.cartId, userCart.id));

      return { success: true };
    });

    revalidatePath("/cart");
    return result;
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}

export async function syncCartWithDatabase() {
  try {
    const userId = await getCurrentUserIdForCart();

    if (!userId) {
      return { success: true, items: [], userIsNotLoggedIn: true };
    }

    const userCart = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId))
      .then((r) => r[0]);

    if (!userCart) {
      return { success: true, items: [] };
    }

    const cartItems = await db
      .select()
      .from(cartItem)
      .where(eq(cartItem.cartId, userCart.id));

    return { success: true, items: cartItems };
  } catch (error) {
    console.error("Error syncing cart:", error);
    return { success: false, error: "Failed to sync cart" };
  }
}
