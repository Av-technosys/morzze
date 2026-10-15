import CategoryBanner from "@/components/category/CategoryBanner";
import CategorySection from "@/components/category/CategorySection";
import { getCategories } from "@/helper";
import React, { Suspense } from "react";
import SimpleCategoryBanner from "@/components/category/SimpleCategoryBanner";
import ScrollingRibbon from "@/components/category/ScrollingRibbon";
import { kitchenBathroomRestrictCategories } from "@/const/globalconst";
import { Metadata } from "next";
import { bathroomLandingSchema } from "@/const/schemas";

export const metadata: Metadata = {
  title: "Bathroom Basins, Accessories, Towel Warmer & more by Morzze",
  description:
    "Explore premium bathroom accessories by Morzze, including faucets, towel warmer, Floor Drainer, and more. Designed for style, durability, and functionality.",
  alternates: {
    canonical: "/bathroom",
  },
  openGraph: {
    type: "website",
    url: "https://www.morzze.com/bathroom",
    siteName: "Morzze",
    title: "Bathroom Basins, Accessories, Towel Warmer & more by Morzze",
    description:
      "Explore premium bathroom accessories by Morzze, including faucets, towel warmer, Floor Drainer, and more. Designed for style, durability, and functionality.",
    images: [
      {
        url: "https://www.morzze.com/_next/image?url=https%3A%2F%2Fd2icu6klh68l1z.cloudfront.net%2Flogo.png&w=384&q=75",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bathroom Basins, Accessories, Towel Warmer & more by Morzze",
    description:
      "Explore premium bathroom accessories by Morzze, including faucets, towel warmer, Floor Drainer, and more. Designed for style, durability, and functionality.",
    images: [
      "https://www.morzze.com/_next/image?url=https%3A%2F%2Fd2icu6klh68l1z.cloudfront.net%2Flogo.png&w=384&q=75",
    ],
  },
};

const page = async () => {
  const categories = await getCategories("bathroom");
  const filteredCat = categories.filter(
    (cat) => !kitchenBathroomRestrictCategories.has(cat.slug),
  );
  return (
    <div>
      {bathroomLandingSchema.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryBanner
          title="Our Bathroom Categories"
          description="Explore our diverse range of high-quality bathroom products."
        />
        <CategorySection categories={filteredCat} />
      </Suspense>
      <SimpleCategoryBanner />
      <ScrollingRibbon />
    </div>
  );
};

export default page;
