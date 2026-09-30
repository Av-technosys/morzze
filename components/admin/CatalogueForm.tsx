"use client";

import Image from "next/image";
import { useMemo, useState, useRef, useEffect } from "react";
import Link from "@/hooks/appLink"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileText, Loader2, Upload } from "lucide-react";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFileUpload } from "@/helper";
import { createCatalogue, updateCatalogue } from "@/helper/catalogue/action";

export type CatalogueInitialData = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  pdfFile: string;
  totalPages: number;
  fileSize: string;
  publishYear: string;
  category: string;
  isFeatured: boolean | null;
  isActive: boolean | null;
};

type Props = {
  mode: "create" | "edit";
  initialData?: CatalogueInitialData;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildFormData(values: {
  title: string;
  slug: string;
  shortDescription: string;
  image: string;
  pdfFile: string;
  totalPages: string;
  fileSize: string;
  publishYear: string;
  category: string;
  isFeatured: boolean;
  isActive: boolean;
}): FormData {
  const fd = new FormData();
  fd.append("title", values.title);
  fd.append("slug", values.slug);
  fd.append("shortDescription", values.shortDescription);
  fd.append("image", values.image);
  fd.append("pdfFile", values.pdfFile);
  fd.append("totalPages", values.totalPages);
  fd.append("fileSize", values.fileSize);
  fd.append("publishYear", values.publishYear);
  fd.append("category", values.category);
  if (values.isFeatured) fd.append("isFeatured", "on");
  if (values.isActive) fd.append("isActive", "on");
  return fd;
}

export default function CatalogueForm({ mode, initialData }: Props) {
  const router = useRouter();
  const { upload, uploading } = useFileUpload();
  const [loading, setLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    () => (initialData ? initialData.image : null),
  );
  const blobRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobRef.current) {
        try {
          URL.revokeObjectURL(blobRef.current);
        } catch (e) {
          /* ignore */
        }
      }
    };
  }, []);

  const defaults = useMemo(
    () => ({
      title: "",
      slug: "",
      shortDescription: "",
      image: "",
      pdfFile: "",
      totalPages: "",
      fileSize: "",
      publishYear: new Date().getFullYear().toString(),
      category: "",
      isFeatured: false,
      isActive: true,
    }),
    [],
  );

  const [form, setForm] = useState(() =>
    initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          shortDescription: initialData.shortDescription,
          image: initialData.image,
          pdfFile: (() => {
            try {
              const v = initialData.pdfFile || "";
              return v.includes("/") ? v.split("/").pop() || v : v;
            } catch (e) {
              return initialData.pdfFile;
            }
          })(),
          totalPages: String(initialData.totalPages),
          fileSize: initialData.fileSize,
          publishYear: initialData.publishYear,
          category: initialData.category,
          isFeatured: Boolean(initialData.isFeatured),
          isActive: initialData.isActive !== false,
        }
      : { ...defaults },
  );

  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await (await import("@/helper")).getCategories();
        setCategories(
          data.map((c: any) => ({ value: c.slug, label: c.name })) || [],
        );
      } catch (e) {
        // ignore
      }
    }
    loadCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    try {
      // show local preview immediately
      const local = URL.createObjectURL(file);
      // cleanup previous blob url
      if (blobRef.current) {
        try {
          URL.revokeObjectURL(blobRef.current);
        } catch (e) {
          /* ignore */
        }
      }
      blobRef.current = local;
      setCoverPreview(local);

      const { fileUrl, preview } = await upload(file, "catalogue");
      // prefer returned remote URL when available
      const finalUrl = fileUrl ?? preview ?? local;
      setForm((prev) => ({ ...prev, image: finalUrl }));
      // revoke local blob if we switched to remote
      if (blobRef.current && finalUrl !== blobRef.current) {
        try {
          URL.revokeObjectURL(blobRef.current);
        } catch (e) {
          /* ignore */
        }
        blobRef.current = null;
      }

      setCoverPreview(finalUrl);
      toast.success("Cover image uploaded");
    } catch {
      toast.error("Image upload failed");
    }
    e.target.value = "";
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Please choose a PDF file");
      return;
    }
    try {
      const { fileUrl, fileKey, preview } = await upload(file, "catalogue");
      // store only the filename (basename) in the form and database
      const basename = (fileUrl ?? fileKey ?? file.name)
        .toString()
        .split("/")
        .pop();
      setForm((prev) => ({
        ...prev,
        pdfFile: basename ?? file.name,
        fileSize: formatFileSize(file.size),
      }));
      toast.success("PDF uploaded");
    } catch {
      toast.error("PDF upload failed");
    }
    e.target.value = "";
  };

  const onTitleBlur = () => {
    if (mode !== "create") return;
    if (!form.slug.trim() && form.title.trim()) {
      setForm((prev) => ({ ...prev, slug: slugFromTitle(prev.title) }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image.trim()) {
      toast.error("Upload a cover image");
      return;
    }
    if (!form.pdfFile.trim()) {
      toast.error("Upload a PDF catalogue");
      return;
    }

    setLoading(true);
    const fd = buildFormData(form);

    const res =
      mode === "create"
        ? await createCatalogue(fd)
        : await updateCatalogue(initialData!.id, fd);

    setLoading(false);

    if (res.success) {
      toast.success(
        res.message ??
          (mode === "create"
            ? "Catalogue added successfully"
            : "Catalogue updated successfully"),
      );
      router.push("/admin/catalogue");
      router.refresh();
    } else {
      toast.error(
        res.message ??
          (mode === "create"
            ? "Could not add catalogue"
            : "Could not update catalogue"),
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2D5A5D]">
          {mode === "create" ? "Add catalogue" : "Edit catalogue"}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/admin/catalogue">Back to list</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-lg text-[#2D5A5D]">
            Catalogue details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                onBlur={onTitleBlur}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) =>
                  setForm((p) => ({ ...p, slug: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortDescription">Short description</Label>
              <Textarea
                id="shortDescription"
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((p) => ({ ...p, shortDescription: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Cover image</Label>
              <div className="relative border-2 border-dashed rounded-xl p-8 text-center hover:bg-slate-50 transition border-slate-200">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  disabled={uploading || loading}
                />
                {coverPreview ? (
                  <Image
                    src={coverPreview}
                    alt="cover preview"
                    width={400}
                    height={500}
                    className="mx-auto h-40 object-contain"
                  />
                ) : (
                  <Upload className="mx-auto h-10 w-10 text-slate-300" />
                )}
                <p className="text-sm text-slate-500 mt-2">
                  {form.image
                    ? "Cover uploaded — click to replace"
                    : "Click or drag to upload cover (same flow as blog)"}
                </p>
                {form.image ? (
                  <p className="text-xs text-slate-400 mt-1 truncate max-w-full px-2">
                    {/* {form.image} */}
                  </p>
                ) : null}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Catalogue PDF</Label>
              <div className="relative border-2 border-dashed rounded-xl p-8 text-center hover:bg-slate-50 transition border-slate-200">
                <input
                  type="file"
                  accept="application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handlePdfUpload}
                  disabled={uploading || loading}
                />
                <FileText className="mx-auto h-10 w-10 text-slate-300" />
                <p className="text-sm text-slate-500 mt-2">
                  {form.pdfFile
                    ? "PDF uploaded — click to replace"
                    : "Upload PDF catalogue"}
                </p>
                {form.pdfFile ? (
                  <p className="text-xs text-slate-400 mt-1 truncate max-w-full px-2">
                    {form.pdfFile}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalPages">Total pages</Label>
                <Input
                  id="totalPages"
                  type="number"
                  min={1}
                  value={form.totalPages}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, totalPages: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fileSize">File size</Label>
                <Input
                  id="fileSize"
                  value={form.fileSize}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, fileSize: e.target.value }))
                  }
                  placeholder="Filled when you upload a PDF"
                  required
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="publishYear">Publish year</Label>
                <Input
                  id="publishYear"
                  value={form.publishYear}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, publishYear: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  placeholder="Select Category"
                  label="Category"
                  selectItems={categories}
                  value={form.category || undefined}
                  onValueChange={(val) =>
                    setForm((p) => ({ ...p, category: val ?? "" }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isFeatured: e.target.checked }))
                  }
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, isActive: e.target.checked }))
                  }
                />
                Active
              </label>
            </div>
            <Button
              type="submit"
              
              disabled={loading || uploading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : mode === "create" ? (
                "Create catalogue"
              ) : (
                "Update catalogue"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
