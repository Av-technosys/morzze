import { Metadata } from "next";
import ProductClient from "./productClient";
import { notFound } from "next/navigation";
import { getFullProductDetails } from "@/helper/product/action";
import { getProductReviews } from "@/helper/review/action";
import { db } from "@/db";
import { product } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateMetadata(
  { params }: { params: Promise<{ productslug: string }> },
): Promise<Metadata> {
  const { productslug } = await params;

  try {
    const [productRes] = await db
      .select({
        title: product.metaTitle,
        description: product.metaDescription,
        image: product.bannerImage,
      })
      .from(product)
      .where(eq(product.slug, productslug));

    if (!productRes) {
      return {
        title: "Product Not Found | Morzze",
        description: "The requested product could not be found.",
      };
    }

    const images: string = productRes.image!;

    return {
      title: productRes.title,
      description: productRes.description,
      alternates: {
        canonical: `/product/${productslug}`,
      },
      openGraph: {
        images,
      },
    };
  } catch {
    return {
      title: "Product Not Found | Morzze",
      description: "The requested product could not be found.",
    };
  }
}

const page = async ({
  params,
}: {
  params: Promise<{ productslug: string }>;
}) => {
  const { productslug } = await params;

  try {
    const product = await getFullProductDetails(productslug);
    const reviews = await getProductReviews(productslug);

    if (!product || Object.keys(product).length === 0) {
      return notFound();
    }

    return (
      <ProductClient product={product} slug={productslug} reviews={reviews} />
    );
  } catch {
    return notFound();
  }
};

export default page;
