"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createFaq, updateFaq } from "@/helper/faq/action";

// All category slugs available for FAQ assignment
const CATEGORY_OPTIONS = [
  { label: "Air Tap", value: "air-tap" },
  { label: "Granite Sinks", value: "Granite-Sinks" },
  { label: "Steel Sinks", value: "Steel-Sinks" },
  { label: "Kitchen Faucets", value: "Kitchen-Faucets" },
  { label: "Bathroom Faucets", value: "Bathroom-Faucets" },
  { label: "Bathroom Basins", value: "Bathroom-Basins" },
  { label: "Towel Warmers", value: "Towel-Warmers" },
  { label: "Food Waste Disposers", value: "Food-Waste-Disposers" },
  { label: "Floor Drainers", value: "Floor-Drainers" },
];

interface FaqFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    question: string;
    answer: string;
    category: string;
  };
}

export default function FaqForm({ mode, initialData }: FaqFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    question: initialData?.question ?? "",
    answer: initialData?.answer ?? "",
    category: initialData?.category ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      const res =
        mode === "create"
          ? await createFaq(fd)
          : await updateFaq(initialData!.id, fd);

      if (res.success) {
        toast.success(res.message ?? "Saved successfully");
        router.push("/admin/faq");
        router.refresh();
      } else {
        toast.error(res.message ?? "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {mode === "create" ? "Add New FAQ" : "Edit FAQ"}
        </h1>
        <p className="text-sm text-gray-500">
          {mode === "create"
            ? "Fill in the details below to add a new FAQ."
            : "Update the FAQ details below."}
        </p>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2D5A5D]"
        >
          <option value="" disabled>
            — Select a category —
          </option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Question */}
      <div className="space-y-1">
        <label
          htmlFor="question"
          className="block text-sm font-medium text-gray-700"
        >
          Question <span className="text-red-500">*</span>
        </label>
        <Input
          id="question"
          name="question"
          required
          placeholder="Enter the FAQ question"
          value={formData.question}
          onChange={handleChange}
        />
      </div>

      {/* Answer */}
      <div className="space-y-1">
        <label
          htmlFor="answer"
          className="block text-sm font-medium text-gray-700"
        >
          Answer <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="answer"
          name="answer"
          required
          rows={6}
          placeholder="Enter the FAQ answer"
          value={formData.answer}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#2D5A5D] hover:bg-[#234749]"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {mode === "create" ? "Add FAQ" : "Save Changes"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/faq")}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
