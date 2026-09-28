"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, TicketPercent, Upload } from "lucide-react";
import { createCoupon } from "@/helper/coupons/action";
import { useFileUpload } from "@/helper";
import { toast } from "sonner";

export default function CouponForm() {
  const { upload, uploading } = useFileUpload();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    couponCode: "",
    discountValue: "",
    upto: "₹",
    minimumOrder: "₹",
    validUntil: "",
    termsPdf: "",
    isActive: true,
  });

  const handleDiscountChange = (value: string) => {
    const numberOnly = value.replace(/[^0-9]/g, "");

    setFormData({
      ...formData,
      discountValue: numberOnly ? `${numberOnly}` : "",
    });
  };

  const handleUptoChange = (value: string) => {
    const numberOnly = value.replace(/[^0-9,]/g, "");

    setFormData({
      ...formData,
      upto: numberOnly ? `₹${numberOnly}` : "₹",
    });
  };

  const handleMinimumOrderChange = (value: string) => {
    const numberOnly = value.replace(/[^0-9,]/g, "");

    setFormData({
      ...formData,
      minimumOrder: numberOnly ? `₹${numberOnly}` : "₹",
    });
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Uploading PDF...", {
        id: "terms-pdf-upload",
      });

      const { fileUrl } = await upload(file, "coupons");

      setFormData((prev) => ({
        ...prev,
        [field]: fileUrl,
      }));

      toast.success("PDF uploaded successfully!", {
        id: "terms-pdf-upload",
      });
    } catch (error) {
      console.error("Upload failed", error);

      toast.error("PDF upload failed", {
        id: "terms-pdf-upload",
      });
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    data.append("category", formData.category);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("couponCode", formData.couponCode);
    data.append("discountValue", formData.discountValue);
    data.append("upto", formData.upto === "₹" ? "" : formData.upto);
    data.append("minimumOrder", formData.minimumOrder);
    data.append("validUntil", formData.validUntil);
    data.append("termsPdf", formData.termsPdf);
    data.append("isActive", formData.isActive ? "on" : "off");

    const res = await createCoupon(data);

    if (res.success) {
      toast.success("Coupon added successfully!");

      setTimeout(() => {
        window.location.href = "/admin/coupons";
      }, 700);
    } else {
      toast.error(res.message || "Coupon could not be added.");
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border-none my-10">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="text-[#2D5A5D] flex items-center gap-2">
          <TicketPercent className="w-5 h-5" />
          Add New Coupon
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-medium">Coupon Title</Label>
              <Input
                placeholder="New Customer Special"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Coupon Category</Label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select category</option>
                <option value="New Customer">New Customer</option>
                <option value="Category">Category</option>
                <option value="Shipping">Shipping</option>
                <option value="Seasonal">Seasonal</option>
                <option value="Trade">Trade</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-medium">Coupon Code</Label>
              <Input
                placeholder="WELCOME25"
                value={formData.couponCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    couponCode: e.target.value.toUpperCase(),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Discount Value % (in numbers)</Label>
              <Input
                placeholder="25"
                value={formData.discountValue}
                onChange={(e) => handleDiscountChange(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-medium">Maximum Discount Upto</Label>
              <Input
                placeholder="₹1,000"
                value={formData.upto}
                onChange={(e) => handleUptoChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Minimum Order</Label>
              <Input
                placeholder="₹15,000"
                value={formData.minimumOrder}
                onChange={(e) => handleMinimumOrderChange(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Valid Until</Label>
            <Input
              type="date"
              value={formData.validUntil}
              onChange={(e) =>
                setFormData({ ...formData, validUntil: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Coupon Description</Label>
            <Textarea
              placeholder="Write coupon description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium">Terms & Conditions PDF</Label>
            <div className="relative border-2 border-dashed rounded-xl p-8 text-center hover:bg-slate-50 transition-all border-slate-200">
              <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => handleFileUpload(e, "termsPdf")}
              />

              <Upload className="mx-auto h-10 w-10 text-slate-300" />

              <p className="text-sm text-slate-500 mt-2">
                {uploading
                  ? "Uploading..."
                  : formData.termsPdf
                  ? "PDF Uploaded ✅"
                  : "Click or drag to upload terms PDF"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4"
            />

            <Label className="font-medium">Show this coupon on website</Label>
          </div>

          <Button
            type="submit"
            className="w-full  h-14 text-lg font-medium shadow-lg"
            disabled={loading || uploading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Add Coupon"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}