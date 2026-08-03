import CategoryBanner from "@/components/category/CategoryBanner";
import CategorySection from "@/components/category/CategorySection";
import { getCategories } from "@/helper";
import React, { Suspense } from "react";
import SimpleCategoryBanner from "@/components/category/SimpleCategoryBanner";
import ScrollingRibbon from "@/components/category/ScrollingRibbon";
import { kitchenBathroomRestrictCategories } from "@/const/globalconst";
import { Metadata } from "next";
import { imageKitUrl } from "@/lib/imagekit-url";
import { kitchenLandingSchema } from "@/const/schemas";

export const metadata: Metadata = {
  title: `Premium Kitchen Accessories | Faucets, Sinks & More - Morzze`,
  description:
    "Explore top-quality kitchen accessories at Morzze—faucets, sinks, disposers & air taps. Stylish, functional picks to elevate your kitchen effortlessly.",
  alternates: {
    canonical: "/kitchen",
  },
};

const page = async () => {
  const categories = await getCategories("kitchen");
  const filteredCat = categories.filter(
    (cat) => !kitchenBathroomRestrictCategories.has(cat.slug),
  );
  return (
    <div>
      {kitchenLandingSchema.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryBanner
          imageSrc={imageKitUrl("kitchen.webp")}
          title="Our Kitchen Categories"
          description="Explore our diverse range of high-quality kitchen products."
        />
        <CategorySection categories={filteredCat} />
      </Suspense>
      <SimpleCategoryBanner imageUrl="faucet_banner_horizontal.jpg" />
      <ScrollingRibbon />
    </div>
  );
};

export default page;
