import crypto from "node:crypto";

import { NextResponse } from "next/server";

import { logEvent } from "@/lib/logger";
import { createSupabaseAdmin } from "@/lib/supabase";

const BUCKET = "property-docs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "site-plans");

  if (!(file instanceof File)) {
    return new NextResponse("File is required", { status: 400 });
  }

  const supabase = createSupabaseAdmin();
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const fileName = `${folder}/${crypto.randomUUID()}.${extension}`;

  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    logEvent("error", "storage_upload_failed", { message: error.message, fileName });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  logEvent("info", "storage_upload_success", { fileName, folder });

  const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return NextResponse.json({
    path: fileName,
    publicUrl: publicData.publicUrl,
  });
}
