"use server";

import { db } from "@/db";
import { faqs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getFaqs() {
  try {
    const data = await db.select().from(faqs);
    return data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export async function getFaqsByCategory(category: string) {
  try {
    const data = await db
      .select()
      .from(faqs)
      .where(eq(faqs.category, category));
    return data;
  } catch (error) {
    console.error("Error fetching FAQs by category:", error);
    return [];
  }
}

export async function getFaqById(id: string) {
  try {
    const data = await db.select().from(faqs).where(eq(faqs.id, id));
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching FAQ by id:", error);
    return null;
  }
}

export async function createFaq(formData: FormData) {
  try {
    const question = (formData.get("question") as string)?.trim();
    const answer = (formData.get("answer") as string)?.trim();
    const category = (formData.get("category") as string)?.trim();

    if (!question || !answer || !category) {
      return { success: false, message: "All fields are required" };
    }

    await db.insert(faqs).values({ question, answer, category });

    revalidatePath("/admin/faq");

    return { success: true, message: "FAQ added successfully" };
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return { success: false, message: "Failed to create FAQ" };
  }
}

export async function updateFaq(id: string, formData: FormData) {
  try {
    const question = (formData.get("question") as string)?.trim();
    const answer = (formData.get("answer") as string)?.trim();
    const category = (formData.get("category") as string)?.trim();

    if (!question || !answer || !category) {
      return { success: false, message: "All fields are required" };
    }

    await db
      .update(faqs)
      .set({ question, answer, category })
      .where(eq(faqs.id, id));

    revalidatePath("/admin/faq");

    return { success: true, message: "FAQ updated successfully" };
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return { success: false, message: "Failed to update FAQ" };
  }
}

export async function deleteFaq(id: string) {
  try {
    await db.delete(faqs).where(eq(faqs.id, id));

    revalidatePath("/admin/faq");

    return { success: true, message: "FAQ deleted successfully" };
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return { success: false, message: "Failed to delete FAQ" };
  }
}
