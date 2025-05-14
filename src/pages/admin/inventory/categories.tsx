import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Link from "next/link";
import Head from "next/head";
import { medicineAPI } from "../../../utils/api";
import { MedicineCategory } from "../../../types";

const MedicineCategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [selectedCategory, setSelectedCategory] =
    useState<MedicineCategory | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch medicine categories
  const { data: categories, isLoading } = useQuery<MedicineCategory[]>(
    "medicineCategories",
    medicineAPI.getMedicineCategories,
    {
      onError: () => {
        setError("Failed to load categories. Please try again later.");
      },
    }
  );

  // Create category mutation
  const createCategory = useMutation(
    (categoryData: any) => medicineAPI.createMedicineCategory(categoryData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("medicineCategories");
        setNewCategory({ name: "", description: "" });
        setSuccess("Category created successfully.");
        setTimeout(() => setSuccess(null), 3000);
      },
      onError: () => {
        setError("Failed to create category. Please try again.");
        setTimeout(() => setError(null), 3000);
      },
    }
  );

  // Update category mutation
  const updateCategory = useMutation(
    (categoryData: any) => {
      return fetch(`/api/medicine-categories/${selectedCategory?.categoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("medicineCategories");
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        setSuccess("Category updated successfully.");
        setTimeout(() => setSuccess(null), 3000);
      },
      onError: () => {
        setError("Failed to update category. Please try again.");
        setTimeout(() => setError(null), 3000);
      },
    }
  );

  // Delete category mutation
  const deleteCategory = useMutation(
    (id: number) => {
      return fetch(`/api/medicine-categories/${id}`, {
        method: "DELETE",
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("medicineCategories");
        setIsDeleteModalOpen(false);
        setSelectedCategory(null);
        setSuccess("Category deleted successfully.");
        setTimeout(() => setSuccess(null), 3000);
      },
      onError: () => {
        setError(
          "Failed to delete category. It may be in use by existing medicines."
        );
        setTimeout(() => setError(null), 3000);
      },
    }
  );

  // Handle new category form submission
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setError("Category name is required");
      setTimeout(() => setError(null), 3000);
      return;
    }
    createCategory.mutate(newCategory);
  };

  // Open edit modal
  const handleEdit = (category: MedicineCategory) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  // Handle edit form submission
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !selectedCategory.name.trim()) {
      setError("Category name is required");
      setTimeout(() => setError(null), 3000);
      return;
    }
    updateCategory.mutate(selectedCategory);
  };

  // Open delete modal
  const handleDeletePrompt = (category: MedicineCategory) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Handle edit input changes
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (selectedCategory) {
      setSelectedCategory({
        ...selectedCategory,
        [name]: value,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Medicine Categories | Medical Center Management System</title>
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <Link
                  href="/admin"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Admin
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <Link
                  href="/admin/inventory"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Medicine Inventory
                </Link>
              </li>
              <li>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-900">Categories</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Medicine Categories
            </h1>
            <p className="text-gray-600 mt-1">
              Manage medicine categories for inventory organization
            </p>
          </div>
        </div>

        {/* Error and success messages */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <p>{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create New Category Form */}
          <div className="bg-white shadow rounded-lg overflow-hidden md:col-span-1">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Create New Category
              </h2>
              <form onSubmit={handleCreateCategory}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white shadow rounded-lg overflow-hidden md:col-span-2">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Existing Categories
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <svg
                    className="animate-spin h-8 w-8 text-green-500 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading categories...
                </div>
              ) : categories?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No categories found. Create your first category.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories?.map((category) => (
                        <tr
                          key={category.categoryId}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {category.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {category.description || "No description"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(category)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePrompt(category)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsEditModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Edit Category
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleUpdateCategory}>
                        <div className="mb-4">
                          <label
                            htmlFor="edit-name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Category Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="edit-name"
                            name="name"
                            value={selectedCategory.name}
                            onChange={handleEditChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="edit-description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Description
                          </label>
                          <textarea
                            id="edit-description"
                            name="description"
                            value={selectedCategory.description || ""}
                            onChange={handleEditChange}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            rows={3}
                          />
                        </div>
                        <div className="mt-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={() => setIsEditModalOpen(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedCategory && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Category
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the category{" "}
                        <span className="font-medium">
                          {selectedCategory.name}
                        </span>
                        ? This action cannot be undone, and all medicines in
                        this category will need to be reassigned.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() =>
                    deleteCategory.mutate(selectedCategory.categoryId)
                  }
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicineCategoriesPage;
