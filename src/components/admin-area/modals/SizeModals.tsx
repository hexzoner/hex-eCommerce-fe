import { Size } from "../Sizes";
import { useState } from "react";
import { getSizes, createSize, updateSize, deleteSize } from "../../../api/sizes";
// import { restoreToken } from "../../../utils/storage";
import { ConfirmPopup } from "../admin-components";
import { LoadingSpinnerSmall } from "../admin-components";

interface SizeModalProps {
  size: Size;
  setSelectedSize: React.Dispatch<React.SetStateAction<Size>>;
  setSizes: React.Dispatch<React.SetStateAction<Size[]>>;
}

export default function SizeModal({ size, setSelectedSize, setSizes }: SizeModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // console.log(e.target.name, e.target.value);
    setSelectedSize({
      ...size,
      [e.target.name]: e.target.value,
    });
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
    await updateSize(size);
    setSizes((prev) => {
      return prev.map((c) => {
        if (c.id === size.id) return size;
        return c;
      });
    });
    setEditMode(false);
    setLoading(false);
  }

  async function handleConfirmDelete() {
    await deleteSize(size.id);
    const deletePopup = document.getElementById("size_modal");
    if (deletePopup) (deletePopup as HTMLDialogElement).close();
    setSizes((prev) => prev.filter((x) => x.id != size.id));
  }

  return (
    <>
      <dialog id="size_modal" className="modal">
        <div className="modal-box">
          <p className="py-4">Id = {size.id}</p>

          {loading ? (
            <div className="min-h-[6rem]">
              <LoadingSpinnerSmall />
            </div>
          ) : (
            <div className="max-w-96 m-auto ">
              {!editMode ? (
                <>
                  <h3 className="font-bold text-lg">Name: {size.name}</h3>
                  <p className="text-lg">Square Meters: {size.squareMeters}</p>
                </>
              ) : (
                <div>
                  <input
                    name="name"
                    onChange={handleChange}
                    value={size.name}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                  />
                  <input
                    name="squareMeters"
                    onChange={handleChange}
                    value={size.squareMeters}
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
                  />
                </div>
              )}
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button onClick={handleDelete} className="btn btn-error btn-sm rounded-none">
                    Delete
                  </button>
                  {editMode ? (
                    <button onClick={finishEdit} className="btn btn-warning btn-sm rounded-none">
                      Save
                    </button>
                  ) : (
                    <button onClick={handleEdit} className="btn btn-warning btn-sm rounded-none">
                      Edit
                    </button>
                  )}
                  <button className="btn btn-sm rounded-none">Close</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </dialog>
      <ConfirmPopup confirmText="Are you sure you want to delete this size?" deleteConfirmed={handleConfirmDelete} />
    </>
  );
}

export function CreateSizeModal({ setSizes }: { setSizes: React.Dispatch<React.SetStateAction<Size[]>> }) {
  const [loading, setLoading] = useState(false);
  const [newSize, setNewSize] = useState<Size>({ id: 0, name: "", squareMeters: 0 });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewSize({ ...newSize, name: e.target.value });
  }

  async function handleCreate(e: React.MouseEvent) {
    e.preventDefault();
    if (newSize.name.length == 0) return;
    setLoading(true);
    await createSize(newSize);
    const sizes = await getSizes();
    setSizes(sizes);
    setLoading(false);
    setNewSize({ id: 0, name: "", squareMeters: 0 });
    const sizeModal = document.getElementById("create_size_modal");
    if (sizeModal) (sizeModal as HTMLDialogElement).close();
  }

  return (
    <>
      <dialog id="create_size_modal" className="modal">
        <div className="modal-box">
          <div className="max-w-96 m-auto text-left">
            <h3 className="font-bold text-lg mb-4">Create Size</h3>
            {loading ? (
              <div className="text-center">
                <LoadingSpinnerSmall />
              </div>
            ) : (
              <div>
                <input onChange={handleChange} value={newSize.name} type="text" placeholder="Type here" className="input input-bordered w-full " />
              </div>
            )}
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button onClick={handleCreate} className="btn btn-success btn-sm rounded-none">
                  Create
                </button>
                <button className="btn btn-sm rounded-none">Close</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
