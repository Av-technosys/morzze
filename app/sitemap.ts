import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { category, product, blog } from "@/db/schema";
import { eq, or, isNull } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.morzze.com";

  const categories = await db
    .select({
      slug: category.slug,
      updatedAt: category.updatedAt,
      type: category.type,
    })
    .from(category);

  const products = await db
    .select({
      slug: product.slug,
      updatedAt: product.updatedAt,
    })
    .from(product)
    .where(or(eq(product.isHidden, false), isNull(product.isHidden)));

  const blogs = await db
    .select({
      slug: blog.slug,
      date: blog.date,
    })
    .from(blog)
    .where(eq(blog.isVisible, true));

  const excludedCategoryUrls = new Set([
    "kitchen/Aura",
    "bathroom/Liquid-Soap-Dispenser",
    "kitchen/Hand-Shower",
    "kitchen/signature-pieces",
    "kitchen/Sink-Strainer-Cover",
    "kitchen/Sink-Drainer-Adapter",
    "kitchen/Sink-Strainer"
  ]);

  const excludedProducts = new Set([
    "Kitchen-Accessories-MDA-901",
    "BATHROOM-FAUCETS--MBF-501-11111",
    "BATHROOM-FAUCETS--MBF-501T-11111",
    "BATHROOM-FAUCETS--MBF-503-11111",
    "BATHROOM-FAUCET-MBF-505-11111",
    "BATHROOM-FAUCETS-MBF-506-11111",
    "BATHROOM-FAUCETS-MBF-507-11111",
    "BATHROOM-FAUCETS-MBF-508-11111",
    "BATHROOM-FAUCETS-MBF-509-11111",
    "Wash-Basin-MBB-403",
  ]);

  const sitemapUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/catalogue`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stores`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dealer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/return-exchange`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/service-request`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/warranty`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/career`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/media`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/promo-code`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kitchen`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bathroom`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

  ];

  categories.forEach((cat) => {
    if (!cat.slug) return;

    let route : string | undefined;

    if (cat.type === "kitchen") route = "kitchen";
    else if (cat.type === "bathroom") route = "bathroom";

    if(!route) return;

    const path = `${route}/${cat.slug}`;

    if (excludedCategoryUrls.has(path)) return;

    sitemapUrls.push({
      url: `${baseUrl}/${path}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  products.forEach((prod) => {
    if (!prod.slug) return;

    if (excludedProducts.has(prod.slug)) return;

    sitemapUrls.push({
      url: `${baseUrl}/product/${prod.slug}`,
      lastModified: prod.updatedAt ? new Date(prod.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  });

  blogs.forEach((b) => {
    if (!b.slug) return;

    sitemapUrls.push({
      url: `${baseUrl}/article/${b.slug}`,
      lastModified: b.date ? new Date(b.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  });

  return sitemapUrls;
}