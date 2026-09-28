import FaqForm from "@/components/admin/FaqForm";
import { getCategories } from "@/helper/category/action";

export default async function NewFaqPage() {
  const categories = await getCategories();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <FaqForm mode="create" categories={categories} />
    </div>
  );
}
