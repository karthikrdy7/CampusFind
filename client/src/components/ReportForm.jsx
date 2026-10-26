import { useState } from "react";
import { createItem } from "../services/api";

function ReportForm({ type, onItemCreated }) {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "Electronics",
    description: "",
    location: "",
    date: "",
    color: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage({ text: "", error: false });

    try {
      const newItem = await createItem({
        ...formData,
        type: type,
      });

      setMessage({ text: "Item reported successfully!", error: false });

      setFormData({
        itemName: "",
        category: "Electronics",
        description: "",
        location: "",
        date: "",
        color: "",
        contact: "",
      });

      if (onItemCreated) {
        onItemCreated(newItem);
      }
    } catch (error) {
      console.error(error);
      setMessage({ text: "We couldn't submit your report. Please try again.", error: true });
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

      <button
        className="submit-btn"
        type="submit"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Report"}
      </button>

      {message && (
        <p className={`form-message${message.error ? " error" : ""}`} role="status">
          {message.text}
        </p>
      )}
    </form>
  );
}

export default ReportForm;