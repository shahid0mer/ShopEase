import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCarousels,
  addCarousel,
  deleteCarousel,
} from "../Features/Carousal/carousalSlice";

const AdminCarouselManager = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.carousel);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    alt: "",
    link: "",
    image: null,
  });

  useEffect(() => {
    dispatch(fetchCarousels());
  }, [dispatch]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("subtitle", formData.subtitle);
    uploadData.append("alt", formData.alt);
    uploadData.append("link", formData.link);
    uploadData.append("image", formData.image);

    dispatch(addCarousel(uploadData));
    setFormData({ title: "", subtitle: "", alt: "", link: "", image: null });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this carousel?")) {
      dispatch(deleteCarousel(id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold mb-4">Manage Carousels</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="Title"
          onChange={handleChange}
          className="w-full border px-3 border-[var(--neutral-200)] py-2 rounded focus:outline-[var(--primary-light)]"
          required
        />
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          placeholder="Subtitle"
          onChange={handleChange}
          className="w-full border border-[var(--neutral-200)] px-3 py-2 focus:outline-[var(--primary-light)] "
        />
        <input
          type="text"
          name="alt"
          value={formData.alt}
          placeholder="Alt text"
          onChange={handleChange}
          className="w-full border border-[var(--neutral-200)] px-3 py-2  focus:outline-[var(--primary-light)]"
        />
        <input
          type="text"
          name="link"
          value={formData.link}
          placeholder="Link (optional)"
          onChange={handleChange}
          className="w-full border border-[var(--neutral-200)] px-3 py-2  focus:outline-[var(--primary-light)]"
        />
        <div className="flex border border-[var(--neutral-200)] gap-1.5 w-[250px] active:scale-95 transition-all">
          ➕
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-[250px]block"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[var(--primary)] active:scale-90 transition-all text-white px-6 py-2  hover:bg-[var(--primary-dark)]"
        >
          Upload Carousel
        </button>
      </form>

      {/* Carousel List */}
      {loading ? (
        <p>Loading carousels...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <li
              key={item._id}
              className=" border  border-[var(--neutral-200)] p-9 relative"
            >
              <img
                src={item.imageUrl}
                alt={item.alt}
                className="w-full h-48 object-cover  mb-2"
              />
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm">{item.subtitle}</p>
              <button
                onClick={() => handleDelete(item._id)}
                className="absolute top-2 right-2  text-red-600 hover:text-red-800"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminCarouselManager;
