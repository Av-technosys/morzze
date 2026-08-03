import Image from "next/image";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/helper/category/action";
import {
  getProducts,
  getSteelSinkCategorySlugs,
} from "@/helper/product/action";
import Link from "@/hooks/appLink";
import FilterSidebar from "@/components/product/FilterSidebar";
import { getImageURL } from "@/lib/getImageLin";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Metadata } from "next";
import { db } from "@/db";
import { category } from "@/db/schema";
import { eq } from "drizzle-orm";
import CategoryProductsClient from "@/components/commom/CategoryProductsClient";

export const dynamic = "force-static";
export const revalidate = 86400;

const CATEGORY_META: Record<string, Pick<Metadata, "title" | "description">> = {
  "kitchen-faucets": {
    title: "Premium Kitchen Faucets Stylish & Durable | Morzze",
    description: "Premium Kitchen Faucets Stylish & Durable | Morzze",
  },
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const fallbackMeta = CATEGORY_META[slug];

  try {
    const [productRes] = await db
      .select({
        title: category.metaTitle,
        description: category.metaDescription,
        name: category.name,
        image: category.bannerImage,
      })
      .from(category)
      .where(eq(category.slug, slug));

    if (!productRes) {
      return {
        title: fallbackMeta?.title || "Category Not Found | Morzze",
        description: "The requested category could not be found.",
      };
    }

    const images: string = productRes.image!;

    return {
      title: productRes.title || fallbackMeta?.title || `${productRes.name} | Morzze`,
      description:
        productRes.description ||
        fallbackMeta?.description ||
        `Browse ${productRes.name} products at Morzze.`,
      alternates: {
        canonical: `/kitchen/${slug}`,
      },
      openGraph: {
        images,
      },
    };
  } catch {
    return {
      title: "Category Not Found | Morzze",
      description: "The requested category could not be found.",
    };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const sParams = await searchParams;

  const [categoryData, steelSinkCategorySlugs, productsResult] =
    await Promise.all([
      getCategoryBySlug(slug),
      getSteelSinkCategorySlugs(),
      getProducts({
        category: slug,
        size: sParams.size as string | string[],
        material: sParams.material as string | string[],
        finish: sParams.finish as string | string[],
        min: sParams.min as string,
        max: sParams.max as string,
        page: 1,
        pageSize: 100,
      }),
    ]);

  const products = productsResult?.products || [];

  if (!categoryData) {
    notFound();
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[340px] md:h-[420px] overflow-hidden">
        {categoryData.horizontalBannerImage ? (
          <Image
            src={getImageURL(categoryData.horizontalBannerImage)}
            alt={categoryData.name ?? "Category"}
            width={1600}
            height={700}
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-10 left-6 md:left-14 right-6 z-10">
          <nav className="flex items-center gap-2 text-[10px] md:text-xs text-white/50 mb-4 uppercase tracking-widest font-montserrat">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>&gt;</span>
            <Link
              href="/kitchen"
              className="hover:text-white transition-colors"
            >
              Kitchen
            </Link>
            <span>&gt;</span>
            <span className="text-[#FFBF3F]">{categoryData.name}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#EDEBE9] font-montserrat">
            {categoryData.name}
          </h1>

          {categoryData.description && (
            <p className="text-white/50 text-sm md:text-base mt-3 max-w-2xl font-inter">
              {categoryData.description}
            </p>
          )}

          <p className="text-[#FFBF3F] text-xs md:text-sm mt-4 font-inter tracking-widest uppercase">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-screen-2xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-1/4">
            <FilterSidebar
              categories={[]}
              materialOptions={[]}
              finishOptions={[]}
              steelSinkCategorySlugs={steelSinkCategorySlugs}
              currentCategorySlug={slug}
            />
          </div>
          <div className="lg:w-3/4">
            {/* Mobile Filter Button */}
            <div className="flex lg:hidden items-center justify-between pb-6 border-b border-white/5 mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-2.5 text-[13px] text-[#EDEBE9] font-inter uppercase tracking-[0.15em] font-medium">
                    <IconAdjustmentsHorizontal
                      size={20}
                      className="text-[#FFBF3F]"
                    />
                    Filters
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="bg-[#0A0A0A] border-r border-white/10 w-[300px] text-white p-0 overflow-y-auto custom-scrollbar"
                >
                  <SheetHeader className="p-6 border-b border-white/5 text-left">
                    <SheetTitle className="text-white font-inter text-lg tracking-tight uppercase">
                      Product Filters
                    </SheetTitle>
                  </SheetHeader>
                  <div className="px-6 pb-10">
                    <FilterSidebar
                      categories={[]}
                      materialOptions={[]}
                      finishOptions={[]}
                      steelSinkCategorySlugs={steelSinkCategorySlugs}
                      currentCategorySlug={slug}
                    />
                  </div>
                </SheetContent>
              </Sheet>
              <span className="text-[10px] text-[#555] uppercase tracking-widest font-inter">
                {products.length} Results
              </span>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/40 text-lg font-inter">
                  No products found in this category.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-6 text-[#FFBF3F] text-sm uppercase tracking-widest hover:underline font-inter"
                >
                  Browse to home page
                </Link>
              </div>
            ) : (
              <CategoryProductsClient
                products={products}
                categoryName={categoryData.name ?? ""}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
