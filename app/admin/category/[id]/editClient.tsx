/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { getAllCategoriesMeta, updateCategory } from "@/helper/category/action";
import { toast } from "sonner";
// Naya ImageUpload component import karein
import ImageUpload from "@/components/ImageUpload";
import { useFileUpload } from "@/helper";
import { getImageURL } from "@/lib/getImageLin";
import { getStoredImageKey } from "@/lib/imagePath";

function slugFromText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditCategory({ categoryInfo }: any) {
  const router = useRouter();
  const { upload, uploading } = useFileUpload();
  const bannerRef = useRef<HTMLInputElement>(null);
  const horizontalBannerRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: categoryInfo.name,
    slug: categoryInfo.slug ?? "",
    parent: categoryInfo.parentId ?? "",
    description: categoryInfo.description ?? "",
    type: categoryInfo.type
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedParent, setSelectedParent] = useState<string>(categoryInfo.type || "");

  // Existing image ko preview mein set kar rahe hain
  const [preview, setPreview] = useState<string | null>(
    categoryInfo.bannerImage ?? null,
  );
  const [bannerKey, setBannerKey] = useState<string>(
    categoryInfo.bannerImage ?? "",
  );

  const [horizontalPreview, setHorizontalPreview] = useState<string | null>(
    categoryInfo.horizontalBannerImage ?? null,
  );
  const [horizontalBannerKey, setHorizontalBannerKey] = useState<string>(
    categoryInfo.horizontalBannerImage ?? "",
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getAllCategoriesMeta();
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const categoryData = {
      id: categoryInfo.id,
      name: form.name,
      slug: form.slug,
      type: selectedParent,
      description: form.description,
      // type: form.type,
      bannerImage: getStoredImageKey(bannerKey || preview),
      horizontalBannerImage: getStoredImageKey(horizontalBannerKey || horizontalPreview),
    };
    // console.log(categoryData)
    const response = await updateCategory(categoryData);
    if (response?.success == true) {
      toast.success(response.message ?? "Category updated successfully");
      router.push("/admin/category");
    } else {
      toast.error(response?.message ?? "Failed to update category");
    }
  };

  const handleBanner = async (file?: File) => {
    if (!file) return;

    try {
      const { fileKey, fileUrl } = await upload(file, "category");

      setPreview(fileUrl as any); // UI ke liye
      setBannerKey(fileKey);

      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleHorizontalBanner = async (file?: File) => {
    if (!file) return;

    try {
      const { fileKey, fileUrl } = await upload(file, "category");

      setHorizontalPreview(fileUrl as any);
      setHorizontalBannerKey(fileKey);

      toast.success("Horizontal image uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="w-full p-1">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Manage Category
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Update category details and visibility.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={(e) => submitHandler(e)}>
            <input type="hidden" name="id" value={categoryInfo.id} />
            <input type="hidden" name="parentId" value={selectedParent} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Left column */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-medium">
                    Category Name
                  </Label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-medium">
                    Slug
                  </Label>
                  <Input
                    name="slug"
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: slugFromText(e.target.value) })
                    }
                    placeholder="floor-drainers"
                    className="h-11"
                  />
                  <p className="text-xs text-slate-500">
                    Used in category URL, for example /bathroom/floor-drainers.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-medium">
                    Parent Category
                  </Label>
                  <Select
                    value={selectedParent}
                    onValueChange={(value) => setSelectedParent(value)}
                    defaultValue={form.type}
                    name="type"
                  >
                    <SelectTrigger defaultValue={form.type} className="h-11">
                      <SelectValue placeholder="Select parent" />
                    </SelectTrigger>
                    <SelectContent>
                      {["kitchen", "bathroom"].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-medium">
                    Description
                  </Label>
                  <Textarea
                    name="description"
                    defaultValue={categoryInfo.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="min-h-[140px] resize-none"
                  />
                </div>
              </div>

              {/* Right column - Updated Image Logic */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label className="text-slate-600 font-medium">
                    Category Image
                  </Label>

                  {/* ImageUpload component with initial image support */}
                  {/* <ImageUpload 
                    onUploadSuccess={(url) => setPreview(url)} 
                    initialImage={preview} // Agar aap apne ImageUpload component mein ye prop add karein to purani image dikhegi
                  /> */}

                  <div
                    onClick={() => bannerRef.current?.click()}
                    className="border-2 border-dashed rounded-xl h-48 flex items-center justify-center cursor-pointer relative overflow-hidden"
                  >
                    {!preview ? (
                      <p>Click to upload category image</p>
                    ) : (
                      <Image
                        src={getImageURL(preview)}
                        alt="Category banner preview"
                        width={800}
                        height={400}
                        className="w-full h-full object-contain"
                      />
                    )}

                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        Uploading...
                      </div>
                    )}
                  </div>

                  <input
                    ref={bannerRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleBanner(e.target.files?.[0])}
                  />

                  {preview && !preview.startsWith("http") && (
                    <p className="text-xs text-blue-600 mt-1 italic">
                      Note: New image selected. Click Update to save.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 pt-4">
                  <Label className="text-slate-600 font-medium">
                    Horizontal Category Image
                  </Label>

                  <div
                    onClick={() => horizontalBannerRef.current?.click()}
                    className="border-2 border-dashed rounded-xl h-48 flex items-center justify-center cursor-pointer relative overflow-hidden"
                  >
                    {!horizontalPreview ? (
                      <p>Click to upload horizontal image</p>
                    ) : (
                      <Image
                        src={getImageURL(horizontalPreview)}
                        alt="Horizontal banner preview"
                        width={800}
                        height={400}
                        className="w-full h-full object-contain"
                      />
                    )}

                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        Uploading...
                      </div>
                    )}
                  </div>

                  <input
                    ref={horizontalBannerRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleHorizontalBanner(e.target.files?.[0])}
                  />

                  {horizontalPreview && !horizontalPreview.startsWith("http") && (
                    <p className="text-xs text-blue-600 mt-1 italic">
                      Note: New horizontal image selected. Click Update to save.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 px-0 pt-10">
              <Button
                type="button"
                onClick={() => router.push("/admin/category")}
                variant="outline"
                className="px-12 h-11 rounded-full"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="px-12 h-11 rounded-full bg-[#2D5A5D] hover:bg-[#234749] text-white"
              >
                Update
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
