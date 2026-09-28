"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, User, Tag } from "lucide-react";
import { createBlog } from "@/helper/blog/action";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { useFileUpload } from "@/helper";
import { getImageUrl } from "@/helper/getimageUrl";

export default function BlogForm() {
  const router = useRouter();
  const { upload, uploading } = useFileUpload();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    blogCategory: "",
    date: new Date().toISOString().split("T")[0],
    data: "",
    image: "",
    userImage: "",
    userName: "",
    textArea: "",
    tags: "",
  });

  //   const handleFileUpload = async (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   field: string
  // ) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   const formDataUpload = new FormData();
  //   formDataUpload.append("file", file);

  //   try {
  //     const res = await fetch("/api/upload", {
  //       method: "POST",
  //       body: formDataUpload,
  //     });

  //     const data = await res.json();

  //     if (data.url) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         [field]: data.url, // ImageKit URL save
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Upload failed", error);
  //   }
  // };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { fileKey } = await upload(file, "blog");

      setFormData((prev) => ({
        ...prev,
        [field]: fileKey, // ✅ store key in DB
      }));
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Tags logic optimized for array schema
    const submissionData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
    };

    const res = await createBlog(submissionData);

    if (res.success) {
      alert("Blog Published Successfully!");
      router.push("/admin/blog");
      router.refresh();
    } else if (res.error === "slug_exists") {
      alert("Error: " + res.message);
    } else {
      alert("Error: Database connection failed. Run 'npx drizzle-kit push'.");
    }
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-none my-10">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-[#2D5A5D]">
          Create Professional Blog Post
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-medium">Blog Title</Label>
              <Input
                placeholder="Enter a catchy title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Category</Label>

              <select
                value={formData.blogCategory}
                onChange={(e) =>
                  setFormData({ ...formData, blogCategory: e.target.value })
                }
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select category</option>
                <option value="Air Taps">Air Taps</option>
                <option value="Bathroom Faucet">Bathroom Faucet</option>
                <option value="Food Waste Disposers">Food Waste Disposers</option>
                <option value="Floor Drainer">Floor Drainer</option>
                <option value="Granite Wash Basin">Granite Wash Basin</option>
                <option value="Kitchen Accessories">Kitchen Accessories</option>
                <option value="Kitchen Faucet">Kitchen Faucet</option>
                <option value="Steel Sinks">Steel Sinks</option>
                <option value="Towel Warmer">Towel Warmer</option>
              </select>

            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-medium">Blog Slug (URL Path)</Label>
              <Input
                placeholder="e.g. custom-url-path (auto-generated from title if blank)"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-medium">Publish Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium flex items-center gap-2">
                <Tag size={14} /> Tags (comma separated)
              </Label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="health, care, wellness"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Main Blog Banner</Label>
            <div className="relative border-2 border-dashed rounded-xl p-8 text-center hover:bg-slate-50 transition-all border-slate-200">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e, "image")}
              />
              {!formData.image && <Upload className="mx-auto h-10 w-10 text-slate-300" />}
              <p className="text-sm text-slate-500 mt-2">
                {formData.image
                  ? "Banner Uploaded ✅"
                  : "Click or drag to upload banner"}
              </p>
            </div>

            {
              formData.image &&
              <Image
                src={getImageUrl(formData.image)}
                alt="Blog banner preview"
                width={1200}
                height={600}
                className="h-80 w-full object-contain"
              />
            }
          </div>

          <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div className="space-y-2">
              <Label className="font-medium">Author Name</Label>
              <Input
                placeholder="e.g. Dr. Sarah"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Author Photo</Label>
              <div className="relative border border-slate-200 rounded-md p-2 bg-white text-center flex items-center justify-center gap-2">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => handleFileUpload(e, "userImage")}
                />
                <User size={16} className="text-slate-400" />
                <span className="text-sm text-slate-600">
                  {formData.userImage ? "Photo Ready" : "Upload Photo"}
                </span>
              </div>

            </div>

          </div>
          <div className="space-y-2 w-full">
            <Label className="font-medium w-full">Author Description</Label>
            <Textarea
              placeholder="Write a brief summary for author"
              value={formData.textArea}
              onChange={(e) =>
                setFormData({ ...formData, textArea: e.target.value })
              }

            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Meta Title (for SEO)</Label>
            <Input
              placeholder="Enter SEO meta title"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData({ ...formData, metaTitle: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">
              Short Meta Description (for SEO)
            </Label>
            <Textarea
              placeholder="Write a brief summary for search engines..."
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({ ...formData, metaDescription: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Main Blog Content</Label>
            <RichTextEditor
              value={formData.data}
              onChange={(val) => setFormData({ ...formData, data: val })}
            />
          </div>

          <Button
            type="submit"
            className="w-full  h-14 text-lg font-medium shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Publish Blog Post"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
