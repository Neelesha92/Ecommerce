import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
}

const EditCategory = () => {
  const { id } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  // Fetch category by ID
  useEffect(() => {
    fetch(`http://localhost:5000/categories/${id}`)
      .then((res) => res.json())
      .then((data) => setCategory(data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    const formData = new FormData();
    formData.append("name", category.name);
    if (category.description)
      formData.append("description", category.description);

    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/categories/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Category updated successfully!");
      } else {
        setMessage(data.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  if (!category) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Edit Category</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          type="text"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          placeholder="Category name"
        />

        {/* Description */}
        <textarea
          value={category.description || ""}
          onChange={(e) =>
            setCategory({ ...category, description: e.target.value })
          }
          className="w-full px-4 py-2 border rounded"
          placeholder="Description"
        />

        {/* Current Image */}
        {category.image && (
          <img
            src={category.image}
            alt="Current"
            className="w-32 h-32 object-cover rounded mb-4"
          />
        )}

        {/* Upload New Image */}
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
