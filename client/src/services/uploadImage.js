
const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/+$/, "");

export const uploadImage = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${BASE_URL}/api/items/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.imageId;
};

export const getImageUrl = (imageId) => {
  if (!imageId) return "";

  return `${BASE_URL}/api/items/image/${imageId}`;
};
