"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MultiCategorySelect } from "@/components/multiCategorySelect";
import GallerySection from "../GallerySection";
import AttributeSection from "../AttributeSection";
import {
  getProductFilterOptions,
  updateProduct,
} from "@/helper/product/action";
import { validateImage } from "@/lib/validateImage";
import { getImageURL } from "@/lib/getImageLin";
import { getStoredImageKey } from "@/lib/imagePath";
import { useFileUpload } from "@/helper";
import {
  productAttributeType,
  productMediaType,
  productType,
  productVarientType,
} from "@/types/productTypes";
import { Checkbox } from "@/components/ui/checkbox";
import ProductSpecificationSection from "../ProductSpecificationSection";
import ProductFaqSection from "../ProductFaqSection";
import SeoSchemaSection from "../SeoSchemaSection";
import { normalizeSize } from "@/lib/size";

type ImageItem = {
  key: string;
  preview: string;
  priority?: number | null;
};

type ProductDetailsType = {
  prodcutVarientBoxRes: productVarientType[];
  categoryRes: any;
  productAttributeRes: productAttributeType[];
  productMediaRes: productMediaType[];
  productFaqRes: any[];
} & productType;

type DynamicSpecCardProps = {
  title: string;
  type: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  options: string[];
  setOptions: React.Dispatch<React.SetStateAction<string[]>>;
  getSelectedValues: (key: string) => string[];
  toggleSpecAttribute: (key: string, val: string) => void;
  addDynamicOption: (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    options: string[],
    setOptions: React.Dispatch<React.SetStateAction<string[]>>,
    type: string
  ) => void;
};

const DynamicSpecCard = ({
  title,
  type,
  value,
  setValue,
  options,
  setOptions,
  getSelectedValues,
  toggleSpecAttribute,
  addDynamicOption,
}: DynamicSpecCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between gap-4">
          <span>{title}</span>

          <div className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Add ${title.toLowerCase()}`}
              className="h-9 w-40"
            />

            <Button
              type="button"
              size="sm"
              onClick={() =>
                addDynamicOption(value, setValue, options, setOptions, type)
              }
            >
              <Plus size={14} className="mr-1" />
              Add
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <select
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          value=""
          onChange={(e) => {
            if (!e.target.value) return;
            toggleSpecAttribute(type, e.target.value);
          }}
        >
          <option value="" disabled>
            Select {title.toLowerCase()}
          </option>

          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2">
          {getSelectedValues(type).map((item: string) => (
            <Button
              key={item}
              type="button"
              variant="default"
              className="rounded-full"
              onClick={() => toggleSpecAttribute(type, item)}
            >
              {item}
              <X size={12} className="ml-1" />
            </Button>
          ))}
        </div>

        {getSelectedValues(type).length === 0 && (
          <p className="text-sm text-muted-foreground">
            No {title.toLowerCase()} selected yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default function EditProduct({ productDetails }: any) {
  const router = useRouter();
  const { upload } = useFileUpload();

  const bannerRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const fileRefs = useRef<any[]>([]);

  const [finishOptions, setFinishOptions] = useState<string[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [materialOptions, setMaterialOptions] = useState<string[]>([]);

  const [newFinish, setNewFinish] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newMaterial, setNewMaterial] = useState("");
  const [newSizePriceSize, setNewSizePriceSize] = useState("");
  const [newSizePricePrice, setNewSizePricePrice] = useState("");

  const [brand, setBrand] = useState<any>(productDetails.brand);
  const [varientBox, setVarientBox] = useState(productDetails.hasVarientBox);
  const [variantBoxes, setVariantBoxes] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);


  const [faqs, setFaqs] = useState(
    productDetails?.productFaqRes?.length
      ? productDetails.productFaqRes.map((faq: any) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      }))
      : [
        {
          question: "",
          answer: "",
        },
      ]
  );

  const [seoSchemas, setSeoSchemas] = useState<any[]>(
    Array.isArray(productDetails.seoSchema) ? productDetails.seoSchema : []
  );

  const {
    categoryRes,
    productAttributeRes,
    productMediaRes,
    ...product
  }: ProductDetailsType = productDetails;


  const [videos, setVideos] = useState(
  (productMediaRes || [])
    .filter((m: any) => m.mediaType === "video")
    .map((m: any) => ({
      key: m.mediaURL,
    }))
);


  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryRes.map((c: any) => c?.categories?.id)
  );

  const [variants, setVariants] = useState<any>({
    id: product?.id || "",
    isExisting: true,
    name: product.name || "",
    sku: product.sku || "",
    slug: product.slug || "",
    metaTitle: product.metaTitle || "",
    metaDescription: product.metaDescription || "",
    price: product.basePrice || 0,
    strikethroughPrice: product.strikethroughPrice || 0,
    description: product.description || "",
    documents: (productMediaRes || [])
      .filter((m: any) => m.mediaType === "pdf")
      .map((m: any) => ({
        key: m.mediaURL,
        url: m.mediaURL,
        type: "pdf",
        name: m.mediaURL.split("/").pop(),
      })),
    banner: product.bannerImage
      ? { key: product.bannerImage, preview: product.bannerImage }
      : null,
    gallery: (productMediaRes || [])
      .filter((m: any) => m.mediaType === "image")
      .map((m: any) => ({
        key: m.mediaURL,
        preview: m.mediaURL,
        priority: m.priority ?? null,
      })),
    attributes: Object.fromEntries(
      (productAttributeRes || []).map((a: any) => [
        a.attribute,
        { id: a.id, value: a.value },
      ])
    ),
    isInStock: product.isInStock ?? true,
    isHide: product.isHidden ?? false,
    highlights: product.highlights || [],
    sizePrices: product.sizePrices || [],
  });

  useEffect(() => {
    if (productDetails?.prodcutVarientBoxRes?.length) {
      setVariantBoxes(
        productDetails.prodcutVarientBoxRes.map((v: any) => ({
          id: v.id,
          name: v.name || "",
          description: v.description || "",
          image: v.image || "",
        }))
      );
    }
  }, [productDetails]);

  useEffect(() => {
    const loadDynamicFilterOptions = async () => {
      try {
        const options = await getProductFilterOptions();

        setFinishOptions(options.finishOptions.map((item: any) => item.label));
        setSizeOptions(options.sizeOptions.map((item: any) => item.label));
        setMaterialOptions(
          options.materialOptions.map((item: any) => item.label)
        );
      } catch (err) {
        console.error("Failed to load filter options:", err);
      }
    };

    loadDynamicFilterOptions();
  }, []);

  useEffect(() => {
    if (!productDetails?.filters) return;

    const filters = productDetails.filters;

    const getValues = (type: string) =>
      filters
        .filter((f: any) => f.type === type)
        .map((f: any) => f.filter)
        .filter(Boolean)
        .join(",");

    setVariants((prev: any) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        finish: {
          ...prev.attributes.finish,
          value: getValues("finish"),
        },
        size: {
          ...prev.attributes.size,
          value: getValues("size"),
        },
        material: {
          ...prev.attributes.material,
          value: getValues("material"),
        },
      },
    }));
  }, [productDetails]);

  const toggleSpecAttribute = (key: string, val: string) => {
    const currentAttrValue = variants.attributes[key]?.value || "";
    let selectedArray = currentAttrValue
      ? currentAttrValue.split(",").filter(Boolean)
      : [];

    if (selectedArray.includes(val)) {
      selectedArray = selectedArray.filter((item: string) => item !== val);
    } else {
      selectedArray.push(val);
    }

    setVariants((prev: any) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: {
          ...prev.attributes[key],
          value: selectedArray.join(","),
        },
      },
    }));
  };

  const getSelectedValues = (key: string) => {
    return variants.attributes[key]?.value
      ? variants.attributes[key].value.split(",").filter(Boolean)
      : [];
  };

  const addDynamicOption = (
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    options: string[],
    setOptions: React.Dispatch<React.SetStateAction<string[]>>,
    type: string
  ) => {
    const raw = value.trim();
    if (!raw) return toast.error("Enter a value first");

    // Normalize size values to canonical form (e.g. "18 X 16" → "18x16")
    const cleaned = type === "size" ? normalizeSize(raw) : raw;

    if (!options.some((item) => item.toLowerCase() === cleaned.toLowerCase())) {
      setOptions([...options, cleaned]);
    }

    const currentAttrValue = variants.attributes[type]?.value || "";
    const selectedArray = currentAttrValue
      ? currentAttrValue.split(",").filter(Boolean)
      : [];

    if (!selectedArray.includes(cleaned)) {
      selectedArray.push(cleaned);
    }

    setVariants((prev: any) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [type]: {
          ...prev.attributes[type],
          value: selectedArray.join(","),
        },
      },
    }));

    setValue("");
  };

  const buildFilterItems = (values: string[], type: string) => {
    return values.map((item) => ({
      name: item,
      value: item,
      filter: item,
      type,
    }));
  };

  const handleBanner = async (file?: File) => {
    if (!file) return;

    try {
      await validateImage(file, {
        maxSizeMB: 2,
        maxWidth: 2000,
        maxHeight: 2000,
        ratio: 1,
      });

      const { fileKey, preview } = await upload(file, "product");

      setVariants((prev: any) => ({
        ...prev,
        banner: {
          key: fileKey,
          preview,
        },
      }));

      toast.success("Banner uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleGallery = async (files: FileList | null) => {
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        await validateImage(file, {
          maxSizeMB: 2,
          maxWidth: 2000,
          maxHeight: 2000,
          ratio: 2000 / 2000,
        });

        const { fileKey, preview } = await upload(file, "product");

        setVariants((prev: any) => ({
          ...prev,
          gallery: [...prev.gallery, { key: fileKey, preview }],
        }));

        toast.success("Image uploaded");
      } catch (err: any) {
        toast.info(err.message);
      }
    }
  };

  const handleVariantImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { fileKey, preview } = await upload(file, "product");

      const updated = [...variantBoxes];
      updated[index].image = preview;
      updated[index].key = fileKey;
      setVariantBoxes(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const setGalleryForActive = (action: React.SetStateAction<ImageItem[]>) => {
    const currentGallery = variants.gallery;
    const nextGallery =
      typeof action === "function" ? (action as any)(currentGallery) : action;

    setVariants((prev: any) => ({ ...prev, gallery: nextGallery }));
  };

  const updateVariantBox = (index: number, key: string, value: any) => {
    const updated = [...variantBoxes];
    updated[index] = { ...updated[index], [key]: value };
    setVariantBoxes(updated);
  };

  const addVariantBox = () => {
    setVariantBoxes([
      ...variantBoxes,
      { name: "", description: "", image: "" },
    ]);
  };

  const removeVariantBox = (index: number) => {
    setVariantBoxes(variantBoxes.filter((_, i) => i !== index));
  };

  const handleAddSizePrice = () => {
    if (!newSizePriceSize.trim()) {
      return toast.error("Size is required");
    }
    const priceVal = Number(newSizePricePrice);
    if (isNaN(priceVal) || priceVal < 0 || newSizePricePrice === "") {
      return toast.error("Please enter a valid price");
    }
    setVariants((prev: any) => ({
      ...prev,
      sizePrices: [
        ...(prev.sizePrices || []),
        { size: newSizePriceSize.trim(), price: priceVal }
      ]
    }));
    setNewSizePriceSize("");
    setNewSizePricePrice("");
  };

  const handleRemoveSizePrice = (index: number) => {
    setVariants((prev: any) => ({
      ...prev,
      sizePrices: (prev.sizePrices || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      return toast.error("Select a category");
    }

    if (!variants?.id) {
      return toast.error("Product id missing");
    }

    const formData = new FormData();

    formData.set("id", String(variants.id));

    selectedCategories.forEach((catId) =>
      formData.append("category[]", catId)
    );

    const payload = {
      ...variants,
      id: variants.isExisting ? variants.id : undefined,
      brand,
      bannerImage: getStoredImageKey(
        variants.banner?.key || variants.banner?.preview
      ),
      media: [
        ...variants.gallery.map((g: any) => ({
          mediaType: "image",
          mediaURL: getStoredImageKey(g.key || g.preview),
          priority: g.priority ?? null,
        })),
        ...videos.map((v: any) => ({
          mediaType: "video",
          mediaURL: getStoredImageKey(v.key || v.url),
        })),
        ...variants.documents.map((d: any) => ({
          mediaType: "pdf",
          mediaURL: d.key,
        })),
      ],
      highlights: variants.highlights.filter(
        (h: string) => h.trim().length > 0
      ),
      faqs: faqs.filter(
        (faq: any) =>
          faq.question.trim().length > 0 && faq.answer.trim().length > 0
      ),
      attributes: Object.entries(variants.attributes)
        .map(([attr, val]: [string, any]) => ({
          attribute: attr,
          value: val.value,
        }))
        .filter((a: any) => a.value?.trim()?.length > 0),
      filters: [
        ...buildFilterItems(getSelectedValues("finish"), "finish"),
        ...buildFilterItems(getSelectedValues("size"), "size"),
        ...buildFilterItems(getSelectedValues("material"), "material"),
      ],
      VarientBoxes: varientBox
        ? variantBoxes.map((item: any) => ({
          ...item,
          image: getStoredImageKey(item.key || item.image),
        }))
        : [],
      hasVarientBox: varientBox,
      isHidden: variants.isHide,
      seoSchema: seoSchemas.length > 0 ? seoSchemas : null,
    };
    //  console.log("sending this payload",payload)
    formData.set("variants", JSON.stringify(payload));

    try {
      setIsSaving(true);
      await updateProduct(formData);
      toast.success("Product updated successfully!");
      router.push("/admin/product");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update product");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }

    try {
      const { fileKey, fileUrl } = await upload(file, "product-documents");

      setVariants((prev: any) => ({
        ...prev,
        documents: [
          ...prev.documents,
          {
            key: fileKey,
            url: fileUrl,
            type: "pdf",
            name: file.name,
          },
        ],
      }));

      toast.success("PDF uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Only video files allowed");
      return;
    }

    try {
      const { fileKey, fileUrl } = await upload(file, "product-videos");

      setVideos((prev) => [
        ...prev,
        {
          key: fileKey,
          url: fileUrl,
        },
      ]);

      toast.success("Video uploaded");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

function getVideoURL(path: string | null | undefined) {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL!;

  if (!path) return "";

  if (path.startsWith("http")) {
    return path;
  }

  return `${baseUrl}/${path.replace(/^\/+/, "")}?tr=orig`;
}
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <form onSubmit={handleUpdateProduct}>
        <div className="flex justify-between items-center sticky top-0 z-10 py-4 bg-white border-b">
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-sm text-gray-500">{product.slug}</p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/product")}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <><Loader2 className="animate-spin w-4 h-4 mr-2" />Saving...</>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Categories</CardTitle>
              </CardHeader>

              <CardContent>
                <MultiCategorySelect
                  selectedCategories={selectedCategories}
                  onCategoriesChange={setSelectedCategories}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input
                      required
                      value={variants.name}
                      onChange={(e) =>
                        setVariants({ ...variants, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>SKU</Label>
                    <Input
                      required
                      value={variants.sku}
                      onChange={(e) =>
                        setVariants({ ...variants, sku: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={variants.slug}
                    onChange={(e) =>
                      setVariants({ ...variants, slug: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={variants.metaTitle}
                    onChange={(e) =>
                      setVariants({ ...variants, metaTitle: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={variants.metaDescription}
                    onChange={(e) =>
                      setVariants({ ...variants, metaDescription: e.target.value })
                    }
                  />
                </div>

                <div className="grid md:grid-cols-4 gap-10">
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={variants.price}
                      onChange={(e) =>
                        setVariants({
                          ...variants,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Strike Price</Label>
                    <Input
                      type="number"
                      value={variants.strikethroughPrice}
                      onChange={(e) =>
                        setVariants({
                          ...variants,
                          strikethroughPrice: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      checked={variants.isInStock}
                      onCheckedChange={(c) =>
                        setVariants({ ...variants, isInStock: c })
                      }
                    />
                    <Label>In Stock</Label>
                  </div>

                  <div className="flex items-end justify-end ">
                    <Checkbox className="border border-white"
                      checked={variants.isHide}
                      onCheckedChange={(c) =>
                        setVariants({ ...variants, isHide: c })
                      }
                    />
                    <Label>Hide</Label>
                  </div>

                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={variants.description}
                    onChange={(e) =>
                      setVariants({ ...variants, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Highlights</Label>

                  <div className="flex flex-col gap-2">
                    {variants.highlights.map((h: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={h}
                          onChange={(e) => {
                            const newHighlights = [...variants.highlights];
                            newHighlights[i] = e.target.value;

                            setVariants({
                              ...variants,
                              highlights: newHighlights,
                            });
                          }}
                          placeholder="Enter highlight"
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newHighlights = variants.highlights.filter(
                              (_: string, idx: number) => idx !== i
                            );

                            setVariants({
                              ...variants,
                              highlights: newHighlights,
                            });
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setVariants({
                          ...variants,
                          highlights: [...variants.highlights, ""],
                        });
                      }}
                    >
                      + Add Highlight
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Banner Image</Label>

                  <div
                    onClick={() => bannerRef.current?.click()}
                    className="border-2 border-dashed rounded-xl h-48 flex items-center justify-center cursor-pointer relative overflow-hidden"
                  >
                    {!variants.banner ? (
                      <p>Click to upload banner</p>
                    ) : (
                      <Image
                        src={getImageURL(variants.banner.preview)}
                        width={800}
                        height={400}
                        className="w-full h-full object-contain"
                        alt="Banner Preview"
                      />
                    )}
                  </div>

                  <input
                    ref={bannerRef}
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleBanner(e.target.files?.[0])}
                  />

                  {variants.banner && (
                    <Image
                      src={getImageURL(variants.banner.preview)}
                      width={300}
                      height={400}
                      className="h-32 w-24 object-cover rounded-md border mt-2"
                      alt="Preview"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Size & Price Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Size (Text)</Label>
                    <Input
                      placeholder='e.g. 18"top, 20'
                      value={newSizePriceSize}
                      onChange={(e) => setNewSizePriceSize(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (Number)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 28000"
                      value={newSizePricePrice}
                      onChange={(e) => setNewSizePricePrice(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAddSizePrice}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" /> Add Size & Price
                </Button>

                <div className="space-y-2 mt-4">
                  {variants.sizePrices && variants.sizePrices.length > 0 ? (
                    variants.sizePrices.map((sp: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <div className="flex gap-4">
                          <span className="font-medium">Size: {sp.size}</span>
                          <span className="text-muted-foreground">
                            Price: {sp.price}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveSizePrice(idx)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No size & price options added yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <DynamicSpecCard
              title="Finish"
              type="finish"
              value={newFinish}
              setValue={setNewFinish}
              options={finishOptions}
              setOptions={setFinishOptions}
              getSelectedValues={getSelectedValues}
              toggleSpecAttribute={toggleSpecAttribute}
              addDynamicOption={addDynamicOption}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <DynamicSpecCard
                title="Size"
                type="size"
                value={newSize}
                setValue={setNewSize}
                options={sizeOptions}
                setOptions={setSizeOptions}
                getSelectedValues={getSelectedValues}
                toggleSpecAttribute={toggleSpecAttribute}
                addDynamicOption={addDynamicOption}
              />

              <DynamicSpecCard
                title="Material"
                type="material"
                value={newMaterial}
                setValue={setNewMaterial}
                options={materialOptions}
                setOptions={setMaterialOptions}
                getSelectedValues={getSelectedValues}
                toggleSpecAttribute={toggleSpecAttribute}
                addDynamicOption={addDynamicOption}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Product Videos</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                />

                <div className="space-y-3">
                  {videos.map((video, index) => (
                    <div key={index}>
                      <video
                        src={getVideoURL(video.key)}
                        controls
                        className="w-full max-w-md rounded-lg border"
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        className="mt-2"
                        onClick={() =>
                          setVideos((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">Colour Variants</span>

                  <Checkbox
                 className="border border-gray-400 bg-white !block"
                    checked={varientBox}
                    onCheckedChange={(val) => setVarientBox(!!val)}
                  />
                </CardTitle>
              </CardHeader>

              {varientBox && (
                <CardContent className="space-y-4">
                  {variantBoxes.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-xl p-4 grid md:grid-cols-6 gap-4 items-center"
                    >
                      <div className="col-span-1">
                        <div
                          onClick={() => fileRefs.current[index]?.click()}
                          className="h-20 w-20 border rounded-md overflow-hidden flex items-center justify-center bg-gray-100 cursor-pointer hover:opacity-80"
                        >
                          {item.image ? (
                            <Image
                              src={getImageURL(item.image)}
                              width={200}
                              height={200}
                              className="h-full w-full object-cover"
                              alt="Variant"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">
                              Upload
                            </span>
                          )}
                        </div>

                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          ref={(el: any) => {
                            fileRefs.current[index] = el;
                          }}
                          onChange={(e) => handleVariantImage(e, index)}
                        />
                      </div>

                      <div className="col-span-2">
                        <Input
                          placeholder="Variant Name (e.g. Chrome, Gold)"
                          value={item.name}
                          onChange={(e) =>
                            updateVariantBox(index, "name", e.target.value)
                          }
                        />
                      </div>

                      <div className="col-span-2">
                        <Input
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) =>
                            updateVariantBox(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeVariantBox(index)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addVariantBox}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Variant
                  </Button>
                </CardContent>
              )}
            </Card>

            <GallerySection
              gallery={variants.gallery}
              galleryRef={galleryRef}
              handleGallery={handleGallery}
              setGallery={setGalleryForActive}
            />

            <AttributeSection
              productAttributes={variants.attributes}
              documents={variants.documents}
              handlePdfUpload={handlePdfUpload}
              setPdfDocuments={(docs: any) => {
                setVariants((prev: any) => ({
                  ...prev,
                  documents: docs,
                }));
              }}
              handleValueChange={(k, v) => {
                const current = variants.attributes;

                setVariants({
                  ...variants,
                  attributes: {
                    ...current,
                    [k]: {
                      ...current[k],
                      value: v,
                    },
                  },
                });
              }}
            />

            <ProductSpecificationSection
              productSpecifications={variants.attributes}
              handleSpecificationChange={(k, v) => {
                const current = variants.attributes;

                setVariants({
                  ...variants,
                  attributes: {
                    ...current,
                    [k]: {
                      ...current[k],
                      value: v,
                    },
                  },
                });
              }}
            />

            <ProductFaqSection faqs={faqs} setFaqs={setFaqs} />

            <SeoSchemaSection seoSchemas={seoSchemas} setSeoSchemas={setSeoSchemas} />
          </div>
        </div>
      </form>
    </div>
  );
}
