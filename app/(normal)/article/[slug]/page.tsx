import BlogDetailPage from "@/components/blogs/blogData";
import { db } from "@/db";
import { blog } from "@/db/schema";
import { getBlogBySlug } from "@/helper/blog/action";
import { ne } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const currentBlog = await getBlogBySlug(slug);

  if (!currentBlog) {
    return {
      title: "Article Not Found | Morzze",
      description: "The requested article could not be found.",
    };
  }

  const images = currentBlog.image ? [currentBlog.image] : [];

  return {
    title: currentBlog.metaTitle || currentBlog.title || "Article | Morzze",
    description:
      currentBlog.metaDescription ||
      `Read about ${currentBlog.title} on Morzze.`,
    alternates: {
      canonical: `/article/${slug}`,
    },
    openGraph: {
      images,
    },
  };
}
const page = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const currentBlog = await getBlogBySlug(slug);

  if (!currentBlog) {
    notFound();
  }

  const allBlogs = await db.select().from(blog).where(ne(blog.slug, slug)).limit(3);

  return (
    <div>
      <BlogDetailPage
        blog={currentBlog}
        relatedBlogs={allBlogs}
      />

    </div>
  );
};

export default page;
