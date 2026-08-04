import { PutObjectCommand } from "@aws-sdk/client-s3";
import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { category, product, productCategory, productMedia } from "@/db/schema";
import { AWS_BUCKET } from "@/env";
import {
  revalidateCategoryCache,
  revalidateProductCache,
} from "@/lib/cache-tags";
import { s3 } from "@/lib/s3";

const DRIVE_ROOT_FOLDER_ID = "1jJeSADoaUIE-5dKIwpAEstkzdW6PR5yv";
const DRIVE_EMBEDDED_FOLDER_URL =
  "https://drive.google.com/embeddedfolderview?id=";
const DRIVE_CATEGORY_FOLDERS = {
  "Air-Tap": {
    label: "AirTap",
    driveTitle: "AirTap",
    folderId: "12oDcW2lLlkEBs3iX2qGnIeFpZvoyao8l",
  },
  "Bathroom-Basins": {
    label: "Bathroom Basin",
    driveTitle: "Bathroom Basin",
    folderId: "1ZzyQ4NrpgHPnilsPdSNU_DhfnmMwARyM",
  },
  "Bathroom-Faucets": {
    label: "Bathroom Faucets",
    driveTitle: "Bathroom Faucets",
    folderId: "1VD3fSISxEQf45dnOlo-yhY62z5_MLLZk",
  },
  "Floor-Drainers": {
    label: "Floor Drain",
    driveTitle: "Floor Drain",
    folderId: "1ID2yYGS6HT-mMkri-McyeGHQzJL0bteI",
  },
  "Food-Waste-Disposers": {
    label: "Food Waste Disposer",
    driveTitle: "Food Waste Disposer",
    folderId: "1W0EJCXQq53C-D-cJ3-qOJJS8NkK7y9H-",
  },
  "Granite-Sinks": {
    label: "Granite Kitchen Sink",
    driveTitle: "Granite Kitchen Sink",
    folderId: "1iydp7OTZdtlKTho0DJvfR5FMO9EPCaZq",
  },
  "Kitchen-Accessories": {
    label: "Kitchen Accessories",
    driveTitle: "Kitchen Accessories",
    folderId: "1z4YiEHsLODAvqe29g_2nKEeSPsp_hXT0",
  },
  "Kitchen-Faucets": {
    label: "Kitchen Faucets",
    driveTitle: "Kitchen Faucets",
    folderId: "1D51_wOtr9JiRjhvCJ32iGj-BCfvIYZ1o",
  },
  "stainless-steel-sinks": {
    label: "Stainless Steel Kitchen Sinks",
    driveTitle: "Stainless Steel Kitchen Sinks",
    folderId: "1lamjPSFJR2aTRbYrZxX48oCgdgpMEgz0",
  },
  "Towel-Warmers": {
    label: "Towel Warmer",
    driveTitle: "Towel Warmer",
    folderId: "1cmuQAMYNXndeqVPd2Q5cm4PJhwU5_7FA",
  },
} as const;

type DriveEntry = {
  id: string;
  title: string;
  link: string;
  isFolder: boolean;
};

type ImageCandidate = {
  id: string;
  title: string;
  previewUrl: string;
  downloadUrl: string;
};

type ProductMediaImage = {
  id: string;
  mediaURL: string | null;
  priority: number | null;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function safeFilePart(value: string) {
  return value.replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "");
}

function extensionFromContentType(contentType: string) {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  return "jpg";
}

function baseModelFromSku(sku: string) {
  return sku.split("(")[0]?.trim() || sku;
}

function normalizeMatchKey(value: string) {
  return value.replace(/[^a-z0-9]+/gi, "").toUpperCase();
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function fetchWithRetry(
  input: string,
  init: RequestInit,
  attempts = 3,
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(input, init);
      if (res.ok || attempt === attempts) return res;
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 500));
  }

  throw lastError;
}

async function listDriveFolder(folderId: string): Promise<DriveEntry[]> {
  const res = await fetchWithRetry(
    `${DRIVE_EMBEDDED_FOLDER_URL}${folderId}#grid`,
    { cache: "no-store" },
  );

  if (!res.ok) return [];

  const html = await res.text();
  const entryRegex =
    /<div class="flip-entry" id="entry-([^"]+)"[\s\S]*?<a href="([^"]+)"[\s\S]*?<div class="flip-entry-title">([\s\S]*?)<\/div>/g;
  const entries: DriveEntry[] = [];

  for (const match of html.matchAll(entryRegex)) {
    const id = decodeHtml(match[1]);
    const link = decodeHtml(match[2]);
    const rawTitle = match[3].replace(/<.*?>/g, "");
    const title = decodeHtml(rawTitle);

    entries.push({
      id,
      title,
      link,
      isFolder: link.includes("/drive/folders/"),
    });
  }

  return entries;
}

function getDriveCategoryConfig(categorySlug: string | null) {
  if (!categorySlug) return null;

  return (
    DRIVE_CATEGORY_FOLDERS[
      categorySlug as keyof typeof DRIVE_CATEGORY_FOLDERS
    ] ?? null
  );
}

async function getConfiguredDriveCategories() {
  const rootEntries = await listDriveFolder(DRIVE_ROOT_FOLDER_ID);
  const rootFolders = new Map(
    rootEntries
      .filter((entry) => entry.isFolder)
      .map((entry) => [entry.id, entry]),
  );

  return Object.entries(DRIVE_CATEGORY_FOLDERS).map(([slug, config]) => ({
    slug,
    label: config.label,
    driveTitle: rootFolders.get(config.folderId)?.title || config.driveTitle,
    folderId: config.folderId,
    available: rootFolders.has(config.folderId),
  }));
}

async function getModelFolders(folderId: string) {
  const entries = await listDriveFolder(folderId);
  const folders = new Map<string, DriveEntry>();

  for (const entry of entries) {
    if (entry.isFolder) folders.set(entry.title.toUpperCase(), entry);
  }

  return folders;
}

function isImageEntry(entry: DriveEntry) {
  return /\.(png|jpe?g|webp|gif)$/i.test(entry.title) && !entry.isFolder;
}

async function getDriveImageCandidates(folderId: string) {
  const entries = await listDriveFolder(folderId);

  return entries.filter(isImageEntry).map<ImageCandidate>((entry) => ({
    id: entry.id,
    title: entry.title,
    previewUrl: `https://lh3.googleusercontent.com/d/${entry.id}=w500`,
    downloadUrl: `https://drive.google.com/uc?export=download&id=${entry.id}`,
  }));
}

async function revalidateProductImagePages(productId: string, slug: string) {
  const categoryRows = await db
    .select({
      slug: category.slug,
      type: category.type,
    })
    .from(category)
    .innerJoin(productCategory, eq(productCategory.categoryId, category.id))
    .where(eq(productCategory.productId, productId));

  revalidateProductCache(slug || productId);
  revalidateCategoryCache();
  revalidatePath("/products");

  if (slug) {
    revalidatePath(`/product/${slug}`);
  }

  for (const row of categoryRows) {
    revalidateCategoryCache(row.slug);

    if (row.type) {
      revalidatePath(`/${row.type}/${row.slug}`);
    } else {
      revalidatePath(`/kitchen/${row.slug}`);
      revalidatePath(`/bathroom/${row.slug}`);
    }
  }
}

function sortMedia(media: ProductMediaImage[]) {
  return media.sort((a, b) => {
    if (a.priority == null && b.priority == null) return 0;
    if (a.priority == null) return 1;
    if (b.priority == null) return -1;
    return a.priority - b.priority;
  });
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const categorySlug = clean(url.searchParams.get("category"));
    const page = Math.max(Number(url.searchParams.get("page") || 1), 1);
    const pageSize = Math.min(
      Math.max(Number(url.searchParams.get("pageSize") || 20), 1),
      50,
    );

    if (!categorySlug) {
      return NextResponse.json({
        success: true,
        categories: await getConfiguredDriveCategories(),
      });
    }

    const driveCategory = getDriveCategoryConfig(categorySlug);

    if (!driveCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Drive folder is not configured for this category",
        },
        { status: 400 },
      );
    }

    const whereClause = eq(category.slug, categorySlug);
    const [{ count: totalItems }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(product)
      .innerJoin(productCategory, eq(productCategory.productId, product.id))
      .innerJoin(category, eq(category.id, productCategory.categoryId))
      .where(whereClause);
    const rows = await db
      .select({
        id: product.id,
        sku: product.sku,
        name: product.name,
        size: product.size,
        basePrice: product.basePrice,
        bannerImage: product.bannerImage,
      })
      .from(product)
      .innerJoin(productCategory, eq(productCategory.productId, product.id))
      .innerJoin(category, eq(category.id, productCategory.categoryId))
      .where(whereClause)
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    if (!rows.length) {
      return NextResponse.json({
        success: true,
        products: [],
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
        },
      });
    }

    const productIds = rows.map((row) => row.id);
    const mediaRows = await db
      .select({
        id: productMedia.id,
        productId: productMedia.productId,
        mediaURL: productMedia.mediaURL,
        priority: productMedia.priority,
      })
      .from(productMedia)
      .where(
        and(
          inArray(productMedia.productId, productIds),
          eq(productMedia.mediaType, "image"),
        ),
      );
    const mediaByProduct = new Map<string, ProductMediaImage[]>();

    for (const media of mediaRows) {
      if (!media.productId) continue;
      const current = mediaByProduct.get(media.productId) ?? [];
      current.push(media);
      mediaByProduct.set(media.productId, current);
    }

    for (const media of mediaByProduct.values()) {
      sortMedia(media);
    }

    const modelFolders = await getModelFolders(driveCategory.folderId);
    const normalizedModelFolders = new Map(
      [...modelFolders.entries()].map(([model, folder]) => [
        normalizeMatchKey(model),
        folder,
      ]),
    );
    const candidateCache = new Map<string, ImageCandidate[]>();
    const products = rows.map(async (productRow) => {
      const modelFolder =
        modelFolders.get(productRow.sku.toUpperCase()) ||
        modelFolders.get(baseModelFromSku(productRow.sku).toUpperCase()) ||
        normalizedModelFolders.get(normalizeMatchKey(productRow.sku)) ||
        normalizedModelFolders.get(
          normalizeMatchKey(baseModelFromSku(productRow.sku)),
        );
      let imageCandidates: ImageCandidate[] = [];

      if (modelFolder) {
        const cacheKey = modelFolder.id;
        imageCandidates =
          candidateCache.get(cacheKey) ??
          (await getDriveImageCandidates(modelFolder.id));
        candidateCache.set(cacheKey, imageCandidates);
      }

      return {
        id: productRow.id,
        sku: productRow.sku,
        name: productRow.name,
        currentBannerImage: productRow.bannerImage,
        currentMediaImages: mediaByProduct.get(productRow.id) ?? [],
        suggestedImageUrl: imageCandidates[0]?.downloadUrl || "",
        suggestedPreviewUrl: imageCandidates[0]?.previewUrl || "",
        imageCandidates,
        size: productRow.size ?? "",
        mrp: productRow.basePrice ? String(productRow.basePrice) : "",
        approved: Boolean(mediaByProduct.get(productRow.id)?.length),
      };
    });

    return NextResponse.json({
      success: true,
      products: await Promise.all(products),
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    });
  } catch (error: any) {
    console.error("Product image approval list failed:", error);

    return NextResponse.json(
      { success: false, message: error?.message || "Unable to load products" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      productId?: string;
      imageUrl?: string;
      imageUrls?: string[];
      priorityByUrl?: Record<string, number>;
      sku?: string;
    };
    const productId = clean(body.productId);
    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls.map(clean).filter(Boolean)
      : [clean(body.imageUrl)].filter(Boolean);
    const sku = clean(body.sku);
    const priorityByUrl =
      body.priorityByUrl && typeof body.priorityByUrl === "object"
        ? body.priorityByUrl
        : {};

    if (
      !productId ||
      !imageUrls.length ||
      imageUrls.some((imageUrl) => !imageUrl.startsWith("https://"))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid productId and image URLs are required",
        },
        { status: 400 },
      );
    }

    const [productRow] = await db
      .select({
        id: product.id,
        slug: product.slug,
        sku: product.sku,
      })
      .from(product)
      .where(eq(product.id, productId))
      .limit(1);

    if (!productRow) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    const currentMedia = await db
      .select({ priority: productMedia.priority })
      .from(productMedia)
      .where(
        and(
          eq(productMedia.productId, productId),
          eq(productMedia.mediaType, "image"),
        ),
      );
    const maxPriority = currentMedia.reduce(
      (max, media) => Math.max(max, media.priority ?? 0),
      0,
    );
    const mediaItems: Array<{ mediaURL: string; sourceUrl: string }> = [];
    const failedImages: Array<{ imageUrl: string; reason: string }> = [];

    for (const imageUrl of imageUrls) {
      try {
        const imageRes = await fetchWithRetry(imageUrl, { cache: "no-store" });

        if (!imageRes.ok) {
          failedImages.push({
            imageUrl,
            reason: "Unable to download source image",
          });
          continue;
        }

        const contentType = imageRes.headers.get("content-type") || "image/jpeg";
        if (!contentType.startsWith("image/")) {
          failedImages.push({ imageUrl, reason: "Source URL is not an image" });
          continue;
        }

        const bytes = await imageRes.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${safeFilePart(sku || productRow.sku)}-${mediaItems.length + 1}.${extensionFromContentType(contentType)}`;
        const fileKey = `product/${fileName}`;
        const storedPath = `/${fileKey}`;

        await s3.send(
          new PutObjectCommand({
            Bucket: AWS_BUCKET,
            Key: fileKey,
            Body: buffer,
            ContentType: contentType,
          }),
        );

        mediaItems.push({ mediaURL: storedPath, sourceUrl: imageUrl });
      } catch (error: any) {
        failedImages.push({
          imageUrl,
          reason: error?.message || "Unable to process image",
        });
      }
    }

    if (mediaItems.length) {
      await db.insert(productMedia).values(
        mediaItems.map((item, index) => ({
          productId,
          mediaType: "image",
          mediaURL: item.mediaURL,
          priority:
            Number(priorityByUrl[item.sourceUrl]) || maxPriority + index + 1,
          title: `${sku || productRow.sku} ${index + 1}`,
        })),
      );

      await revalidateProductImagePages(productId, productRow.slug);
    }

    if (!mediaItems.length) {
      return NextResponse.json(
        {
          success: false,
          message: failedImages[0]?.reason || "No images could be added",
          failedImages,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      productId,
      mediaURLs: mediaItems.map((item) => item.mediaURL),
      failedImages,
    });
  } catch (error: any) {
    console.error("Product image approval failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.cause?.message || error?.message || "Approval failed",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as {
      productId?: string;
      mediaOrder?: Array<{ id?: string; priority?: number }>;
      productIds?: string[];
      clearUnassigned?: boolean;
    };
    const productId = clean(body.productId);
    const mediaOrder = Array.isArray(body.mediaOrder) ? body.mediaOrder : [];

    if (productId && (mediaOrder.length || body.clearUnassigned)) {
      const [productRow] = await db
        .select({ id: product.id, slug: product.slug })
        .from(product)
        .where(eq(product.id, productId))
        .limit(1);

      if (!productRow) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 },
        );
      }

      if (body.clearUnassigned) {
        await db
          .update(productMedia)
          .set({ priority: null })
          .where(
            and(
              eq(productMedia.productId, productId),
              eq(productMedia.mediaType, "image"),
            ),
          );
      }

      for (const item of mediaOrder) {
        const mediaId = clean(item.id);
        if (!mediaId) continue;

        await db
          .update(productMedia)
          .set({ priority: Number(item.priority) || null })
          .where(
            and(
              eq(productMedia.id, mediaId),
              eq(productMedia.productId, productId),
              eq(productMedia.mediaType, "image"),
            ),
          );
      }

      await revalidateProductImagePages(productId, productRow.slug);

      return NextResponse.json({ success: true });
    }

    const productIds = Array.isArray(body.productIds)
      ? body.productIds.filter((id) => typeof id === "string" && id.trim())
      : [];

    if (!productIds.length) {
      return NextResponse.json(
        { success: false, message: "productIds are required" },
        { status: 400 },
      );
    }

    const rows = await db
      .select({
        id: product.id,
        slug: product.slug,
      })
      .from(product)
      .where(inArray(product.id, productIds));

    for (const row of rows) {
      await revalidateProductImagePages(row.id, row.slug);
    }

    return NextResponse.json({
      success: true,
      revalidatedCount: rows.length,
    });
  } catch (error: any) {
    console.error("Product image cache refresh failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.cause?.message ||
          error?.message ||
          "Cache refresh failed",
      },
      { status: 500 },
    );
  }
}
