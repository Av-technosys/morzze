/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getImageURL } from "@/lib/getImageLin";
import { ImagePlus, X } from "lucide-react";
import React, { RefObject } from "react";

type ImageItem = { key: string; preview: string; priority?: number | null };

type Props = {
  gallery: ImageItem[];
  galleryRef: RefObject<HTMLInputElement | null>;
  handleGallery: (files: FileList | null) => void;
  setGallery: React.Dispatch<React.SetStateAction<ImageItem[]>>;
};

export default function GallerySection({
  gallery,
  galleryRef,
  handleGallery,
  setGallery
}: Props) {
  const updatePriority = (index: number, value: string) => {
    const priority = value === "" ? null : Number(value);

    setGallery((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, priority } : item,
      ),
    );
  };

  return (
    <Card className="m-1">
      <CardHeader>
        <CardTitle>Product Gallery</CardTitle>
        <CardDescription>Additional product images</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        <div className="lg:col-span-4 w-full">
          <div
            onClick={() => galleryRef.current?.click()}
            className="flex flex-col items-center justify-center border-3 border-dashed border-muted-foreground/20 rounded-xl h-48 hover:bg-muted/50 transition-all cursor-pointer group"
          >
            <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
              <ImagePlus size={32} className="text-primary" />
            </div>
            <p className="mt-3 text-sm font-semibold">Upload images</p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to 2MB
            </p>
          </div>
        </div>

        <input
          ref={galleryRef}
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={(e) => handleGallery(e.target.files)}
        />

        <div className="lg:col-span-8 w-full">
          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((img, i) => (
                <div
                  key={i}
                  className="relative group aspect-square border rounded-lg overflow-hidden bg-muted"
                >
                  <Image
                    src={getImageURL(img.preview)}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover"
                    alt="preview"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                    type="button"
                      onClick={() =>
                        setGallery((prev) => prev.filter((_, x) => x !== i))
                      }
                      className="cursor-pointer absolute top-1 right-1 bg-black/60 text-white rounded px-2 py-1"
                    >
                      <X size={14} />
                    </Button>
                  </div>

                  <div className="absolute left-2 bottom-2 right-2">
                    <Input
                      type="number"
                      min={1}
                      value={img.priority ?? ""}
                      onChange={(e) => updatePriority(i, e.target.value)}
                      placeholder="Gallery priority"
                      className="h-8 bg-white/90 text-xs"
                      aria-label={`Gallery priority for image ${i + 1}`}
                    />
                  </div>

                  <input type="hidden" name="media" value={img.key} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center border rounded-xl border-muted bg-muted/10 text-muted-foreground">
              <p className="text-sm">No images selected</p>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
