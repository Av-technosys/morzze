/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";

import slugify from "slugify";
//import path from "path";
import { redirect } from "next/navigation";
import { desc, eq, isNull, ne, or } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";
import { generateUniqueSlug } from "../slug/generateUniqueSlug";
import { and, asc, ilike, sql } from "drizzle-orm";
import { paginate } from "@/lib/pagination";
import { category, productCategory, product, productFilter } from "@/db/schema";
import { cacheRevalidateTime } from "@/const/globalconst";
import {
  CACHE_TAGS,
  revalidateCategoryCache,
  revalidateProductCache,
} from "@/lib/cache-tags";

function revalidateCategorySlugPages(slugs: Array<string | null | undefined>) {
  const uniqueSlugs = new Set(
    slugs.filter((slug): slug is string => Boolean(slug)),
  );

  for (const slug of uniqueSlugs) {
    revalidatePath(`/kitchen/${slug}`);
    revalidatePath(`/bathroom/${slug}`);
  }
}

function normalizeSlug(value: string) {
  return slugify(value || "item", {
    lower: true,
    strict: true,
    trim: true,
  });
}

interface GetCategoriesOptions {
  page?: number;
  pageSize?: any;
  search?: string;
  category: any;
}
export async function createCategory(categoryData: any) {
  try {
    const { name, slug: inputSlug, description, parentId, bannerImage, horizontalBannerImage, type } = categoryData;
    const slug = inputSlug
      ? normalizeSlug(inputSlug)
      : await generateUniqueSlug(db, name, category.slug);

    if (inputSlug) {
      const [existingSlug] = await db
        .select({ id: category.id })
        .from(category)
        .where(eq(category.slug, slug))
        .limit(1);

      if (existingSlug) {
        return { success: false, message: "Category slug already exists" };
      }
    }

    await db.insert(category).values({
      name,
      slug,
      description,
      bannerImage: bannerImage || null,
      horizontalBannerImage: horizontalBannerImage || null,
      type
    });

    revalidateCategoryCache(slug);
    revalidateProductCache();
    revalidateCategorySlugPages([slug]);
    revalidatePath("/admin/category");
    return { success: true, message: "Category created successfully" };
  } catch (error) {
    console.error("Create category failed:", error);
    return { success: false, message: "Failed to create category" };
  }
  redirect("/admin/category");
}

export async function updateCategory(categoryData: any) {
  try {
    const { id, name, slug, description, parentId, bannerImage, horizontalBannerImage, type } =
      categoryData;
    const [existingCategory] = await db
      .select({ slug: category.slug })
      .from(category)
      .where(eq(category.id, id))
      .limit(1);
    const previousSlug = existingCategory?.slug ?? null;
    const nextSlug = normalizeSlug(slug || name);

    const [duplicateSlug] = await db
      .select({ id: category.id })
      .from(category)
      .where(and(eq(category.slug, nextSlug), ne(category.id, id)))
      .limit(1);

    if (duplicateSlug) {
      return { success: false, message: "Category slug already exists" };
    }

    await db
      .update(category)
      .set({
        name,
        slug: nextSlug,
        description,
        bannerImage: bannerImage || null,
        horizontalBannerImage: horizontalBannerImage || null,
        type
      })
      .where(eq(category.id, id));

    revalidateCategoryCache(previousSlug);
    revalidateCategoryCache(nextSlug);
    revalidateProductCache();
    revalidateCategorySlugPages([previousSlug, nextSlug]);
    revalidatePath("/admin/category");
    revalidatePath(`/admin/category/${id}`);
    return { success: true, message: "Category updated successfully" };
  } catch (error) {
    console.error("Update category failed:", error);
    return { success: false, message: "Failed to update category" };
  }
  redirect("/admin/category");
}

export const attachProductCategory = async (
  productId: string,
  categoryId: string,
) => {
  try {
    if (!categoryId) return;

    await db.insert(productCategory).values({
      productId,
      categoryId,
    });

    revalidateProductCache(productId);
    revalidateCategoryCache(categoryId);
  } catch (error) {
    console.error("attach Product Category failed:", error);
    throw new Error("attach Product Category failed");
  }
};

export async function getProductCategory(productId: string) {
  try {
    const result = await db
      .select({
        categoryId: productCategory.categoryId,
        name: category.name,
      })
      .from(productCategory)
      .leftJoin(category, eq(category.id, productCategory.categoryId))
      .where(eq(productCategory.productId, productId));

    return result;
  } catch (error) {
    console.error("fetch product category failed:", error);
    throw new Error("fetch product category failed");
  }
}
export async function updateProductCategory(
  productId: string,
  categoryId: string,
) {
  try {
    await db
      .delete(productCategory)
      .where(eq(productCategory.productId, productId));

    await db.insert(productCategory).values({
      productId,
      categoryId,
    });

    revalidateProductCache(productId);
    revalidateCategoryCache(categoryId);
  } catch (error) {
    console.error("Update product category failed:", error);
    throw new Error("Failed to update category");
  }
}

export async function getCategoriesPagination({
  page = 1,
  pageSize = 10,
  search = "",
  category: categorySlug,
}: GetCategoriesOptions) {
  const filters = [];

  if (search.trim() !== "") {
    filters.push(ilike(category.name, `%${search}%`));
  }

  if (categorySlug) {
    filters.push(eq(category.slug, categorySlug));
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  const result = await paginate({
    table: category,
    page,
    pageSize,
    where: whereClause,
    // orderBy: desc(category.createdAt),
  });

  return {
    items: result.data,
    totalPages: result.meta.totalPages,
    page: result.meta.page,
  };
}
export async function deleteCategory(id: string) {
  try {
    const [existingCategory] = await db
      .select({ slug: category.slug })
      .from(category)
      .where(eq(category.id, id))
      .limit(1);

    const usage = await db
      .select({ count: sql<number>`count(*)` })
      .from(productCategory)
      .where(eq(productCategory.categoryId, id));

    if (usage[0].count > 0) {
      return {
        success: false,
        message: "Cannot delete: this category is assigned to products",
      };
    }

    await db.delete(category).where(eq(category.id, id));

    revalidateCategoryCache(id);
    revalidateCategoryCache(existingCategory?.slug);
    revalidateProductCache();
    revalidateCategorySlugPages([existingCategory?.slug]);
    revalidatePath("/admin/category");

    return {
      success: true,
      message: "Category deleted successfully",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "Something went wrong while deleting category",
    };
  }
}
export async function getCategories(type?: string) {
  const filters = [];
  const categoryListTag = type
    ? `${CACHE_TAGS.categories}:${type}`
    : CACHE_TAGS.categories;

  if (type === "kitchen" || type === "bathroom") {
    filters.push(eq(category.type, type));
  }

  const whereClause = filters.length ? and(...filters) : undefined;
  return unstable_cache(
    async () => {
      try {
        return await db
          .select()
          .from(category)
          .where(whereClause)
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    [CACHE_TAGS.categories, type ?? "all"],
    {
      revalidate: cacheRevalidateTime,
      tags: [CACHE_TAGS.categories, categoryListTag],
    }
  )();
}

export async function getAllProductsByCategorySlug(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const products = await db
          .select({
            id: product.id,
            name: product.name,
            basePrice: product.basePrice,
            strikethroughPrice: product.strikethroughPrice,
            slug: product.slug,
            bannerImage: product.bannerImage,
            rateing1Star: product.rateing1Star,
            rateing2Star: product.rateing2Star,
            rateing3Star: product.rateing3Star,
            rateing4Star: product.rateing4Star,
            rateing5Star: product.rateing5Star,
            sku: product.sku,
            size: product.size,
            filters: sql`
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', ${productFilter.id},
                    'type', ${productFilter.type},
                    'filter', ${productFilter.filter}
                  )
                ) FILTER (WHERE ${productFilter.id} IS NOT NULL),
                '[]'::json
              )
            `.as("filters"),
          })
          .from(product)
          .innerJoin(
            productCategory,
            eq(product.id, productCategory.productId),
          )
          .innerJoin(
            category,
            eq(category.id, productCategory.categoryId),
          )
          .leftJoin(productFilter, eq(product.id, productFilter.productId))
          .where(
            and(
              eq(category.slug, slug),
              or(eq(product.isHidden, false), isNull(product.isHidden))
            )
          )
          .groupBy(
            product.id,
            product.name,
            product.basePrice,
            product.strikethroughPrice,
            product.slug,
            product.bannerImage,
            product.rateing1Star,
            product.rateing2Star,
            product.rateing3Star,
            product.rateing4Star,
            product.rateing5Star,
            product.sku,
            product.size,
          )
          .orderBy(asc(product.sku))

        return products;
      } catch (error) {
        console.error("fetch products by category failed:", error);
        return [];
      }
    },
    [CACHE_TAGS.products, CACHE_TAGS.category(slug), "category-products", slug],
    {
      revalidate: cacheRevalidateTime,
      tags: [CACHE_TAGS.products, CACHE_TAGS.categories, CACHE_TAGS.category(slug)],
    },
  )();
}

export async function getCategoryBySlug(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const result = await db
          .select()
          .from(category)
          .where(eq(category.slug, slug))
          .limit(1);

        return result[0] || null;
      } catch (error) {
        console.error("fetch category by slug failed:", error);
        return null;
      }
    },
    [CACHE_TAGS.category(slug), slug],
    {
      revalidate: cacheRevalidateTime,
      tags: [CACHE_TAGS.categories, CACHE_TAGS.category(slug)],
    },
  )();
}

export async function getCategoriesWithProducts(limit = 4) {
  return unstable_cache(
    async () => {
      try {
        const categories = await db.select().from(category);

        const result = await Promise.all(
          categories.map(async (cat) => {
            const products = await db
              .select({
                id: product.id,
                name: product.name,
                slug: product.slug,
                bannerImage: product.bannerImage,
                basePrice: product.basePrice,
                strikethroughPrice: product.strikethroughPrice,
              })
              .from(product)
              .innerJoin(productCategory, eq(product.id, productCategory.productId))
              .where(
                and(
                  eq(productCategory.categoryId, cat.id),
                  or(eq(product.isHidden, false), isNull(product.isHidden))
                )
              )
              .limit(limit);

            return {
              ...cat,
              products,
            };
          })
        );

        // Only return categories that have at least 1 product
        return result.filter((cat) => cat.products.length > 0);
      } catch (error) {
        console.error("getCategoriesWithProducts failed:", error);
        return [];
      }
    },
    ["categories-with-products", String(limit)],
    { revalidate: cacheRevalidateTime, tags: [CACHE_TAGS.categories, CACHE_TAGS.products] }
  )();
}

export async function getAllCategoriesMeta() {
  return unstable_cache(
    async () => {
      try {
        return await db
          .select({
            id: category.id,
            name: category.name,
          })
          .from(category);
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    ["categories-meta"],
    { revalidate: cacheRevalidateTime, tags: [CACHE_TAGS.categories] },
  )();
}
