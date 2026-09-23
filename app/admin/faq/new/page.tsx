import FaqForm from "@/components/admin/FaqForm";

export default function NewFaqPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <FaqForm mode="create" />
    </div>
  );
}
