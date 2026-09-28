import { notFound } from "next/navigation";
import { getFaqById } from "@/helper/faq/action";
import FaqForm from "@/components/admin/FaqForm";
import { getCategories } from "@/helper/category/action";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [faq, categories] = await Promise.all([
    getFaqById(id),
    getCategories(),
  ]);

  if (!faq) {
    notFound();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <FaqForm mode="edit" initialData={faq} categories={categories} />
    </div>
  );
}

