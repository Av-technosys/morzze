/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { MultiCategorySelect } from "@/components/multiCategorySelect";
import {
  createProduct,
  getProductFilterOptions,
} from "@/helper/product/action";
import GallerySection from "../GallerySection";
import AttributeSection from "../AttributeSection";
import { validateImage } from "@/lib/validateImage";
import { getImageURL } from "@/lib/getImageLin";
import { getStoredImageKey } from "@/lib/imagePath";
import { useFileUpload } from "@/helper";
import { apiFetch } from "@/lib/apiFetch";
import ProductFilters from "../productFilter";
import ProductSpecificationSection from "../ProductSpecificationSection";
import ProductFaqSection from "../ProductFaqSection";
import { normalizeSize } from "@/lib/size";

type ImageItem = {
  key: string;
  preview: string;
};

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
    type?: string
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

export default function AddProductForm() {
  const router = useRouter();
  const { upload } = useFileUpload();
  const bannerRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [productType, setProductType] = useState<any[]>([]);
  const [flowType, setFlowType] = useState<any[]>([]);
  const [cramps, setCramps] = useState<any[]>([]);
  const [sensitive, setSensitive] = useState<any[]>([]);

  const [finishOptions, setFinishOptions] = useState<string[]>([]);
  const [sizeOptions, setSizeOptions] = useState<string[]>([]);
  const [materialOptions, setMaterialOptions] = useState<string[]>([]);

  const [newFinish, setNewFinish] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newMaterial, setNewMaterial] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [varientBox, setVarientBox] = useState(false);
  const [variantBoxes, setVariantBoxes] = useState<any[]>([]);
  const [brand, setBrand] = useState<any>();
  const fileRefs = useRef<any>([]);

  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [faqs, setFaqs] = useState<any[]>([
    {
      question: "",
      answer: "",
    },
  ]);

  const [variants, setVariants] = useState<any>({
    isExisting: true,
    name: "",
    sku: "",
    price: 0,
    strikethroughPrice: 0,
    description: "",
    banner: null,
    gallery: [],
    documents: [],
    attributes: {},
    isInStock: true,
    highlights: [],
  });

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const res = await apiFetch("/subscription-plans");

        if (res.status === 200 && res.data?.success) {
          setAvailablePlans(res.data.data);
        } else {
          console.error("❌ Failed to load plans:", res.data);
        }
      } catch (err) {
        console.error("💥 Error loading plans:", err);
      }
    };

    loadPlans();
  }, []);

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

  const toggleSpecAttribute = (key: string, val: string) => {
    const currentAttrValue = variants.attributes[key]?.value || "";
    let selectedArray = currentAttrValue ? currentAttrValue.split(",") : [];

    if (selectedArray.includes(val)) {
      selectedArray = selectedArray.filter((item: string) => item !== val);
    } else {
      selectedArray.push(val);
    }

    const newValue = selectedArray.join(",");

    setVariants((prev: any) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: {
          ...prev.attributes[key],
          value: newValue,
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
    type?: string
  ) => {
    const raw = value.trim();
    if (!raw) return toast.error("Enter a value first");

    // Normalize size values to canonical form (e.g. "18 X 16" → "18x16")
    const cleaned = type === "size" ? normalizeSize(raw) : raw;

    if (
      options.some((item) => item.toLowerCase() === cleaned.toLowerCase())
    ) {
      return toast.error("Value already added");
    }

    setOptions([...options, cleaned]);
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

  const setGalleryForActive = (action: React.SetStateAction<ImageItem[]>) => {
    const currentGallery = variants.gallery;
    const nextGallery =
      typeof action === "function" ? (action as any)(currentGallery) : action;

    setVariants((prev: any) => ({ ...prev, gallery: nextGallery }));
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

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedCategories.length === 0) {
      return toast.error("Select a category");
    }

    const formData = new FormData();

    formData.append("id", variants.id);
    selectedCategories.forEach((catId) => formData.append("category[]", catId));

    const payload = {
      ...variants,
      brand,
      bannerImage: getStoredImageKey(
        variants.banner?.key || variants.banner?.preview
      ),
      media: [
        ...variants.gallery.map((g: any) => ({
          mediaType: "image",
          mediaURL: getStoredImageKey(g.key || g.preview),
        })),
        ...videos.map((v: any) => ({
          mediaType: "video",
          mediaURL: getStoredImageKey(v.key || v.url),
        })),
        ...variants.documents.map((d: any) => ({
          mediaType: "pdf",
          mediaURL: d.url,
        })),
      ],
      highlights: variants.highlights.filter(
        (h: string) => h.trim().length > 0
      ),
      attributes: Object.entries(variants.attributes)
        .map(([attr, val]: [string, any]) => ({
          attribute: attr,
          value: val.value,
        }))
        .filter((a: any) => a.value.trim().length > 0),
      faqs: faqs.filter(
        (f) => f.question.trim().length > 0 && f.answer.trim().length > 0
      ),
      filters: [
        ...(productType || []).map((item: any) => ({
          ...item,
          type: "product_type",
        })),
        ...buildFilterItems(getSelectedValues("finish"), "finish"),
        ...buildFilterItems(getSelectedValues("size"), "size"),
        ...buildFilterItems(getSelectedValues("material"), "material"),
        ...(flowType || []).map((item: any) => ({
          ...item,
          type: "flow_or_usage_type",
        })),
        ...(cramps || []).map((item: any) => ({
          ...item,
          type: "cramps_or_discomfort",
        })),
        ...(sensitive || []).map((item: any) => ({
          ...item,
          type: "allergies_or_sensitivities",
        })),
      ],
      VarientBoxes: varientBox
        ? variantBoxes.map((item: any) => ({
          ...item,
          image: getStoredImageKey(item.key || item.image),
        }))
        : [],
      hasVarientBox: varientBox,
    };

    formData.append("variants", JSON.stringify(payload));

    try {

      await createProduct(formData);
      toast.success("Product created!");
      router.push("/admin/product");
    } catch (err) {
      toast.error("Failed to create product");
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
      toast.success("Variant image uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload variant image");
    }
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

  return (
    <div className="max-w-7xl mx-auto p-4 pb-10">
      <form onSubmit={handleCreateProduct} className="space-y-6">
        <div className="flex justify-between items-center z-10 py-4 border-b mb-6">
          <h1 className="text-2xl font-bold">Add New Product</h1>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/product")}
            >
              Cancel
            </Button>

            <Button type="submit">Create Product</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                <CardTitle>Variant Details</CardTitle>
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

                <div className="grid md:grid-cols-3 gap-4">
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
                    <video
                      key={index}
                      src={video.url}
                      controls
                      className="w-full max-w-md rounded-lg border"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            {/* Colour Variants Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">Colour Variants</span>

                  <Switch
                    checked={varientBox}
                    onCheckedChange={(val) => setVarientBox(val)}
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
                          placeholder="Description (optional)"
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
              handleValueChange={(k, v) => {
                const current = variants.attributes;

                setVariants({
                  ...variants,
                  attributes: {
                    ...current,
                    [k]: { ...current[k], value: v },
                  },
                });
              }}
              documents={variants.documents}
              handlePdfUpload={handlePdfUpload}
              setPdfDocuments={(docs: any) => {
                setVariants((prev: any) => ({
                  ...prev,
                  documents: docs,
                }));
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
          </div>
        </div>
      </form>
    </div>
  );
}
