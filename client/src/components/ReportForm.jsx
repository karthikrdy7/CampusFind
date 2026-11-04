
import { useEffect, useState } from "react";
import { createItem } from "../services/api";
import { uploadImage } from "../services/uploadImage";

function ReportForm({ type, onItemCreated }) {
  const initialFormData = {
    itemName: "",
    category: "Electronics",
    description: "",
    location: "",
    date: "",
    color: "",
    contact: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    error: false,
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({
        text: "Please select a JPG, PNG, WEBP or GIF image.",
        error: true,
      });
      e.target.value = "";
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setMessage({
        text: "Image size must be less than 4 MB.",
        error: true,
      });
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setMessage({ text: "", error: false });
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreview("");

    const input = document.getElementById("itemImage");
    if (input) input.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ text: "", error: false });

    try {
      let imageId = "";

      if (selectedImage) {
        setMessage({
          text: "Uploading image...",
          error: false,
        });

        imageId = await uploadImage(selectedImage);
      }

      setMessage({
        text: "Submitting report...",
        error: false,
      });

      const newItem = await createItem({
        ...formData,
        type,
        image: imageId,
      });

      setFormData(initialFormData);
      setSelectedImage(null);
      setPreview("");

      const input = document.getElementById("itemImage");
      if (input) input.value = "";

      setMessage({
        text: "Item reported successfully!",
        error: false,
      });

      if (onItemCreated) {
        onItemCreated(newItem);
      }
    } catch (error) {
      console.error("REPORT SUBMISSION ERROR:", error);

      setMessage({
        text: error.message || "We couldn't submit your report. Please try again.",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <h2>
        Report {type === "Lost" ? "Lost" : "Found"} Item
      </h2>

      <div className="form-group">
        <label htmlFor="itemName">Item Name</label>
        <input
          type="text"
          id="itemName"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          placeholder="Example: AirPods Pro"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option>Electronics</option>
          <option>ID Cards</option>
          <option>Wallet</option>
          <option>Books</option>
          <option>Keys</option>
          <option>Clothing</option>
          <option>Accessories</option>
          <option>Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the item..."
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          name="location"
          id="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Example: Central Library"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">
            {type === "Lost" ? "Date Lost" : "Date Found"}
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="color">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Example: White"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="contact">Contact Information</label>
        <input
          type="text"
          id="contact"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Phone number or email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="itemImage">Item Photo (Optional)</label>
        <input
          type="file"
          id="itemImage"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleImageChange}
          disabled={loading}
        />
        <small>JPG, PNG, WEBP or GIF. Maximum 4 MB.</small>

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Selected item preview" />
            <button
              type="button"
              className="remove-image-btn"
              onClick={removeImage}
              disabled={loading}
            >
              Remove Photo
            </button>
          </div>
        )}
      </div>

      <button
        className="submit-btn"
        type="submit"
        disabled={loading}
      >
        {loading ? "Uploading / Submitting..." : "Submit Report"}
      </button>

      {message.text && (
        <p
          className={`form-message${message.error ? " error" : ""}`}
          role="status"
        >
          {message.text}
        </p>
      )}
    </form>
  );
}

export default ReportForm;
