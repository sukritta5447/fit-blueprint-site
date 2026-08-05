import { supabase } from "@/lib/supabase";
import { apiClient } from "@/services/apiClient";

export async function uploadImage(file, type) {
  const signedUrlResponse = await apiClient.post("/uploads/signed-url", {
    contentType: file.type,
    fileName: file.name,
    type,
  });
  const { bucket, path, publicUrl, token } = signedUrlResponse.data;
  const { error } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(path, token, file, {
      contentType: file.type,
    });

  if (error) throw error;

  return publicUrl;
}
