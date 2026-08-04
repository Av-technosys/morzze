"use client";

import { Check, GripVertical, ImageOff, Loader2, RefreshCw, X } from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getImageURL } from "@/lib/getImageLin";

type ProductImageCandidate = {
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

type ProductImageApprovalItem = {
  id: string;
  sku: string;
  name: string | null;
  size: string;
  mrp: string;
  currentBannerImage: string | null;
  currentMediaImages: ProductMediaImage[];
  suggestedImageUrl: string;
  suggestedPreviewUrl?: string;
  imageCandidates: ProductImageCandidate[];
  approved: boolean;
};

type LoadResult = {
  success: boolean;
  message?: string;
  products?: ProductImageApprovalItem[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
};

type PrioritySlotItem =
  | {
      kind: "media";
      id: string;
      mediaURL: string | null;
      previewUrl: string;
    }
  | {
      kind: "drive";
      downloadUrl: string;
      previewUrl: string;
      title: string;
    };

function LazyImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}

function orderedMedia(media: ProductMediaImage[]) {
  return [...media].sort((a, b) => {
    if (a.priority == null && b.priority == null) return 0;
    if (a.priority == null) return 1;
    if (b.priority == null) return -1;
    return a.priority - b.priority;
  });
}

const SLOT_COUNT = 6;

function buildPrioritySlots(product: ProductImageApprovalItem) {
  const slots = Array.from<PrioritySlotItem | null>({ length: SLOT_COUNT }).fill(
    null,
  );

  for (const media of product.currentMediaImages) {
    if (!media.priority || media.priority < 1 || media.priority > SLOT_COUNT) {
      continue;
    }

    slots[media.priority - 1] = {
      kind: "media",
      id: media.id,
      mediaURL: media.mediaURL,
      previewUrl: getImageURL(media.mediaURL || ""),
    };
  }

  return slots;
}

export default function CategoryImageApprovalPage({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}) {
  const { categorySlug } = use(params);
  const [products, setProducts] = useState<ProductImageApprovalItem[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalItems: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<Record<string, boolean>>({});
  const [savingOrder, setSavingOrder] = useState<Record<string, boolean>>({});
  const [refreshingCache, setRefreshingCache] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Record<string, string[]>>(
    {},
  );
  const [prioritySlots, setPrioritySlots] = useState<
    Record<string, Array<PrioritySlotItem | null>>
  >({});
  const [draggedItem, setDraggedItem] = useState<{
    productId: string;
    item: PrioritySlotItem;
    fromSlot?: number;
  } | null>(null);

  const pendingCount = useMemo(
    () => products.filter((product) => !product.approved).length,
    [products],
  );
  const imageReadyProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.currentMediaImages.length > 0 ||
          product.currentBannerImage?.trim(),
      ),
    [products],
  );

  async function loadProducts() {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/admin/product-images/approval?category=${encodeURIComponent(categorySlug)}&page=${page}&pageSize=${pagination.pageSize}`,
        { cache: "no-store" },
      );
      const data = (await res.json()) as LoadResult;

      if (!res.ok || !data.success) {
        toast.error(data.message ?? "Unable to load image candidates");
        return;
      }

      const loadedProducts = data.products ?? [];
      const normalizedProducts = loadedProducts.map((product) => ({
        ...product,
        currentMediaImages: orderedMedia(product.currentMediaImages ?? []),
      }));
      setPagination(
        data.pagination ?? {
          page,
          pageSize: pagination.pageSize,
          totalItems: loadedProducts.length,
          totalPages: 1,
        },
      );
      setProducts(normalizedProducts);
      setPrioritySlots(
        Object.fromEntries(
          normalizedProducts.map((product) => [
            product.id,
            buildPrioritySlots(product),
          ]),
        ),
      );
      setSelectedImages(
        Object.fromEntries(
          loadedProducts.map((product) => [
            product.id,
            [product.imageCandidates[0]?.downloadUrl || product.suggestedImageUrl].filter(Boolean),
          ]),
        ),
      );
    } catch {
      toast.error("Unable to load image candidates");
    } finally {
      setLoading(false);
    }
  }

  function getSelectedImageUrls(productItem: ProductImageApprovalItem) {
    return selectedImages[productItem.id]?.length
      ? selectedImages[productItem.id]
      : [productItem.suggestedImageUrl].filter(Boolean);
  }

  function toggleSelectedImage(productId: string, imageUrl: string) {
    setSelectedImages((current) => {
      const selected = current[productId] ?? [];
      const next = selected.includes(imageUrl)
        ? selected.filter((url) => url !== imageUrl)
        : [...selected, imageUrl];

      return { ...current, [productId]: next };
    });
  }

  function getProductSlots(productId: string) {
    return (
      prioritySlots[productId] ??
      Array.from<PrioritySlotItem | null>({ length: SLOT_COUNT }).fill(null)
    );
  }

  function isSameSlotItem(a: PrioritySlotItem | null, b: PrioritySlotItem) {
    if (!a || a.kind !== b.kind) return false;
    if (a.kind === "media" && b.kind === "media") return a.id === b.id;
    if (a.kind === "drive" && b.kind === "drive") {
      return a.downloadUrl === b.downloadUrl;
    }

    return false;
  }

  function assignPrioritySlot(
    productId: string,
    slotIndex: number,
    item: PrioritySlotItem,
    fromSlot?: number,
  ) {
    setPrioritySlots((current) => {
      const next =
        current[productId] ??
        Array.from<PrioritySlotItem | null>({ length: SLOT_COUNT }).fill(null);

      const updated = [...next];
      for (let index = 0; index < updated.length; index++) {
        if (isSameSlotItem(updated[index], item)) updated[index] = null;
      }

      if (fromSlot != null) updated[fromSlot] = null;
      updated[slotIndex] = item;

      return { ...current, [productId]: updated };
    });
  }

  function clearPrioritySlot(productId: string, slotIndex: number) {
    setPrioritySlots((current) => {
      const next =
        current[productId] ??
        Array.from<PrioritySlotItem | null>({ length: SLOT_COUNT }).fill(null);
      const updated = [...next];
      updated[slotIndex] = null;
      return { ...current, [productId]: updated };
    });
  }

  async function saveOrder(productItem: ProductImageApprovalItem) {
    setSavingOrder((current) => ({ ...current, [productItem.id]: true }));

    try {
      const slots = getProductSlots(productItem.id);
      const mediaOrder = slots.flatMap((slot, index) =>
        slot?.kind === "media"
          ? [{ id: slot.id, priority: index + 1 }]
          : [],
      );
      const driveAssignments = slots.flatMap((slot, index) =>
        slot?.kind === "drive"
          ? [{ imageUrl: slot.downloadUrl, priority: index + 1 }]
          : [],
      );

      const res = await fetch("/api/admin/product-images/approval", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productItem.id,
          clearUnassigned: true,
          mediaOrder,
        }),
      });
      const data = (await res.json()) as { success: boolean; message?: string };

      if (!res.ok || !data.success) {
        toast.error(data.message ?? "Unable to save gallery order");
        return;
      }

      if (driveAssignments.length) {
        const uploadRes = await fetch("/api/admin/product-images/approval", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: productItem.id,
            sku: productItem.sku,
            imageUrls: driveAssignments.map((item) => item.imageUrl),
            priorityByUrl: Object.fromEntries(
              driveAssignments.map((item) => [item.imageUrl, item.priority]),
            ),
          }),
        });
        const uploadData = (await uploadRes.json()) as {
          success: boolean;
          message?: string;
          failedImages?: Array<{ imageUrl: string; reason: string }>;
        };

        if (!uploadRes.ok || !uploadData.success) {
          toast.error(uploadData.message ?? "Unable to add Drive slot images");
          return;
        }

        if (uploadData.failedImages?.length) {
          toast.warning(
            `${productItem.sku} saved, but ${uploadData.failedImages.length} Drive image(s) failed`,
          );
        }
      }

      toast.success(`${productItem.sku} priority slots saved`);
      await loadProducts();
    } catch {
      toast.error("Unable to save gallery order");
    } finally {
      setSavingOrder((current) => ({ ...current, [productItem.id]: false }));
    }
  }

  async function approve(productItem: ProductImageApprovalItem) {
    setApproving((current) => ({ ...current, [productItem.id]: true }));

    try {
      const res = await fetch("/api/admin/product-images/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productItem.id,
          sku: productItem.sku,
          imageUrls: getSelectedImageUrls(productItem),
        }),
      });
      const data = (await res.json()) as {
        success: boolean;
        message?: string;
        mediaURLs?: string[];
        failedImages?: Array<{ imageUrl: string; reason: string }>;
      };

      if (!res.ok || !data.success) {
        toast.error(data.message ?? "Approval failed");
        return;
      }

      const addedCount = data.mediaURLs?.length ?? 0;
      const failedCount = data.failedImages?.length ?? 0;

      if (failedCount) {
        toast.warning(
          `${productItem.sku} added ${addedCount} image(s), ${failedCount} failed`,
        );
      } else {
        toast.success(`${productItem.sku} ${addedCount} media image(s) added`);
      }
      await loadProducts();
    } catch {
      toast.error("Approval failed");
    } finally {
      setApproving((current) => ({ ...current, [productItem.id]: false }));
    }
  }

  async function refreshImageCache() {
    const productIds = imageReadyProducts.map((product) => product.id);
    if (!productIds.length) {
      toast.info("No products to refresh");
      return;
    }

    setRefreshingCache(true);

    try {
      const res = await fetch("/api/admin/product-images/approval", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
      });
      const data = (await res.json()) as {
        success: boolean;
        message?: string;
        revalidatedCount?: number;
      };

      if (!res.ok || !data.success) {
        toast.error(data.message ?? "Cache refresh failed");
        return;
      }

      toast.success(`Refreshed cache for ${data.revalidatedCount ?? 0} products`);
    } catch {
      toast.error("Cache refresh failed");
    } finally {
      setRefreshingCache(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [categorySlug, page]);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Image Approval</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Category: {decodeURIComponent(categorySlug)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={loadProducts}
            disabled={loading || refreshingCache}
          >
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            Refresh
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={refreshImageCache}
            disabled={loading || refreshingCache || imageReadyProducts.length === 0}
          >
            {refreshingCache ? (
              <Loader2 className="animate-spin" />
            ) : (
              <RefreshCw />
            )}
            Refresh Cache
          </Button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 md:max-w-md">
        <div className="rounded-md border p-3">
          <p className="text-xs text-zinc-500">Products</p>
          <p className="text-xl font-semibold">{pagination.totalItems}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-zinc-500">Without Media On Page</p>
          <p className="text-xl font-semibold">{pendingCount}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2">
        <p className="text-sm text-zinc-500">
          Page {pagination.page} of {Math.max(pagination.totalPages, 1)}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={loading || page <= 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={loading || page >= pagination.totalPages}
            onClick={() =>
              setPage((current) =>
                Math.min(current + 1, Math.max(pagination.totalPages, 1)),
              )
            }
          >
            Next
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-md border">
          <Loader2 className="animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-md border text-zinc-500">
          <ImageOff />
          <p>No matching products found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => {
            const slots = getProductSlots(product.id);
            const slottedMediaIds = new Set(
              slots.flatMap((slot) =>
                slot?.kind === "media" ? [slot.id] : [],
              ),
            );
            const unslottedMedia = product.currentMediaImages.filter(
              (media) => !slottedMediaIds.has(media.id),
            );

            return (
            <div key={product.id} className="rounded-lg border bg-white p-4">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="mt-1 text-xs text-zinc-500">{product.sku}</p>
                </div>
                  <Button
                  type="button"
                  onClick={() => saveOrder(product)}
                  disabled={
                    savingOrder[product.id] ||
                    slots.every((slot) => !slot)
                  }
                >
                  {savingOrder[product.id] ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Check />
                  )}
                  Save Order
                </Button>
              </div>

              <div className="grid gap-4 xl:grid-cols-[220px_minmax(520px,1fr)_minmax(340px,1fr)]">
                <section>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Banner
                  </p>
                  <div className="h-44 overflow-hidden rounded-md border bg-zinc-50">
                    {product.currentBannerImage ? (
                      <img
                        src={getImageURL(product.currentBannerImage)}
                        alt={product.name ?? product.sku}
                        className="h-full w-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <ImageOff size={22} />
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Priority Slots
                  </p>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => {
                          if (!draggedItem || draggedItem.productId !== product.id) {
                            return;
                          }

                          assignPrioritySlot(
                            product.id,
                            index,
                            draggedItem.item,
                            draggedItem.fromSlot,
                          );
                          setDraggedItem(null);
                        }}
                        className="relative flex aspect-square min-h-32 items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50"
                      >
                        <div className="absolute left-2 top-2 z-10 rounded bg-black/75 px-2 py-1 text-xs font-medium text-white">
                          Priority {index + 1}
                        </div>
                        {slot ? (
                          <>
                            <img
                              src={slot.previewUrl}
                              alt={`${product.sku} priority ${index + 1}`}
                              className="h-full w-full object-cover"
                              draggable
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              onDragStart={() =>
                                setDraggedItem({
                                  productId: product.id,
                                  item: slot,
                                  fromSlot: index,
                                })
                              }
                            />
                            <button
                              type="button"
                              onClick={() => clearPrioritySlot(product.id, index)}
                              className="absolute right-2 top-2 z-10 rounded-full bg-white/90 p-1 text-zinc-700 shadow hover:bg-white"
                              aria-label={`Clear priority ${index + 1}`}
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <span className="px-3 text-center text-xs text-zinc-400">
                            Drop image here
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Other Gallery Images
                  </p>
                  {unslottedMedia.length ? (
                    <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                      {unslottedMedia.map((media) => (
                        <div
                          key={media.id}
                          draggable
                          onDragStart={() =>
                            setDraggedItem({
                              productId: product.id,
                              item: {
                                kind: "media",
                                id: media.id,
                                mediaURL: media.mediaURL,
                                previewUrl: getImageURL(media.mediaURL || ""),
                              },
                            })
                          }
                          className="group relative aspect-square cursor-grab overflow-hidden rounded-md border bg-zinc-50 active:cursor-grabbing"
                        >
                          <img
                            src={getImageURL(media.mediaURL || "")}
                            alt={`${product.sku} gallery image`}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/70 px-2 py-1 text-xs text-white">
                            <GripVertical size={12} />
                            Drag
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-md border text-sm text-zinc-500">
                      No unassigned gallery images
                    </div>
                  )}
                </section>

                <section>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    Drive Images
                  </p>
                  {product.imageCandidates.length ? (
                    <>
                      <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
                        {product.imageCandidates.map((candidate) => {
                          const selected = getSelectedImageUrls(product).includes(
                            candidate.downloadUrl,
                          );

                          return (
                            <button
                              key={candidate.id}
                              type="button"
                              draggable
                              onDragStart={() =>
                                setDraggedItem({
                                  productId: product.id,
                                  item: {
                                    kind: "drive",
                                    downloadUrl: candidate.downloadUrl,
                                    previewUrl: candidate.previewUrl,
                                    title: candidate.title,
                                  },
                                })
                              }
                              onClick={() =>
                                toggleSelectedImage(
                                  product.id,
                                  candidate.downloadUrl,
                                )
                              }
                              className={`relative aspect-square overflow-hidden rounded border-2 bg-zinc-50 ${
                                selected
                                  ? "border-black ring-2 ring-black"
                                  : "border-zinc-200"
                              }`}
                              title={candidate.title}
                            >
                              <LazyImage
                                src={candidate.previewUrl}
                                alt={candidate.title}
                                className="h-full w-full object-cover"
                              />
                              {selected && (
                                <span className="absolute right-1 top-1 rounded-full bg-black p-0.5 text-white">
                                  <Check size={12} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <Button
                        type="button"
                        className="mt-3"
                        onClick={() => approve(product)}
                        disabled={
                          approving[product.id] ||
                          getSelectedImageUrls(product).length === 0
                        }
                      >
                        {approving[product.id] ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Check />
                        )}
                        Add {getSelectedImageUrls(product).length} To Gallery
                      </Button>
                    </>
                  ) : (
                    <div className="flex h-44 items-center justify-center rounded-md border text-sm text-zinc-500">
                      No Drive images found
                    </div>
                  )}
                </section>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
