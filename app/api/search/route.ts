import { NextResponse } from "next/server";
import { db } from "@/db";
import { product, category, productCategory } from "@/db/schema";
import { ilike, or, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [], categories: [] });
    }

    const pattern = `%${q}%`;

    // Search products (limit 6)
    const matchedProducts = await db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        basePrice: product.basePrice,
        strikethroughPrice: product.strikethroughPrice,
        bannerImage: product.bannerImage,
        sku: product.sku,
      })
      .from(product)
      .where(
        or(
          ilike(product.name, pattern),
          ilike(product.slug, pattern),
          ilike(product.sku, pattern)
        )
      )
      .limit(6);

    // Search categories (limit 4)
    const matchedCategories = await db
      .select({
        id: category.id,
        name: category.name,
        slug: category.slug,
        type: category.type,
        bannerImage: category.bannerImage,
      })
      .from(category)
      .where(
        or(
          ilike(category.name, pattern),
          ilike(category.slug, pattern)
        )
      )
      .limit(4);

    return NextResponse.json({
      products: matchedProducts,
      categories: matchedCategories,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { products: [], categories: [], error: "Search failed" },
      { status: 500 }
    );
  }
}
