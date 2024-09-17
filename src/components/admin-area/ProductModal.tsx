import { Product } from "./Products";
import { useState } from "react";
import { ConfirmPopup } from "./admin-components";

export default function ProductModal({ product }: { product: Product }) {
  const [editMode, setEditMode] = useState(false);
  // const [loading, setLoading] = useState(false);

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
    // setLoading(true);
    // await updateCategory(restoreToken(), category);
    // setCategories((prev) => {
    //   return prev.map((c) => {
    //     if (c.id === category.id) {
    //       return category;
    //     }
    //     return c;
    //   });
    // });
    setEditMode(false);
    // setLoading(false);
  }

  async function handleConfirmDelete() {
    // await deleteCategory(restoreToken(), category.id);
    // const deletePopup = document.getElementById("category_modal");
    // if (deletePopup) (deletePopup as HTMLDialogElement).close();
    // setCategories((prev) => prev.filter((x) => x.id != category.id));
  }

  return (
    <>
      <dialog id="product_modal" className="modal">
        <div className="modal-box">
          <div className="max-w-96 m-auto text-left">
            <div className="flex items-center justify-center gap-4">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="py-4">[Id = {product.id}]</p>
            </div>
            <p className="py-4">{product.description}</p>
            <p className="py-4">Price: ${product.price}</p>
            <p className="py-4">
              Category: {product.category.name} [id = {product.category.id}]
            </p>
            <div className="modal-action">
              <form method="dialog">
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
        </div>
      </dialog>
      <ConfirmPopup confirmText="Are you sure you want to delete this product?" deleteConfirmed={handleConfirmDelete} />
    </>
  );
}
