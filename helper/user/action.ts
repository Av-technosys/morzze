/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { db } from "@/db";
import { address, subscriptionPayment, users } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { emailRegex } from "@/const/globalconst";
import { auth } from "@/auth";

type NewAddressInput = {
  fullName: string;
  phone: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
};

export async function requireUserWithRefresh() {
  const user = await getCurrentUser();

  if (user?.userId) {
    return user;
  }

  throw new Error("UNAUTHORIZED");
}
export async function getCurrentUser() {

  try {
    const session = await auth();
    const userId = session?.user?.id;
    const email = session?.user?.email ?? undefined;

    if (userId) {
      return { userId, email };
    }

    if (!email) return null;

    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user?.id) return null;

    return {
      userId: user.id,
      email: user.email ?? email,
    };
  } catch (error) {
    const message = (error as Error)?.message;
    if (message !== "UNAUTHORIZED") {
      console.error(error)
    }
    return null;
  }
}

export async function getProfile() {
  const { userId }: any = await requireUserWithRefresh();

  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!result.length) throw new Error("User not found");

  const user = result[0];

  return {
    userId: user.id,
    fullName: user.name,
    email: user.email,
    phone: user.phone,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
  };
}

export async function updateProfile(data: {
  fullName: string;
  phone: string;
}) {
  const { userId }: any = await requireUserWithRefresh();

  if (!userId) throw new Error("Unauthorized");

  const updated = await db
    .update(users)
    .set({
      name: data.fullName,
      phone: data.phone,
    })
    .where(eq(users.id, userId))
    .returning();

  if (!updated.length) throw new Error("User not found");

  const user = updated[0];

  return {
    fullName: user.name,
    email: user.email,
    phone: user.phone,
  };
}


async function getDbUserId(): Promise<string> {
  const { userId }: any = await requireUserWithRefresh();
  if (!userId) throw new Error("UNAUTHORIZED");
  return userId;
}

export async function getUsersCount() {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    return Number(result[0]?.count ?? 0);
  } catch (error) {
    console.error("getUsersCount failed:", error);
    return 0;
  }
}

export async function getAddresses() {
  const userId = await getDbUserId();

  return await db
    .select()
    .from(address)
    .where(eq(address.userId, userId));
}

export async function getUserAddressById(addressId: number) {
  const userId = await getDbUserId();

  const data = await db
    .select()
    .from(address)
    .where(
      and(
        eq(address.id, addressId),
        eq(address.userId, userId)
      )
    );

  return data[0] || null;
}

export async function updateUserAddress(data: any) {
  const userId = await getDbUserId();

  if (data.isDefault) {
    await db
      .update(address)
      .set({ isDefault: false })
      .where(eq(address.userId, userId));
  }

  await db
    .update(address)
    .set({
      fullName: data.fullName,
      phone: data.phone,
      street: data.street,
      locality: data.locality,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,
      isDefault: data.isDefault,
    })
    .where(
      and(
        eq(address.id, Number(data.id)),
        eq(address.userId, userId)
      )
    );

  return { success: true };
}

export async function deleteUserAddress(id: number) {
  const userId = await getDbUserId();

  await db
    .delete(address)
    .where(
      and(
        eq(address.id, id),
        eq(address.userId, userId)
      )
    );

  return { success: true };
}

export async function setDefaultAddress(id: number) {
  const userId = await getDbUserId();

  await db
    .update(address)
    .set({ isDefault: false })
    .where(eq(address.userId, userId));

  await db
    .update(address)
    .set({ isDefault: true })
    .where(
      and(
        eq(address.id, id),
        eq(address.userId, userId)
      )
    );

  return { success: true };
}

export async function createUserAddress(data: NewAddressInput) {
  const userId = await getDbUserId();

  try {
    if (data.isDefault) {
      await db
        .update(address)
        .set({ isDefault: false })
        .where(eq(address.userId, userId));
    }

    const [newAddress] = await db
      .insert(address)
      .values({
        ...data,
        userId,
        isDefault: data.isDefault ?? false,
      })
      .returning();

    return { success: true, data: newAddress };
  } catch (error) {
    return { success: false, error };
  }
}

export async function subscribeEmail(email: string) {

  if (!email) {
    return { success: false, message: "Email is required" };
  }

  if (!emailRegex.test(email.trim())) {
    return { success: false, message: "Please enter a valid email" };
  }

  await db.insert(subscriptionPayment).values({
    email,
  });

  return { success: true, message: "Subscribed successfully 🎉" };
}
