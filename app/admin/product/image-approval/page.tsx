"use client";

import Link from "next/link";
import { ArrowRight, FolderOpen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type DriveCategory = {
  slug: string;
  label: string;
  driveTitle: string;
  folderId: string;
  available: boolean;
};

export default function ProductImageApprovalCategoriesPage() {
  const [categories, setCategories] = useState<DriveCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/product-images/approval", {
          cache: "no-store",
        });
        const data = (await res.json()) as {
          success: boolean;
          message?: string;
          categories?: DriveCategory[];
        };

        if (!res.ok || !data.success) {
          toast.error(data.message ?? "Unable to load Drive categories");
          return;
        }

        setCategories(data.categories ?? []);
      } catch {
        toast.error("Unable to load Drive categories");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Product Image Approval</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Select a category to manage banner context, gallery order, and Drive images.
        </p>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-md border">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/admin/product/image-approval/${category.slug}`}
              className="rounded-lg border bg-white p-5 transition-colors hover:bg-zinc-50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-zinc-100">
                <FolderOpen size={20} />
              </div>
              <h2 className="text-lg font-semibold">{category.label}</h2>
              <p className="mt-2 min-h-10 text-sm text-zinc-500">
                Drive folder: {category.driveTitle}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Open Category
                <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
