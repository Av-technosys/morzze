import ProductCatalogueHero from "@/components/catalogue/banner";
import CatalogueGridDownloads from "@/components/catalogue/cataloguegrid";
import CatalogueMissedCallBanner from "@/components/catalogue/CatalogueMissedCallBanner";
import { CatalogueForm } from "@/components/CatalogueForm";
import { getActiveCatalogues } from "@/helper/catalogue/action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Morzze Catalogue | Premium Kitchen & Bathroom Solutions`,
  description: `Explore Morzze's comprehensive catalogue featuring high-quality kitchen and bathroom products, including faucets, Sinks, and other accessories.`,
  alternates: {
    canonical: "/catalogue",
  },
};

const page = async () => {
  const rows = await getActiveCatalogues();
  const items = rows.map((r: any) => ({
    id: r.id,
    title: r.title,
    shortDescription: r.shortDescription,
    image: r.image,
    pdfFile: r.pdfFile,
    totalPages: r.totalPages,
    fileSize: r.fileSize,
    publishYear: r.publishYear,
    category: r.category,
    isFeatured: Boolean(r.isFeatured),
  }));

  return (
    <div>
      <ProductCatalogueHero />
      <CatalogueGridDownloads items={items} />
      {/* <CatalogueInfoRequestSection /> */}
      <div className=" bg-black w-full py-12">
        <CatalogueForm />
      </div>
      <CatalogueMissedCallBanner />
    </div>
  );
};

export default page;
