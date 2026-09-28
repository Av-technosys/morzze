"use client";

import { useMemo, useState } from "react";
import Link from "@/hooks/appLink"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { createStore, updateStore } from "@/helper/stores/action";

export type StoreInitialData = {
  id: string;
  storeName: string;
  slug: string;
  storeType: string;
  state: string;
  city: string;
  latitude: string;
  longitude: string;
  address: string;
  contactNumber: string;
  email: string;
  workingHours: string;
  features: string[] | null;
  badgeBgColor: string | null;
  badgeTextColor: string | null;
  mapEmbedUrl: string | null;
  isFeatured: boolean | null;
  isActive: boolean | null;
  landline?: string | null;
  contactPerson?: string | null;
};

type Props = {
  mode: "create" | "edit";
  initialData?: StoreInitialData;
};

function slugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const STORE_TYPES = [
  "Authorized Dealer",
  "Flagship",
  "Studio",
  "Dealer",
  "Experience Center",
];

export default function StoreForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const defaults = useMemo(
    () => ({
      storeName: "",
      slug: "",
      storeType: "Authorized Dealer",
      state: "",
      city: "",
      latitude: "",
      longitude: "",
      address: "",
      contactNumber: "",
      email: "",
      workingHours: "10:00 AM - 9:00 PM",
      features: "",
      badgeBgColor: "#f4e8c7",
      badgeTextColor: "#9b5d00",
      mapEmbedUrl: "",
      isFeatured: false,
      isActive: true,
      landline: "",
      contactPerson: "",
    }),
    []
  );

  const [form, setForm] = useState(() =>
    initialData
      ? {
        storeName: initialData.storeName,
        slug: initialData.slug,
        storeType: initialData.storeType,
        state: initialData.state,
        city: initialData.city,
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        address: initialData.address,
        contactNumber: initialData.contactNumber,
        email: initialData.email,
        workingHours: initialData.workingHours,
        features: initialData.features?.join(", ") ?? "",
        badgeBgColor: initialData.badgeBgColor ?? "#f4e8c7",
        badgeTextColor: initialData.badgeTextColor ?? "#9b5d00",
        mapEmbedUrl: initialData.mapEmbedUrl ?? "",
        isFeatured: Boolean(initialData.isFeatured),
        isActive: initialData.isActive !== false,
        landline: initialData.landline ?? "",
        contactPerson: initialData.contactPerson ?? "",
      }
      : { ...defaults }
  );

  const onNameBlur = () => {
    if (mode !== "create") return;
    if (!form.slug.trim() && form.storeName.trim()) {
      setForm((prev) => ({ ...prev, slug: slugFromName(prev.storeName) }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.storeName.trim() ||
      !form.storeType.trim() ||
      !form.state.trim() ||
      !form.city.trim() ||
      !form.latitude.trim() ||
      !form.longitude.trim() ||
      !form.address.trim() ||
      !form.contactNumber.trim() ||
      !form.email.trim() ||
      !form.workingHours.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("storeName", form.storeName);
    fd.append("slug", form.slug || slugFromName(form.storeName));
    fd.append("storeType", form.storeType);
    fd.append("state", form.state);
    fd.append("city", form.city);
    fd.append("latitude", form.latitude);
    fd.append("longitude", form.longitude);
    fd.append("address", form.address);
    fd.append("contactNumber", form.contactNumber);
    fd.append("email", form.email);
    fd.append("workingHours", form.workingHours);
    fd.append("features", form.features);
    fd.append("badgeBgColor", form.badgeBgColor);
    fd.append("badgeTextColor", form.badgeTextColor);
    fd.append("mapEmbedUrl", form.mapEmbedUrl);
    fd.append("landline", form.landline ?? "");
    fd.append("contactPerson", form.contactPerson ?? "");
    if (form.isFeatured) fd.append("isFeatured", "on");
    if (form.isActive) fd.append("isActive", "on");

    const res =
      mode === "create"
        ? await createStore(fd)
        : await updateStore(initialData!.id, fd);

    setLoading(false);

    if (res.success) {
      toast.success(
        res.message ??
        (mode === "create"
          ? "Store added successfully"
          : "Store updated successfully")
      );
      router.push("/admin/stores");
      router.refresh();
    } else {
      toast.error(
        res.message ??
        (mode === "create"
          ? "Could not add store"
          : "Could not update store")
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2D5A5D]">
          {mode === "create" ? "Add Store" : "Edit Store"}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/admin/stores">Back to list</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-lg text-[#2D5A5D]">
            Store Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Store Name & Slug */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="storeName">Store Name *</Label>
                <Input
                  id="storeName"
                  value={form.storeName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, storeName: e.target.value }))
                  }
                  onBlur={onNameBlur}
                  placeholder="Morzze Flagship Store"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, slug: e.target.value }))
                  }
                  placeholder="morzze-flagship-store"
                  required
                />
              </div>
            </div>

            {/* Store Type */}
            <div className="grid gap-2">
              <Label htmlFor="storeType">Store Type *</Label>
              <select
                id="storeType"
                value={form.storeType}
                onChange={(e) =>
                  setForm((p) => ({ ...p, storeType: e.target.value }))
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                {STORE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* State & City */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, state: e.target.value }))
                  }
                  placeholder="Rajasthan"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, city: e.target.value }))
                  }
                  placeholder="Jaipur"
                  required
                />
              </div>
            </div>

            {/* Latitude & Longitude */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude *</Label>
                <Input
                  id="latitude"
                  value={form.latitude}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, latitude: e.target.value }))
                  }
                  placeholder="26.9124000"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude *</Label>
                <Input
                  id="longitude"
                  value={form.longitude}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, longitude: e.target.value }))
                  }
                  placeholder="75.7873000"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="grid gap-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                placeholder="Full store address"
                required
              />
            </div>

            {/* Contact, Landline, Email & Contact Person */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  value={form.contactNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contactNumber: e.target.value }))
                  }
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="landline">Landline <span className="font-normal text-[10px] text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="landline"
                  value={form.landline ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, landline: e.target.value }))
                  }
                  placeholder="0141-1234567"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="store@morzze.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactPerson">Contact Person <span className="font-normal text-[10px] text-muted-foreground">(Optional)</span></Label>
                <Input
                  id="contactPerson"
                  value={form.contactPerson ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contactPerson: e.target.value }))
                  }
                  placeholder="Rahul Sharma"
                />
              </div>
            </div>

            {/* Working Hours */}
            <div className="grid gap-2">
              <Label htmlFor="workingHours">Working Hours *</Label>
              <Input
                id="workingHours"
                value={form.workingHours}
                onChange={(e) =>
                  setForm((p) => ({ ...p, workingHours: e.target.value }))
                }
                placeholder="10:00 AM - 9:00 PM"
                required
              />
            </div>

            {/* Features */}
            {/* <div className="grid gap-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                value={form.features}
                onChange={(e) =>
                  setForm((p) => ({ ...p, features: e.target.value }))
                }
                placeholder="Parking, Premium Collection, Custom Orders"
              />
            </div> */}

            {/* Badge Colors */}
            {/* <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="badgeBgColor">Badge Background Color</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.badgeBgColor}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, badgeBgColor: e.target.value }))
                    }
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    id="badgeBgColor"
                    value={form.badgeBgColor}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, badgeBgColor: e.target.value }))
                    }
                    placeholder="#f4e8c7"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="badgeTextColor">Badge Text Color</Label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={form.badgeTextColor}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        badgeTextColor: e.target.value,
                      }))
                    }
                    className="w-10 h-10 rounded border cursor-pointer"
                  />
                  <Input
                    id="badgeTextColor"
                    value={form.badgeTextColor}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        badgeTextColor: e.target.value,
                      }))
                    }
                    placeholder="#9b5d00"
                  />
                </div>
              </div>
            </div> */}

            {/* Badge Preview */}
            {/* <div className="grid gap-2">
              <Label>Badge Preview</Label>
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: form.badgeBgColor,
                    color: form.badgeTextColor,
                  }}
                >
                  {form.storeType || "Store Type"}
                </span>
              </div>
            </div> */}

            {/* Map Embed URL */}
            <div className="grid gap-2">
              <Label htmlFor="mapEmbedUrl">Map Embed URL (optional)</Label>
              <Input
                id="mapEmbedUrl"
                value={form.mapEmbedUrl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, mapEmbedUrl: e.target.value }))
                }
                placeholder="https://www.google.com/maps/embed?..."
              />
            </div>

            {/* Checkboxes */}
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
              
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : mode === "create" ? (
                "Create Store"
              ) : (
                "Update Store"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
