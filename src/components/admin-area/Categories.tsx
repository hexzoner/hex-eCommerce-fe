import { getCategories } from "../../api/categories";
import { useState, useEffect } from "react";
import { restoreToken } from "../../utils/storage";
import LoadingSpinner from "../LoadingSpinner";
import sortTables from "../../utils/sortTables";
import { CategoryModal, CreateCategoryModal } from "./admin-components";

export interface Category {
  id: number;
  name: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: 0,
    name: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const token = restoreToken();
        if (!token) return;
        const categories = await getCategories(token);
        // console.log(users);
        setCategories(categories);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedUsers = sortTables(categories, key, newSortOrder);
    setCategories(sortedUsers);
  };

  function createCategory() {
    const categoryModal = document.getElementById("create_category_modal");
    if (categoryModal) (categoryModal as HTMLDialogElement).showModal();
  }

  if (loading) return <LoadingSpinner />;

  const borderMarkup = ""; //border-[2px] border-base-content p-3 my-4 font-semibold";
  return (
    <div className="min-h-screen">
      <div className="w-full flex max-w-3xl m-auto justify-center mb-4 items-center gap-4">
        <p className="text-3xl my-6">Categories </p>
        <button onClick={createCategory} className="btn btn-outline btn-sm">
          Create Category
        </button>
      </div>
      <div className="overflow-x-auto rounded-md max-w-3xl m-auto">
        <table className="table rounded-md table-zebra table-sm w-full shadow-md">
          <thead className="text-sm bg-base-300">
            <tr>
              <th className="font-bold w-1/6">
                <div className="flex gap-1 items-center ">
                  <span>ID</span>
                  <button title="SortById" className="hover:cursor-pointer" onClick={() => handleSortClick("id")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  </button>
                </div>
              </th>
              <th className="font-bold">
                <div className="flex gap-1 items-center">
                  <span>Name</span>
                  <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("name")}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category: Category) => {
              return (
                <tr
                  key={category.id}
                  className="hover cursor-pointer"
                  onClick={() => {
                    setSelectedCategory(category);
                    const categoryModal = document.getElementById("category_modal");
                    if (categoryModal) (categoryModal as HTMLDialogElement).showModal();
                  }}>
                  <td className={borderMarkup}>{category.id}</td>
                  <td className={borderMarkup}>{category.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* <Pagination page={page} setPage={setPage} totalPages={totalPages} perPage={perPage} setPerPage={setPerPage} totalResults={totalTasks} /> */}
        {/* <TaskDetailsPopup task={selectedTask} /> */}
        <CategoryModal category={selectedCategory} setSelectedCategory={setSelectedCategory} setCategories={setCategories} />
        <CreateCategoryModal setCategories={setCategories} />
      </div>
    </div>
  );
}
