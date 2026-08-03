"use server";

import { db } from "@/lib/db";

import { revalidatePath, unstable_cache } from "next/cache";
import { and, desc, asc, eq, gte, ilike, inArray, isNull, lte, ne, or, sql, SQL, exists } from "drizzle-orm";
import { generateUniqueSlug } from "../slug/generateUniqueSlug";

import {
  category,
  product,
  productCategory,
  productAttribute,
  productMedia,
  productVarientBox,
  productFilter,
  productFaq,
  review,
  reviewMedia,
  cartItem,
  wishlistItem,
  orderItem,
} from "@/db/schema";
import { bestSellingSlug, cacheRevalidateTime, isUUID } from "@/const/globalconst";
import {
  CACHE_TAGS,
  revalidateCategoryCache,
  revalidateProductCache,
} from "@/lib/cache-tags";
import { normalizeSize, formatSize } from "@/lib/size";

interface GetProductsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string | string[];
  type?: string | string[];
  material?: string | string[];
  finish?: string | string[];
  size?: string | string[];
  flow?: string | string[];
  cramps?: string | string[];
  allergies?: string | string[];
  min?: any;
  max?: any;
  stock?: any;
  brand?: any;
  sort?: string;
  includeHidden?: boolean;
}

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

function num(fd: FormData, key: string) {
  const v = Number(fd.get(key));
  return isNaN(v) ? 0 : v;
}

function parseMedia(fd: FormData) {
  return fd.getAll("media").filter((v) => typeof v === "string") as string[];
}

interface VariantInput {
  name: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  price: number;
  strikethroughPrice?: number;
  bannerImage?: string;
  media?: string[];
  isInStock: boolean;
  isReturnable: boolean;
  isCancelable: boolean;
  isReplacement: boolean;
  returnDays: number;
  highlights: string[];
  replacementDays: number;
  attributes: { attribute: string; value: string }[];
  subscriptionPlans?: number[];
}

function isMissingProductFaqTableError(error: any) {
  return error?.code === "42P01" || error?.cause?.code === "42P01";
}

function revalidateProductPages(slugs: Array<string | null | undefined>) {
  revalidatePath("/products");

  const uniqueSlugs = new Set(
    slugs.filter((slug): slug is string => Boolean(slug)),
  );

  for (const slug of uniqueSlugs) {
    revalidatePath(`/product/${slug}`);
  }
}

function revalidateProductCategoryPages(slugs: Array<string | null | undefined>) {
  const uniqueSlugs = new Set(
    slugs.filter((slug): slug is string => Boolean(slug)),
  );

  for (const slug of uniqueSlugs) {
    revalidatePath(`/kitchen/${slug}`);
    revalidatePath(`/bathroom/${slug}`);
  }
}

async function getCategorySlugsByIds(categoryIds: string[]) {
  if (!categoryIds.length) return [];

  const rows = await db
    .select({ slug: category.slug })
    .from(category)
    .where(inArray(category.id, categoryIds));

  return rows.map((row) => row.slug);
}

async function getProductCategorySlugs(productId: string) {
  const rows = await db
    .select({ slug: category.slug })
    .from(category)
    .innerJoin(productCategory, eq(category.id, productCategory.categoryId))
    .where(eq(productCategory.productId, productId));

  return rows.map((row) => row.slug);
}

async function getProductFaqRows(productId: string) {
  try {
    return await db
      .select()
      .from(productFaq)
      .where(eq(productFaq.productId, productId));
  } catch (error) {
    if (!isMissingProductFaqTableError(error)) throw error;
    console.warn("product_faq table is missing; returning empty product FAQs");
    return [];
  }
}

async function hasProductFaqTable() {
  const result = (await db.execute(
    sql`select to_regclass('public.product_faq') as table_name`,
  )) as unknown as { table_name: string | null }[];

  return Boolean(result[0]?.table_name);
}

// export async function createProduct(formData: FormData) {
//   try {
//     // const categoryIds = [
//     //   ...new Set(formData.getAll("category[]").filter(Boolean)),
//     // ] as string[];
//     // const variantsData = str(formData, "variants");
//     // if (!variantsData) throw new Error("No variants provided");
//     // const variants: VariantInput[] = JSON.parse(variantsData);
//     // const productId = await db.transaction(async (tx) => {
//     //   // 1. Create the parent product
//     //   const [createdProduct] = await tx
//     //     .insert(product)
//     //     .values({})
//     //     .returning({ id: product.id });
//     //   const pId = createdProduct.id;
//     //   // 2. Attach categories to the parent product
//     //   if (categoryIds.length) {
//     //     await tx.insert(productCategory).values(
//     //       categoryIds.map((catId) => ({
//     //         productId: pId,
//     //         categoryId: catId,
//     //       })),
//     //     );
//     //   }
//     //   const slugs = await Promise.all(
//     //     variants.map((v) =>
//     //       generateUniqueSlug(tx, v.name, product.slug)
//     //     )
//     //   );
//     //   const variantInsertData = variants.map((v, index) => ({
//     //     productId: pId,
//     //     name: v.name,
//     //     slug: slugs[index],
//     //     sku: v.sku,
//     //     description: v.description,
//     //     shortDescription: v.shortDescription,
//     //     basePrice: v.price,
//     //     strikethroughPrice: v.strikethroughPrice,
//     //     bannerImage: v.bannerImage || null,
//     //     isInStock: v.isInStock,
//     //     isReturnable: v.isReturnable,
//     //     isCancelable: v.isCancelable,
//     //     isReplacement: v.isReplacement,
//     //     returnDays: v.returnDays,
//     //     highlights: v.highlights || [],
//     //     replacementDays: v.replacementDays,
//     //     rating: 0,
//     //     reviewCount: 0,
//     //   }));
//     //   const insertedVariants = await tx
//     //     .insert(product)
//     //     .values(variantInsertData)
//     //     .returning({ id: product.id });
//     //   const allMediaRows: {
//     //     productId: string;
//     //     mediaType: string;
//     //     mediaURL: string;
//     //   }[] = [];
//     //   const allAttributeRows: {
//     //     productId: string;
//     //     attribute: string;
//     //     value: string;
//     //   }[] = [];
//     //   const allSubscriptionRows: {
//     //     productId: string;
//     //     subscriptionPlanId: number;
//     //   }[] = [];
//     //   for (let i = 0; i < variants.length; i++) {
//     //     const variantId = insertedVariants[i].id;
//     //     const v = variants[i];
//     //     // Media
//     //     if (v.media?.length) {
//     //       for (const url of v.media) {
//     //         allMediaRows.push({
//     //           productId: variantId,
//     //           mediaType: "image",
//     //           mediaURL: url,
//     //         });
//     //       }
//     //     }
//     //     // Attributes
//     //     if (v.attributes?.length) {
//     //       for (const attr of v.attributes) {
//     //         allAttributeRows.push({
//     //           productId: variantId,
//     //           attribute: attr.attribute,
//     //           value: attr.value,
//     //         });
//     //       }
//     //     }
//     //     // Subscriptions
//     //     if (v.subscriptionPlans?.length) {
//     //       for (const planId of v.subscriptionPlans) {
//     //         allSubscriptionRows.push({
//     //           productId: variantId,
//     //           subscriptionPlanId: planId
//     //         });
//     //       }
//     //     }
//     //   }
//     //   if (allMediaRows.length) {
//     //     await tx.insert(productMedia).values(allMediaRows);
//     //   }
//     //   if (allAttributeRows.length) {
//     //     await tx.insert(productAttribute).values(allAttributeRows);
//     //   }
//     //   // if (allSubscriptionRows.length) {
//     //   //   await tx.insert(productVariantSubscriptionPlan).values(allSubscriptionRows);
//     //   // }
//     //   return pId;
//     // });
//     // return { id: productId };
//   } catch (error) {
//     console.error("createProduct failed:", error);
//     throw new Error("Unable to create product");
//   }
// }

export async function createProduct(formData: FormData): Promise<void> {
  try {
    const categoryIds = [
      ...new Set(formData.getAll("category[]").filter(Boolean)),
    ] as string[];

    const variantsData = str(formData, "variants");
    if (!variantsData) throw new Error("No variants provided");

    const variants: any = JSON.parse(variantsData);
    const canWriteProductFaq = await hasProductFaqTable();
    let createdSlug: string | null = null;

    await db.transaction(async (tx) => {
      const slug = await generateUniqueSlug(tx, variants.name, product.slug);
      createdSlug = slug;
      // 1. Create Product
      // Derive a single canonical size from the size filter values
      const sizeFilterValues: string[] = (variants.filters || [])
        .filter((f: any) => f?.type === "size" && f?.filter)
        .map((f: any) => normalizeSize(f.filter));
      const canonicalSize = sizeFilterValues[0] ?? null;

      const [newProduct] = await tx
        .insert(product)
        .values({
          name: variants.name,
          brand: variants.brand,
          slug: slug,
          sku: variants.sku,
          metaTitle: variants.metaTitle,
          metaDescription: variants.metaDescription,
          description: variants.description,
          basePrice: variants.price,
          strikethroughPrice: variants.strikethroughPrice,
          bannerImage: variants.bannerImage || null,
          isInStock: variants.isInStock,
          hasVarientBox: variants.hasVarientBox,
          highlights: variants.highlights || [],
          size: canonicalSize,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: product.id });

      const productId = newProduct.id;

      // 2. Insert Categories
      if (categoryIds.length) {
        await tx.insert(productCategory).values(
          categoryIds.map((catId) => ({
            productId,
            categoryId: catId,
          })),
        );
      }

      // 3. Insert Media
      if (variants.media?.length) {
        await tx.insert(productMedia).values(
          variants.media.map((media: any) => ({
            productId,
            mediaType: media.mediaType,
            mediaURL: media.mediaURL,
          })),
        );
      }

      // 4. Insert Attributes
      if (variants.attributes?.length) {
        await tx.insert(productAttribute).values(
          variants.attributes.map((attr: any) => ({
            productId,
            attribute: attr.attribute,
            value: attr.value,
          })),
        );
      }

      // 5. Insert Filters (normalize size values before saving)
      if (variants.filters?.length) {
        const filterPayload = variants.filters
          .filter(
            (f: any) =>
              (f?.slug || f?.filter)?.trim()?.length > 0 &&
              f?.type?.trim()?.length > 0,
          )
          .map((f: any) => {
            const rawFilter = (f.slug || f.filter).trim();
            const normalizedFilter =
              f.type.trim() === "size" ? normalizeSize(rawFilter) : rawFilter;
            return {
              productId,
              filter: normalizedFilter,
              type: f.type.trim(),
            };
          });

        if (filterPayload.length > 0) {
          await tx.insert(productFilter).values(filterPayload);
        }
      }

      // 8. Insert FAQ DATA
      // 7. Insert FAQs
      if (canWriteProductFaq && variants.faqs?.length) {
        await tx.insert(productFaq).values(
          variants.faqs.map((faq: any) => ({
            productId,
            question: faq.question,
            answer: faq.answer,
          })),
        );
      }

      // 6. Insert Variant Boxes
      if (variants.VarientBoxes?.length) {
        await tx.insert(productVarientBox).values(
          variants.VarientBoxes.map((varient: any) => ({
            productId,
            name: varient.name,
            description: varient.description,
            image: varient.image,
          })),
        );
      }
    });

    revalidateProductCache(createdSlug);
    revalidateCategoryCache();
    revalidateProductPages([createdSlug]);
    revalidateProductCategoryPages(await getCategorySlugsByIds(categoryIds));
    revalidatePath("/admin/product");
  } catch (error) {
    console.error("createProduct failed:", error);
    throw new Error("Unable to create product");
  }
}

export async function updateProduct(formData: FormData): Promise<void> {
  try {
    const productId = formData.get("id") as string;
    if (!productId) throw new Error("Product ID missing");

    const categoryIds = [
      ...new Set(formData.getAll("category[]").filter(Boolean)),
    ] as string[];

    const variantsData = str(formData, "variants");
    if (!variantsData) throw new Error("No variants provided");

    const variants: any = JSON.parse(variantsData);
    const faqs = variants.faqs || [];
    const canWriteProductFaq = await hasProductFaqTable();
    const [existingProduct] = await db
      .select({ slug: product.slug })
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);
    const previousSlug = existingProduct?.slug ?? null;
    const nextSlug = variants.slug ?? previousSlug;
    const previousCategorySlugs = await getProductCategorySlugs(productId);

    await db.transaction(async (tx) => {
      // 1. Update categories for the parent product
      await tx
        .delete(productCategory)
        .where(eq(productCategory.productId, productId));
      if (categoryIds.length) {
        await tx.insert(productCategory).values(
          categoryIds.map((catId) => ({
            productId,
            categoryId: catId,
          })),
        );
      }

      // Update or Insert variants

      let vId = productId;

      if (vId) {
        // Derive canonical size from filter payload for products.size column
        const updSizeValues: string[] = (variants.filters || [])
          .filter((f: any) => f?.type === "size" && f?.filter)
          .map((f: any) => normalizeSize(f.filter));
        const updCanonicalSize = updSizeValues[0] ?? null;

        // Update existing
        await tx
          .update(product)
          .set({
            name: variants.name,
            brand: variants.brand,
            sku: variants.sku,
            slug: variants.slug,
            metaTitle: variants.metaTitle,
            metaDescription: variants.metaDescription,
            description: variants.description,
            basePrice: variants.price,
            strikethroughPrice: variants.strikethroughPrice,
            bannerImage: variants.bannerImage || null,
            isInStock: variants.isInStock,
            isHidden: variants.isHidden ?? false,
            hasVarientBox: variants.hasVarientBox,
            highlights: variants.highlights || [],
            size: updCanonicalSize,
            updatedAt: new Date(),
          })
          .where(eq(product.id, vId));
      }

      // Update Media
      await tx.delete(productMedia).where(eq(productMedia.productId, vId!));

      const mediaItems = Array.isArray(variants.media)
        ? variants.media
        : (variants.gallery || []).map((url: any) => ({
          mediaType: "image",
          mediaURL: url.preview || url,
        }));
      const validMediaItems = mediaItems.filter((item: any) => item?.mediaURL);

      if (validMediaItems.length) {
        await tx.insert(productMedia).values(
          validMediaItems.map((item: any) => ({
            productId: vId!,
            mediaType: item.mediaType || "image",
            mediaURL: item.mediaURL,
          })),
        );
      }

      // Update Attributes
      await tx
        .delete(productAttribute)
        .where(eq(productAttribute.productId, vId!));
      if (variants.attributes?.length) {
        await tx.insert(productAttribute).values(
          variants.attributes.map((attr: any) => ({
            productId: vId!,
            attribute: attr.attribute,
            value: attr.value,
          })),
        );
      }

      // Update Filters (normalize size values before saving)
      await tx.delete(productFilter).where(eq(productFilter.productId, vId!));

      if (variants.filters?.length) {
        const filterPayload = variants.filters
          .filter(
            (f: any) =>
              (f?.slug || f?.filter)?.trim()?.length > 0 &&
              f?.type?.trim()?.length > 0,
          )
          .map((f: any) => {
            const rawFilter = (f.slug || f.filter).trim();
            const normalizedFilter =
              f.type.trim() === "size" ? normalizeSize(rawFilter) : rawFilter;
            return {
              productId: vId!,
              filter: normalizedFilter,
              type: f.type.trim(),
            };
          });

        if (filterPayload.length > 0) {
          await tx.insert(productFilter).values(filterPayload);
        }
      }

      await tx
        .delete(productVarientBox)
        .where(eq(productVarientBox.productId, vId!));
      if (variants.VarientBoxes?.length) {
        await tx.insert(productVarientBox).values(
          variants.VarientBoxes.map((varient: any) => ({
            productId: vId!,
            name: varient.name,
            description: varient.description,
            image: varient.image,
          })),
        );
      }

      //update faq

      // FAQ UPDATE
      if (canWriteProductFaq) {
        await tx.delete(productFaq).where(eq(productFaq.productId, vId!));

        if (faqs.length) {
          await tx.insert(productFaq).values(
            faqs.map((faq: any) => ({
              productId: vId!,
              question: faq.question,
              answer: faq.answer,
            })),
          );
        }
      }

      // Update Subscriptions
      // await tx
      //   .delete(productVariantSubscriptionPlan)
      //   .where(eq(productVariantSubscriptionPlan.productId, vId!));
      // if (v.subscriptionPlans?.length) {
      //   await tx.insert(productVariantSubscriptionPlan).values(
      //     v.subscriptionPlans.map((planId) => ({
      //       productId: vId!,
      //       subscriptionPlanId: planId
      //     }))
      //   )
      // }
    });

    revalidateProductCache(previousSlug);
    revalidateProductCache(nextSlug);
    revalidateProductCache(productId);
    revalidateCategoryCache();
    revalidateProductPages([previousSlug, nextSlug]);
    revalidateProductCategoryPages([
      ...previousCategorySlugs,
      ...(await getCategorySlugsByIds(categoryIds)),
    ]);
    revalidatePath("/admin/product");
  } catch (error) {
    console.error("updateProduct failed:", error);
    throw new Error("Unable to update product");
  }
}

// add new query for get faq by id

export async function getFullProductDetails(identifier: string) {
  return unstable_cache(
    async () => {
      try {
        if (!identifier) throw new Error("Missing product identifier");

        // 1. Slug se product lao
        const [productDeails] = await db
          .select()
          .from(product)
          .where(and(eq(product.slug, identifier), or(eq(product.isHidden, false), isNull(product.isHidden))))
          .limit(1);

        if (!productDeails) throw new Error("Product not found");

        // 2. Product ID nikalo
        const productId = productDeails.id;

        // 3. Parallel me sab data fetch karo
        const [
          prodcutVarientBoxRes,
          categoryRes,
          productAttributeRes,
          productMediaRes,
          filters,
          productFaqRes,
        ] = await Promise.all([
          db
            .select()
            .from(productVarientBox)
            .where(eq(productVarientBox.productId, productId)),

          db
            .select()
            .from(category)
            .leftJoin(productCategory, eq(category.id, productCategory.categoryId))
            .where(eq(productCategory.productId, productId)),

          db
            .select()
            .from(productAttribute)
            .where(eq(productAttribute.productId, productId)),

          db
            .select()
            .from(productMedia)
            .where(eq(productMedia.productId, productId)),

          db
            .select()
            .from(productFilter)
            .where(eq(productFilter.productId, productId)),

          // FAQ FETCH
          getProductFaqRows(productId),
        ]);

        // 4. Final response
        return {
          ...productDeails,
          prodcutVarientBoxRes,
          categoryRes,
          productAttributeRes,
          productMediaRes,
          filters,
          productFaqRes, // <-- ye add karna important h
        };
      } catch (error) {
        console.error("getFullProduct failed:", error);
        throw new Error("Unable to fetch product");
      }
    },
    [CACHE_TAGS.product(identifier), identifier],
    {
      revalidate: cacheRevalidateTime,
      tags: [CACHE_TAGS.products, CACHE_TAGS.product(identifier)],
    },
  )();
}

export async function getFullProduct(identifier: string) {
  try {
    if (!identifier) throw new Error("Missing product identifier");

    const isThroughId = isUUID(identifier);
    if (!isThroughId) throw new Error("Invalid product identifier");

    const [productDeails] = await db
      .select()
      .from(product)
      .where(eq(product.id, identifier))
      .limit(1);
    if (!productDeails) throw new Error("Product not found");

    const [
      prodcutVarientBoxRes,
      categoryRes,
      productAttributeRes,
      productMediaRes,
      filters,
      productFaqRes,
    ] = await Promise.all([
      db
        .select()
        .from(productVarientBox)
        .where(eq(productVarientBox.productId, productDeails.id)),
      db
        .select()
        .from(category)
        .leftJoin(productCategory, eq(category.id, productCategory.categoryId))
        .where(eq(productCategory.productId, productDeails.id)),
      db
        .select()
        .from(productAttribute)
        .where(eq(productAttribute.productId, productDeails.id)),
      db
        .select()
        .from(productMedia)
        .where(eq(productMedia.productId, productDeails.id)),

      db
        .select()
        .from(productFilter)
        .where(eq(productFilter.productId, identifier)),

      getProductFaqRows(productDeails.id),
    ]);

    return {
      ...productDeails,
      prodcutVarientBoxRes,
      categoryRes,
      productAttributeRes,
      productMediaRes,
      filters,
      productFaqRes,
    };
  } catch (error) {
    console.error("getFullProduct failed:", error);
    throw new Error("Unable to fetch product");
  }
}

export async function getCategoryName(categoryId: any) {
  try {
    const categoryName = await db
      .select({ name: category.name })
      .from(category)
      .where(eq(category.id, categoryId))
      .limit(1);
    return categoryName[0].name;
  } catch (error) {
    console.error("getCategoryName failed:", error);
    throw new Error("Unable to fetch category name");
  }
}

export async function getProductSimilarProducts(slug: string | any) {
  return unstable_cache(
    async () => {
      try {
        const [v] = await db
          .select()
          .from(product)
          .where(eq(product.slug, slug))
          .limit(1);
        if (!v || !v.id) return [];

        const productWithCategory = await db
          .select({ categoryId: productCategory.categoryId })
          .from(productCategory)
          .where(eq(productCategory.productId, v.id));

        if (!productWithCategory.length) return [];

        const categoryId = productWithCategory[0].categoryId;

        const similarVariants = await db
          .select({
            id: product.id,
            name: product.name,
            slug: product.slug,
            basePrice: product.basePrice,
            bannerImage: product.bannerImage,
            rateing1Star: product.rateing1Star,
            rateing2Star: product.rateing2Star,
            rateing3Star: product.rateing3Star,
            rateing4Star: product.rateing4Star,
            rateing5Star: product.rateing5Star,
            hasVarientBox: product.hasVarientBox,
            strikethroughPrice: product.strikethroughPrice,
            category: category.name,
          })
          .from(product)
          .innerJoin(productCategory, eq(productCategory.productId, product.id))
          .innerJoin(category, eq(category.id, productCategory.categoryId))
          .where(
            and(
              eq(productCategory.categoryId, categoryId),
              ne(product.id, v.id),
              or(eq(product.isHidden, false), isNull(product.isHidden)),
            ),
          )
          .limit(10);

        return similarVariants;
      } catch (error) {
        console.error("getProductSimilarProducts failed:", error);
        return [];
      }
    },
    ["similar-products", String(slug)],
    {
      revalidate: cacheRevalidateTime,
      tags: [CACHE_TAGS.products, CACHE_TAGS.product(String(slug))],
    },
  )();
}

export async function deleteProduct(id: string) {
  try {
    const [existingProduct] = await db
      .select({ slug: product.slug })
      .from(product)
      .where(eq(product.id, id))
      .limit(1);
    const deletedSlug = existingProduct?.slug ?? null;
    const deletedCategorySlugs = await getProductCategorySlugs(id);

    await db.transaction(async (tx) => {
      // 1. Delete review media for reviews on this product
      const productReviews = await tx
        .select({ id: review.id })
        .from(review)
        .where(eq(review.productId, id));
      if (productReviews.length) {
        await tx
          .delete(reviewMedia)
          .where(
            inArray(
              reviewMedia.reviewId,
              productReviews.map((r) => r.id),
            ),
          );
      }

      // 2. Delete reviews
      await tx.delete(review).where(eq(review.productId, id));

      // 3. Delete cart items referencing this product
      await tx.delete(cartItem).where(eq(cartItem.productId, id));

      // 4. Delete wishlist items referencing this product
      await tx.delete(wishlistItem).where(eq(wishlistItem.productId, id));

      // 5. Delete product media
      await tx.delete(productMedia).where(eq(productMedia.productId, id));

      // 6. Delete product attributes
      await tx.delete(productAttribute).where(eq(productAttribute.productId, id));

      // 7. Delete product filters
      await tx.delete(productFilter).where(eq(productFilter.productId, id));

      // 8. Delete product variant boxes
      await tx.delete(productVarientBox).where(eq(productVarientBox.productId, id));

      // 9. Delete product FAQs (has onDelete cascade but being explicit)
      await tx.delete(productFaq).where(eq(productFaq.productId, id));

      // 10. Delete product-category links
      await tx.delete(productCategory).where(eq(productCategory.productId, id));

      // 11. Nullify orderItem references (preserve order history)
      await tx
        .update(orderItem)
        .set({ productId: null })
        .where(eq(orderItem.productId, id));

      // 12. Finally delete the product itself
      await tx.delete(product).where(eq(product.id, id));
    });

    revalidateProductCache(id);
    revalidateProductCache(deletedSlug);
    revalidateCategoryCache();
    revalidateProductPages([deletedSlug]);
    revalidateProductCategoryPages(deletedCategorySlugs);
    revalidatePath("/admin/product");
    return {
      success: true,
      message: "Product and all variants deleted successfully",
    };
  } catch (error: any) {
    console.error("delete product failed:", error);
    throw new Error("Failed to delete product");
  }
}



export async function getProducts({
  page = 1,
  pageSize = 10,
  search = "",
  category: categorySlug,
  type = "",
  material = "",
  finish = "",
  size = "",
  flow = "",
  cramps = "",
  allergies = "",
  min = "",
  max = "",
  stock = "",
  brand = "",
  sort = "",
  includeHidden = false,
}: GetProductsOptions) {
  // Normalize params outside cache so cache key is stable
  const normalizeParam = (val: string | string[]): string[] => {
    const arr = Array.isArray(val) ? val : val ? [val] : [];
    return [
      ...new Set(arr.map((v) => decodeURIComponent(v).trim()).filter(Boolean)),
    ].sort();
  };

  const normalizedCategorySlugs = normalizeParam(categorySlug ?? "");
  const normalizedSize = normalizeParam(size);
  const normalizedType = normalizeParam(type);
  const normalizedMaterial = normalizeParam(material);
  const normalizedFinish = normalizeParam(finish);
  const normalizedFlow = normalizeParam(flow);
  const normalizedCramps = normalizeParam(cramps);
  const normalizedAllergies = normalizeParam(allergies);

  // Resolve category IDs outside the main product-list cache, but keep this
  // lookup cached so filtered /products requests do not hit categories every time.
  let resolvedCategoryIds: string[] = [];
  if (normalizedCategorySlugs.length) {
    resolvedCategoryIds = await unstable_cache(
      async () => {
        const categoryRows = await db
          .select({ id: category.id })
          .from(category)
          .where(inArray(category.slug, normalizedCategorySlugs));

        return categoryRows.map((c) => c.id).sort();
      },
      ["product-list-category-ids", ...normalizedCategorySlugs],
      {
        revalidate: cacheRevalidateTime,
        tags: [
          CACHE_TAGS.categories,
          ...normalizedCategorySlugs.map((slug) => CACHE_TAGS.category(slug)),
        ],
      },
    )();
  }

  const cacheKey = JSON.stringify({
    page,
    pageSize,
    search,
    resolvedCategoryIds,
    normalizedSize,
    normalizedType,
    normalizedMaterial,
    normalizedFinish,
    normalizedFlow,
    normalizedCramps,
    normalizedAllergies,
    min,
    max,
    stock,
    brand,
    sort,
    includeHidden,
  });
  const hasSearch = search.trim() !== "";

  return unstable_cache(
    async () => {
      const filters: SQL[] = [];

      // Visibility
      if (!includeHidden) {
        filters.push(or(eq(product.isHidden, false), isNull(product.isHidden))!);
      }

      // Search
      if (search.trim() !== "") {
        filters.push(ilike(product.name, `%${search}%`));
      }

      // EAV filters — using = ANY(ARRAY[...]::text[]) to avoid Drizzle IN binding issues
      const filterMap: Record<string, string[]> = {};
      if (normalizedType.length) filterMap.type = normalizedType;
      if (normalizedMaterial.length) filterMap.material = normalizedMaterial;
      if (normalizedFinish.length) filterMap.finish = normalizedFinish;
      if (normalizedFlow.length) filterMap.flow = normalizedFlow;
      if (normalizedCramps.length) filterMap.cramps = normalizedCramps;
      if (normalizedAllergies.length) filterMap.allergies = normalizedAllergies;

      // Size filter — LIKE match: selecting "18" matches "18" Top", "18"", "18x16", etc.
      if (normalizedSize.length) {
        const expandedSizes: string[] = [];
        for (const v of normalizedSize) {
          if (v.includes("-")) {
            const [min, max] = v.split("-").map(Number);
            if (!isNaN(min) && !isNaN(max)) {
              for (let i = min; i <= max; i++) {
                expandedSizes.push(String(i));
              }
            } else {
              expandedSizes.push(v);
            }
          } else {
            expandedSizes.push(v);
          }
        }

        const sizeConditions = expandedSizes.map(
          (v) => sql`EXISTS (
            SELECT 1 FROM ${productFilter}
            WHERE ${productFilter.productId} = ${product.id}
              AND ${productFilter.type} = ${"size"}
              AND ${productFilter.filter} LIKE ${v + '%'}
          )`
        );
        filters.push(
          sizeConditions.length === 1
            ? sizeConditions[0]
            : sql`(${sql.join(sizeConditions, sql` OR `)})`
        );
      }

      for (const [filterType, values] of Object.entries(filterMap)) {
        if (values.length === 0) continue;

        // One EXISTS per value, joined with OR — most reliable across Drizzle versions
        const valueConditions = values.map(
          (v) => sql`EXISTS (
            SELECT 1 FROM ${productFilter}
            WHERE ${productFilter.productId} = ${product.id}
              AND ${productFilter.type} = ${filterType}
              AND ${productFilter.filter} = ${v}
          )`
        );

        filters.push(
          valueConditions.length === 1
            ? valueConditions[0]
            : sql`(${sql.join(valueConditions, sql` OR `)})`
        );
      }

      // Category filter
      if (resolvedCategoryIds.length > 0) {
        filters.push(
          inArray(
            product.id,
            db
              .select({ productId: productCategory.productId })
              .from(productCategory)
              .where(inArray(productCategory.categoryId, resolvedCategoryIds))
          )
        );
      }

      // Price filter
      if (min !== "") {
        filters.push(gte(product.basePrice, Number(min)));
      }
      if (max !== "") {
        filters.push(lte(product.basePrice, Number(max)));
      }

      // Stock filter
      if (stock === "in_stock") {
        filters.push(eq(product.isInStock, true));
      } else if (stock === "out_of_stock") {
        filters.push(eq(product.isInStock, false));
      }

      // Brand filter
      if (brand) {
        const brands = Array.isArray(brand) ? brand : [brand];
        filters.push(inArray(product.brand, brands));
      }

      const whereClause = filters.length ? and(...filters) : undefined;

      // Sort
      const orderBy = (() => {
        switch (sort) {
          case "price_asc": return [asc(product.basePrice)];
          case "price_desc": return [desc(product.basePrice)];
          case "name_asc": return [asc(product.name)];
          case "name_desc": return [desc(product.name)];
          default: return [asc(product.sku)];
        }
      })();

      const offset = (page - 1) * pageSize;

      const [countResult, products] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(product).where(whereClause),
        db
          .select({
            id: product.id,
            sku: product.sku,
            slug: product.slug,
            name: product.name,
            basePrice: product.basePrice,
            strikethroughPrice: product.strikethroughPrice,
            bannerImage: product.bannerImage,
            hasVarientBox: product.hasVarientBox,
            isInStock: product.isInStock,
            isHidden: product.isHidden,
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
          .leftJoin(productFilter, eq(product.id, productFilter.productId))
          .where(whereClause)
          .groupBy(
            product.id,
            product.sku,
            product.slug,
            product.name,
            product.basePrice,
            product.strikethroughPrice,
            product.bannerImage,
            product.hasVarientBox,
            product.isInStock,
            product.isHidden,
            product.size,
          )
          .orderBy(...orderBy)
          .limit(pageSize)
          .offset(offset),
      ]);

      const total = Number(countResult[0]?.count ?? 0);


      return {
        products,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      };
    },
    [cacheKey],
    {
      revalidate: hasSearch ? 3600 : cacheRevalidateTime,
      tags: [
        CACHE_TAGS.products,
        CACHE_TAGS.categories,
        ...normalizedCategorySlugs.map((slug) => CACHE_TAGS.category(slug)),
      ],
    },
  )();
}

export async function getSteelSinkCategorySlugs() {
  return unstable_cache(
    async () => {
      const rows = await db
        .select({ slug: category.slug })
        .from(category)
        .where(
          or(
            and(
              ilike(category.name, "%sink%"),
              or(
                ilike(category.name, "%steel%"),
                ilike(category.name, "%steal%"),
                ilike(category.name, "%stainless%")
              )
            ),
            and(
              ilike(category.slug, "%sink%"),
              or(
                ilike(category.slug, "%steel%"),
                ilike(category.slug, "%steal%"),
                ilike(category.slug, "%stainless%")
              )
            ),
            eq(category.slug, "pulse")
          )
        );

      return rows.map((r) => r.slug);
    },
    ["steel-sink-category-slugs"],
    {
      revalidate: cacheRevalidateTime,
      tags: [CACHE_TAGS.categories],
    },
  )();
}

export async function getSteelSinkSizes() {
  // Resolve category IDs for steel sinks
  const steelSinkCategories = await db
    .select({ id: category.id })
    .from(category)
    .where(
      or(
        and(
          ilike(category.name, "%sink%"),
          or(
            ilike(category.name, "%steel%"),
            ilike(category.name, "%steal%"),
            ilike(category.name, "%stainless%")
          )
        ),
        and(
          ilike(category.slug, "%sink%"),
          or(
            ilike(category.slug, "%steel%"),
            ilike(category.slug, "%steal%"),
            ilike(category.slug, "%stainless%")
          )
        ),
        eq(category.slug, "pulse")
      )
    );

  const categoryIds = steelSinkCategories.map((c) => c.id);
  if (categoryIds.length === 0) return [];

  const rows = await db
    .selectDistinct({
      label: productFilter.filter,
      value: productFilter.filter,
    })
    .from(productFilter)
    .innerJoin(
      productCategory,
      eq(productCategory.productId, productFilter.productId)
    )
    .where(
      and(
        eq(productFilter.type, "size"),
        inArray(productCategory.categoryId, categoryIds)
      )
    )
    .orderBy(productFilter.filter);

  return rows.map((row) => ({
    label: formatSize(row.label ?? ""),
    value: row.value,
  }));
}


export async function getProductsForCart(productIds: string[]) {
  try {
    if (!productIds || !productIds.length) return [];
    const safeIds = productIds.filter(Boolean);
    if (!safeIds.length) return [];

    const products = await db
      .select()
      .from(product)
      .where(inArray(product.id, safeIds));

    if (!products.length) return [];

    const media = await db
      .select()
      .from(productMedia)
      .where(inArray(productMedia.productId, safeIds));

    const mediaMap = new Map<string, typeof media>();
    for (const m of media) {
      if (!m.productId) continue;
      if (!mediaMap.has(m.productId)) mediaMap.set(m.productId, []);
      mediaMap.get(m.productId)!.push(m);
    }

    return products.map((p) => ({
      ...p,
      media: mediaMap.get(p.id) ?? [],
    }));
  } catch (error) {
    console.error("getProductsForCart failed:", error);
    return [];
  }
}

export async function saveProductAttributes(productId: string, payload: any) {
  // Deprecated in favor of nested  handling in updateProduct
  return { success: true };
}

export async function getProductsCount() {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(product);

    return result[0].count || 0;
  } catch (error) {
    console.error("getProductsCount failed:", error);
    return 0;
  }
}

export async function getBestSellingProducts() {
  try {
    const products = await db
      .select({
        id: product.id,
        name: product.name,
        price: product.basePrice,
        oldPrice: product.strikethroughPrice,
        image: product.bannerImage,
        slug: product.slug,
      })
      .from(product)
      .innerJoin(productCategory, eq(productCategory.productId, product.id))
      .innerJoin(category, eq(category.id, productCategory.categoryId))
      .where(and(eq(category.slug, bestSellingSlug), or(eq(product.isHidden, false), isNull(product.isHidden))))
      .limit(4);

    // fallback
    if (products.length === 0) {
      return await db
        .select({
          id: product.id,
          name: product.name,
          price: product.basePrice,
          oldPrice: product.strikethroughPrice,
          image: product.bannerImage,
          slug: product.slug,
        })
        .from(product)
        .where(or(eq(product.isHidden, false), isNull(product.isHidden)))
        .limit(4);
    }

    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBrandBestSellingProducts(slug: any) {
  try {
    const brandProducts = await db
      .select({
        id: product.id,
        name: product.name,
        price: product.basePrice,
        image: product.bannerImage,
        slug: product.slug,
        brand: product.brand,
        oldPrice: product.strikethroughPrice,
      })
      .from(product)
      .where(and(eq(product.brand, slug), or(eq(product.isHidden, false), isNull(product.isHidden))))
      .limit(4);
    return brandProducts;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getBrandNewArrivalProducts(slug: any) {
  try {
    const brandProducts = await db
      .select({
        id: product.id,
        name: product.name,
        price: product.basePrice,
        image: product.bannerImage,
        slug: product.slug,
        brand: product.brand,
        oldPrice: product.strikethroughPrice,
      })
      .from(product)
      .where(and(eq(product.brand, slug), or(eq(product.isHidden, false), isNull(product.isHidden))))
      .orderBy(desc(product.createdAt))
      .limit(4);
    return brandProducts;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getQuizSuggestedProducts(userAnswers: any) {
  try {
    const filters: string[] = userAnswers.map((a: any) => a.answer);

    // Step 1: find matching filters
    const matchedFilters = await db
      .select({ productId: productFilter.productId })
      .from(productFilter)
      .where(inArray(productFilter.filter, filters));

    // Step 2: unique productIds
    const productIds: any = [
      ...new Set(matchedFilters.map((f) => f.productId)),
    ];

    if (productIds.length === 0) return [];

    // Step 3: fetch products
    const products = await db
      .select()
      .from(product)
      .where(and(inArray(product.id, productIds), or(eq(product.isHidden, false), isNull(product.isHidden))));

    return products;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// export async function getBrandBestSellingProducts(slug:any){
//   try {
//     const brandProducts = await db.select({
//       id: product.id,
//       name: product.name,
//       price: product.basePrice,
//       image: product.bannerImage,
//       slug: product.slug,
//       brand: product.brand,
//       oldPrice: product.strikethroughPrice
//     }).from(product).where(eq(product.brand, slug)).limit(4);
//     return brandProducts
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// export async function getBrandNewArrivalProducts(slug:any){
//   try {
//     const brandProducts = await db.select({
//       id: product.id,
//       name: product.name,
//       price: product.basePrice,
//       image: product.bannerImage,
//       slug: product.slug,
//       brand: product.brand,
//       oldPrice: product.strikethroughPrice
//     }).from(product).where(eq(product.brand, slug)).orderBy(desc(product.createdAt)).limit(4);
//     return brandProducts
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// export async function getQuizSuggestedProducts(userAnswers:any){
//  try {
//   const filters:string[] = userAnswers.map((a: any) => a.answer);

//   // Step 1: find matching filters
//   const matchedFilters = await db
//     .select({ productId: productFilter.productId })
//     .from(productFilter)
//     .where(inArray(productFilter.filter, filters));

//   // Step 2: unique productIds
//   const productIds:any = [
//     ...new Set(matchedFilters.map((f) => f.productId)),
//   ];

//   if (productIds.length === 0) return [];

//   // Step 3: fetch products
//   const products = await db
//     .select()
//     .from(product)
//     .where(inArray(product.id, productIds));

//   return products;
// } catch (error) {
//   console.log(error);
//   return [];
// }
// }
export async function getProductsBySlugList(slugs: string[]) {
  try {
    if (!slugs || slugs.length === 0) return [];
    const safeSlugs = slugs.filter(Boolean);
    if (!safeSlugs.length) return [];

    const results = await db
      .select({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        basePrice: product.basePrice,
        strikethroughPrice: product.strikethroughPrice,
        bannerImage: product.bannerImage,
        isInStock: product.isInStock,
        rateing4Star: product.rateing4Star,
        rateing5Star: product.rateing5Star,
      })
      .from(product)
      .where(inArray(product.slug, safeSlugs));

    return results;
  } catch (error) {
    console.error("getProductsBySlugList failed:", error);
    return [];
  }
}

// export async function getProductFilterOptions() {
//   return unstable_cache(
//     async () => {
//       const rows = await db
//         .select({
//           type: productFilter.type,
//           filter: productFilter.filter,
//         })
//         .from(productFilter)
//         .groupBy(productFilter.type, productFilter.filter);

//       const makeOptions = (type: string) =>
//         rows
//           .filter((row) => row.type === type && row.filter)
//           .map((row) => ({
//             label: row.filter,
//             value: row.filter,
//           }));

//       return {
//         materialOptions: makeOptions("material"),
//         finishOptions: makeOptions("finish"),
//         sizeOptions: makeOptions("size"),
//       };
//     },
//     ["product-filter-options"],
//     { revalidate: cacheRevalidateTime, tags: [CACHE_TAGS.products] },
//   )();
// }

export async function getProductFilterOptions() {
  return unstable_cache(
    async () => {
      const rows = await db
        .select({
          type: productFilter.type,
          filter: productFilter.filter,
        })
        .from(productFilter)
        .groupBy(productFilter.type, productFilter.filter);

      const makeOptions = (type: string) =>
        rows
          .filter((row) => row.type === type && row.filter)
          .map((row) => ({
            label: row.filter,
            value: row.filter,
          }));

      return {
        materialOptions: makeOptions("material"),
        finishOptions: makeOptions("finish"),
        sizeOptions: makeOptions("size"),
      };
    },
    ["product-filter-options"],
    {
      revalidate: cacheRevalidateTime,
      tags: [CACHE_TAGS.products],
    },
  )();
}

export async function getSignatureProducts(limit = 8) {
  return unstable_cache(
    async () => {
      try {
        const products = await db
          .select({
            id: product.id,
            name: product.name,
            slug: product.slug,
            bannerImage: product.bannerImage,
            basePrice: product.basePrice,
            strikethroughPrice: product.strikethroughPrice,
            categoryName: category.name,
            size:product.size
          })
          .from(product)
          .innerJoin(productCategory, eq(productCategory.productId, product.id))
          .innerJoin(category, eq(category.id, productCategory.categoryId))
          .where(and(eq(category.slug, "signature-pieces"), or(eq(product.isHidden, false), isNull(product.isHidden))))
          .orderBy(desc(product.createdAt))
          .limit(limit);

        return products;
      } catch (error) {
        console.error("getSignatureProducts failed:", error);
        return [];
      }
    },
    ["signature-products", String(limit)],
    { revalidate: cacheRevalidateTime, tags: [CACHE_TAGS.products] }
  )();
}

export async function getNewArrivalProducts(limit = 8) {
  return unstable_cache(
    async () => {
      try {
        const products = await db
          .select({
            id: product.id,
            name: product.name,
            slug: product.slug,
            bannerImage: product.bannerImage,
            basePrice: product.basePrice,
            strikethroughPrice: product.strikethroughPrice,
            categoryName: category.name,
            size: product.size
          })
          .from(product)
          .innerJoin(productCategory, eq(productCategory.productId, product.id))
          .innerJoin(category, eq(category.id, productCategory.categoryId))
          .where(and(eq(category.slug, "new-arrivals"), or(eq(product.isHidden, false), isNull(product.isHidden))))
          .orderBy(desc(product.createdAt))
          .limit(limit);

        return products;
      } catch (error) {
        console.error("getNewArrivalProducts failed:", error);
        return [];
      }
    },
    ["new-arrival-products", String(limit)],
    { revalidate: cacheRevalidateTime, tags: [CACHE_TAGS.products] }
  )();
}

export async function getTrendingProducts(limit = 8) {
  return unstable_cache(
    async () => {
      try {
        const products = await db
          .select({
            id: product.id,
            name: product.name,
            slug: product.slug,
            bannerImage: product.bannerImage,
            basePrice: product.basePrice,
            strikethroughPrice: product.strikethroughPrice,
            categoryName: category.name,
            size: product.size
          })
          .from(product)
          .innerJoin(productCategory, eq(productCategory.productId, product.id))
          .innerJoin(category, eq(category.id, productCategory.categoryId))
          .where(and(eq(category.slug, "trending-now"), or(eq(product.isHidden, false), isNull(product.isHidden))))
          .orderBy(desc(product.createdAt))
          .limit(limit);

        return products;
      } catch (error) {
        console.error("getTrendingProducts failed:", error);
        return [];
      }
    },
    ["trending-products", String(limit)],
    { revalidate: cacheRevalidateTime, tags: [CACHE_TAGS.products] }
  )();
}
