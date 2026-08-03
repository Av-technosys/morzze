/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { blog } from "@/db/schema"; 
import { db } from "@/lib/db";

import { and, desc, eq, ilike, or, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function revalidateBlogSlugPaths(slug?: string | null) {
  if (!slug) return;

  revalidatePath(`/blog/${slug}`);
  revalidatePath(`/article/${slug}`);
}

export async function getBlogs(search = "") {
  const filters = [];
  if (search && search.trim() !== "") {
    filters.push(
      or(
        ilike(blog.title, `%${search}%`), 
        ilike(blog.metaDescription, `%${search}%`)
      )
    );
  }

  const whereClause = filters.length ? and(...filters) : undefined;

  try {
    return await db
      .select({
        id: blog.id,
        title: blog.title,
        metaDescription: blog.metaDescription,
        blogCategory: blog.blogCategory,
        image: blog.image,
        userImage: blog.userImage,
        userName: blog.userName,
        textArea: blog.textArea,
        date: blog.date,
        slug: blog.slug,
        tags: blog.tags,
        isVisible: blog.isVisible,
      })
      .from(blog)
      .where(whereClause)
      .orderBy(desc(blog.date));
  } catch (error) {
    console.error("Fetch Blogs Error:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const result = await db
      .select()
      .from(blog)
      .where(eq(blog.slug, slug))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Fetch Blog By Slug Error:", error);
    return null;
  }
}

export async function createBlog(blogData: any) {
  try {
    const slugInput = blogData.slug || blogData.title;
    const slug = slugInput
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check if slug is unique
    const existing = await db
      .select({ id: blog.id })
      .from(blog)
      .where(eq(blog.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "slug_exists", message: "This slug is already in use. Please choose a unique slug." };
    }

    await db.insert(blog).values({
      title: blogData.title,
      metaTitle: blogData.metaTitle || blogData.title,
      metaDescription: blogData.metaDescription,
      blogCategory: blogData.blogCategory,
      image: blogData.image,
      userImage: blogData.userImage,
      userName: blogData.userName,
      textArea: blogData.textArea,
      date: blogData.date,
      data: blogData.data, 
      slug: slug,
      tags: Array.isArray(blogData.tags) 
        ? blogData.tags 
        : (blogData.tags ? blogData.tags.split(',').map((t: string) => t.trim()) : []),
      isVisible: true,
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog"); 
    revalidateBlogSlugPaths(slug);
    
    return { success: true };
  } catch (error: any) {
    console.error("Create Blog Error:", error);
    return { success: false, message: error.message };
  }
}

export async function updateBlog(blogId: string, blogData: any) {
  try {
    // Fetch the existing blog to get its current slug
    const currentBlog = await db
      .select({ slug: blog.slug })
      .from(blog)
      .where(eq(blog.id, blogId))
      .limit(1);

    if (currentBlog.length === 0) {
      return { success: false, message: "Blog not found." };
    }

    const existingSlug = currentBlog[0].slug;
    
    const slugInput = blogData.slug || existingSlug;
    const formattedSlug = slugInput
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // If slug is changing, verify it is unique
    if (formattedSlug !== existingSlug) {
      const duplicate = await db
        .select({ id: blog.id })
        .from(blog)
        .where(and(eq(blog.slug, formattedSlug), ne(blog.id, blogId)))
        .limit(1);

      if (duplicate.length > 0) {
        return { success: false, error: "slug_exists", message: "This slug is already in use by another blog. Please choose a unique slug." };
      }
    }

    await db
      .update(blog)
      .set({
        title: blogData.title,
        metaTitle: blogData.metaTitle || blogData.title,
        metaDescription: blogData.metaDescription,
        blogCategory: blogData.blogCategory,
        image: blogData.image,
        userImage: blogData.userImage,
        userName: blogData.userName,
        textArea: blogData.textArea,
        date: blogData.date,
        data: blogData.data,
        slug: formattedSlug,
        tags: Array.isArray(blogData.tags) 
          ? blogData.tags 
          : (blogData.tags ? blogData.tags.split(',').map((t: string) => t.trim()) : []),
      })
      .where(eq(blog.id, blogId));

    revalidatePath("/admin/blog");
    if (existingSlug) {
      revalidateBlogSlugPaths(existingSlug);
    }
    if (formattedSlug !== existingSlug) {
      revalidateBlogSlugPaths(formattedSlug);
    }
    return { success: true };
  } catch (error) {
    console.error("Update Blog Error:", error);
    return { success: false };
  }
}

export async function deleteBlog(id: string) {
  try {
    const [existingBlog] = await db
      .select({ slug: blog.slug })
      .from(blog)
      .where(eq(blog.id, id))
      .limit(1);

    await db.delete(blog).where(eq(blog.id, id));
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidateBlogSlugPaths(existingBlog?.slug);
    return { success: true };
  } catch (error) {
    console.error("Delete Blog Error:", error);
    return { success: false };
  }
}
export async function getBlogById(id: string) {
  try {
    const result = await db
      .select()
      .from(blog)
      .where(eq(blog.id, id))
      .limit(1);
    
    return result[0] || null;
  } catch (error) {
    console.error("Fetch Blog By ID Error:", error);
    return null;
  }
}
