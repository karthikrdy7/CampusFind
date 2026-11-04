const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

export const uploadImage = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `${API_URL}/api/items/upload`,
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

  return `${API_URL}/api/items/image/${imageId}`;
};