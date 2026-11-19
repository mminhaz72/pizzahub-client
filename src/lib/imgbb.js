export async function uploadToImgBB(file) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey || apiKey === "your_imgbb_api_key_here") {
    throw new Error("ImgBB API Key is missing in .env.local");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error?.message || "Image upload failed");
  }
  return data.data.display_url;
}