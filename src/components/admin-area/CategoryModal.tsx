import { Category } from "./Categories";
import { useState } from "react";
import { updateCategory, createCategory, getCategories, deleteCategory } from "../../api/categories";
import { restoreToken } from "../../utils/storage";
import { ConfirmPopup } from "./admin-components";

interface CategoryModalProps {
  category: Category;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export default function CategoryModal({ category, setSelectedCategory, setCategories }: CategoryModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedCategory({ ...category, name: e.target.value });
  }

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    const deletePopup = document.getElementById("confirmPopup");
    if (deletePopup) (deletePopup as HTMLDialogElement).showModal();
  }

  function handleEdit(e: React.MouseEvent) {
    e.preventDefault();
    setEditMode(true);
  }

  async function finishEdit(e: React.MouseEvent) {
    e.preventDefault();
    setLoading(true);
    await updateCategory(restoreToken(), category);
    setCategories((prev) => {
      return prev.map((c) => {
        if (c.id === category.id) {
          return category;
        }
        return c;
      });
    });
    setEditMode(false);
    setLoading(false);
  }

  async function handleConfirmDelete() {
    await deleteCategory(restoreToken(), category.id);
    const deletePopup = document.getElementById("category_modal");
    if (deletePopup) (deletePopup as HTMLDialogElement).close();
    setCategories((prev) => prev.filter((x) => x.id != category.id));
  }

  return (
    <>
      <dialog id="category_modal" className="modal">
        <div className="modal-box">
          <p className="py-4">Id = {category.id}</p>

          {loading ? (
            <div className="min-h-[6rem]">
              <LoadingSpinnerSmall />
            </div>
          ) : (
            <div className="max-w-96 m-auto text-left">
              {!editMode ? (
                <h3 className="font-bold text-lg">{category.name}</h3>
              ) : (
                <div>
                  <input
                    onChange={handleChange}
                    value={category.name}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>
              )}
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button onClick={handleDelete} className="btn btn-error btn-sm">
                    Delete
                  </button>
                  {editMode ? (
                    <button onClick={finishEdit} className="btn btn-warning btn-sm">
                      Save
                    </button>
                  ) : (
                    <button onClick={handleEdit} className="btn btn-warning btn-sm">
                      Edit
                    </button>
                  )}
                  <button className="btn btn-sm">Close</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </dialog>
      <ConfirmPopup confirmText="Are you sure you want to delete this category?" deleteConfirmed={handleConfirmDelete} />
    </>
  );
}

export function LoadingSpinnerSmall() {
  return <span className="loading loading-dots loading-md"></span>;
}

export function CreateCategoryModal({ setCategories }: { setCategories: React.Dispatch<React.SetStateAction<Category[]>> }) {
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>({ id: 0, name: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewCategory({ ...newCategory, name: e.target.value });
  }

  async function handleCreate(e: React.MouseEvent) {
    e.preventDefault();
    if (newCategory.name.length == 0) return;
    setLoading(true);
    await createCategory(restoreToken(), newCategory);
    const categories = await getCategories(restoreToken());
    setCategories(categories);
    setLoading(false);
    setNewCategory({ id: 0, name: "" });
    const categoryModal = document.getElementById("create_category_modal");
    if (categoryModal) (categoryModal as HTMLDialogElement).close();
  }

  return (
    <>
      <dialog id="create_category_modal" className="modal">
        <div className="modal-box">
          <div className="max-w-96 m-auto text-left">
            <h3 className="font-bold text-lg mb-4">Create Category</h3>
            {loading ? (
              <div className="text-center">
                <LoadingSpinnerSmall />
              </div>
            ) : (
              <div>
                <input
                  onChange={handleChange}
                  value={newCategory.name}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full "
                />
              </div>
            )}
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button onClick={handleCreate} className="btn btn-success btn-sm">
                  Create
                </button>
                <button className="btn btn-sm">Close</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
