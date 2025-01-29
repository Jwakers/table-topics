"use server";

import { currentUser } from "@clerk/nextjs/server";
import { cloudflareClient } from ".";

export async function getVideoUploadUrl({ title }: { title: string }) {
  const user = await currentUser();

  if (!process.env.CLOUDFLARE_API_TOKEN)
    throw new Error("Missing Cloudflare API token");
  if (!process.env.CLOUDFLARE_ACCOUNT_ID)
    throw new Error("Missing Cloudflare account ID");
  if (!user?.id) throw new Error("Unauthorized");

  if (!title?.trim()) {
    throw new Error("Title is required");
  }

  try {
    const directUpload = await cloudflareClient.stream.directUpload.create({
      account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
      maxDurationSeconds: 120,
      allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
      meta: {
        userId: user?.id,
        title: title.trim(),
        created: new Date().toLocaleDateString(),
      },
    });
    return directUpload;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create upload URL");
  }
}

export async function getVideoById(id: string) {
  const video = await cloudflareClient.stream.get(id, {
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
  });

  return video;
}

export async function deleteVideoById(id: string) {
  const video = await cloudflareClient.stream.delete(id, {
    account_id: process.env.CLOUDFLARE_ACCOUNT_ID!,
  });

  return video;
}
