import { db } from "@/db";
import { cart, cartItem, coupons, product } from "@/db/schema";
import { eq } from "drizzle-orm";

export type CheckoutPriceItem = {
  productId: string;
  productVarientBox?: string | null;
  selectedSize?: string | null;
  quantity: number;
  price: number;
  product: typeof product.$inferSelect;
};

export type CheckoutPricing = {
  items: CheckoutPriceItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
};

function parseRupeeValue(value: string | null | undefined): number {
  if (!value) return 0;
  const cleaned = value.replace(/[₹,\s]/g, "");
  const num = Number.parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function calculatePercentDiscount(base: number, discountValue: string, upto?: string | null) {
  const percent = Number.parseFloat(discountValue.trim().replace("%", ""));
  if (!Number.isFinite(percent) || percent <= 0) return 0;

  let discount = Math.round((base * percent) / 100);
  const maxDiscount = parseRupeeValue(upto);

  if (maxDiscount > 0 && discount > maxDiscount) {
    discount = maxDiscount;
  }

  return discount;
}

export async function calculateCheckoutPricing({
  userId,
  couponCode,
}: {
  userId: string;
  couponCode?: string | null;
}): Promise<CheckoutPricing> {
  const userCart = await db
    .select()
    .from(cart)
    .where(eq(cart.userId, userId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!userCart) {
    throw new Error("Cart is empty");
  }

  const cartRows = await db
    .select({
      productId: cartItem.productId,
      productVarientBox: cartItem.productVarientBox,
      selectedSize: cartItem.selectedSize,
      quantity: cartItem.quantity,
      product,
    })
    .from(cartItem)
    .innerJoin(product, eq(cartItem.productId, product.id))
    .where(eq(cartItem.cartId, userCart.id));

  if (cartRows.length === 0) {
    throw new Error("Cart is empty");
  }

  const items = cartRows.map((row) => {
    const quantity = Math.max(1, Math.trunc(Number(row.quantity ?? 1)));
    let price = Math.max(0, Math.round(Number(row.product.basePrice ?? 0)));

    if (row.selectedSize && row.product.sizePrices && row.product.sizePrices.length > 0) {
      const matched = (row.product.sizePrices as any[]).find((sp: any) => sp.size === row.selectedSize);
      if (matched) {
        price = Math.max(0, Math.round(Number(matched.price ?? 0)));
      }
    }

    if (!row.product.id || !row.product.name || !row.product.slug || price <= 0) {
      throw new Error("Invalid product in cart");
    }

    return {
      productId: row.productId,
      productVarientBox: row.productVarientBox,
      selectedSize: row.selectedSize,
      quantity,
      price,
      product: row.product,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const normalizedCouponCode = couponCode?.trim().toUpperCase() || null;
  let discountAmount = 0;
  let appliedCouponCode: string | null = null;

  if (normalizedCouponCode) {
    const coupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.couponCode, normalizedCouponCode))
      .limit(1)
      .then((rows) => rows[0]);

    if (
      coupon &&
      coupon.isActive &&
      (!coupon.validUntil || new Date(coupon.validUntil) >= new Date())
    ) {
      const minimumOrder = parseRupeeValue(coupon.minimumOrder);
      if (!minimumOrder || subtotal >= minimumOrder) {
        discountAmount = calculatePercentDiscount(subtotal, coupon.discountValue, coupon.upto);
        appliedCouponCode = coupon.couponCode;
      }
    }
  }

  const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
  const total = Math.max(discountedSubtotal, 0);

  return {
    items,
    subtotal,
    discountAmount,
    total,
    couponCode: appliedCouponCode,
  };
}
