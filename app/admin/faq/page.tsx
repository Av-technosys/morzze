import React from "react";
import { Button } from "@/components/ui/button";
import Link from "@/hooks/appLink";
import { HelpCircle, Pencil, PlusCircle } from "lucide-react";
import { getFaqs } from "@/helper/faq/action";
import { FaqDeleteButton } from "@/components/admin/FaqDeleteButton";

export default async function AdminFaqPage() {
  const allFaqs = await getFaqs();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#2D5A5D]" /> Manage FAQs
        </h1>
        <Link href="/admin/faq/new">
          <Button >
            <PlusCircle className="w-4 h-4 mr-2" /> Add FAQ
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {allFaqs.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl text-gray-400">
            No FAQs found. Add your first FAQ!
          </div>
        ) : (
          allFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-start hover:shadow-md transition"
            >
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="px-2 py-[2px] rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                    {faq.category}
                  </span>
                </div>
                <h3 className="font-semibold text-base">{faq.question}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {faq.answer}
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link href={`/admin/faq/edit/${faq.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-amber-200 hover:bg-amber-50 text-amber-600"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                </Link>

                <FaqDeleteButton id={faq.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
