import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, fetchUserCategories, updateCategory } from "../redux/categorySlice";
import { HiPlus, HiX, HiOutlineDocumentText, HiPencil } from "react-icons/hi"; // Importing icons

const CategoryPage = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [categoryName, setCategoryName] = useState(""); // State for the category input
  const [editingCategoryId, setEditingCategoryId] = useState(null); // State for editing category ID

  useEffect(() => {
    dispatch(fetchUserCategories());
  }, [dispatch]);

  const handleAddOrEditCategory = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (categoryName.trim()) {
      if (editingCategoryId) {
        await dispatch(updateCategory({ id: editingCategoryId, categoryData: { category_name: categoryName } })); // Update category
      } else {
        await dispatch(addCategory({ category_name: categoryName })); // Add category
      }
      setCategoryName(""); // Clear input after adding/updating
      setIsModalOpen(false); // Close the modal
      setEditingCategoryId(null); // Reset editing state
    }
  };

  const handleEditClick = (category) => {
    setCategoryName(category.category_name); // Set current category name in input
    setEditingCategoryId(category.id); // Set category ID to be edited
    setIsModalOpen(true); // Open the modal
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Categories</h1>
        {loading && <p className="text-center text-gray-600">Loading categories...</p>}
        <div className="flex flex-col space-y-4 mb-6">
          {categories.length === 0 ? (
            <p className="text-gray-600 text-center">No categories found.</p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow">
                <div className="flex items-center">
                  <HiOutlineDocumentText className="text-gray-600 mr-2" />
                  <span className="text-lg text-gray-800">{category.category_name}</span>
                </div>
                <button
                  onClick={() => handleEditClick(category)} // Open modal to edit category
                  className="text-blue-600 hover:text-blue-800"
                >
                  <HiPencil />
                </button>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)} // Open the modal for adding a new category
          className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-lg transition duration-200 hover:bg-blue-700"
        >
          <HiPlus className="mr-2" />
          Add Category
        </button>
      </div>

      {/* Modal for adding/editing a category */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-11/12 md:w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">{editingCategoryId ? "Edit Category" : "Add Category"}</h2>
            <form onSubmit={handleAddOrEditCategory}>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                className="border border-gray-300 p-2 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)} // Close the modal
                  className="bg-gray-400 text-white px-4 py-2 rounded transition duration-200 hover:bg-gray-500 flex items-center"
                >
                  <HiX className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded transition duration-200 hover:bg-blue-700 flex items-center"
                >
                  <HiPlus className="mr-2" />
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
