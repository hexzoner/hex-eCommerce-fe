import { Color } from "../../../pages/admin/Colors";
import { useState } from "react";
import { updateColor, createColor, deleteColor, getColors } from "../../../api/colors";
import { restoreToken } from "../../../utils/storage";
import { ConfirmPopup } from "../admin-components";

interface ColorModalProps {
  color: Color;
  setSelectedColor: React.Dispatch<React.SetStateAction<Color>>;
  setColors: React.Dispatch<React.SetStateAction<Color[]>>;
}

export default function ColorModal({ color, setSelectedColor, setColors }: ColorModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedColor({ ...color, name: e.target.value });
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
    await updateColor(restoreToken(), color);
    setColors((prev) => {
      return prev.map((c) => {
        if (c.id === color.id) return color;
        return c;
      });
    });
    setEditMode(false);
    setLoading(false);
  }

  async function handleConfirmDelete() {
    await deleteColor(restoreToken(), color.id);
    const deletePopup = document.getElementById("color_modal");
    if (deletePopup) (deletePopup as HTMLDialogElement).close();
    setColors((prev) => prev.filter((x) => x.id != color.id));
  }

  return (
    <>
      <dialog id="color_modal" className="modal">
        <div className="modal-box">
          <p className="py-4">Id = {color.id}</p>

          {loading ? (
            <div className="min-h-[6rem]">
              <LoadingSpinnerSmall />
            </div>
          ) : (
            <div className="max-w-96 m-auto ">
              {!editMode ? (
                <h3 className="font-bold text-lg">{color.name}</h3>
              ) : (
                <div>
                  <input
                    onChange={handleChange}
                    value={color.name}
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
      <ConfirmPopup confirmText="Are you sure you want to delete this color?" deleteConfirmed={handleConfirmDelete} />
    </>
  );
}

export function LoadingSpinnerSmall() {
  return <span className="loading loading-dots loading-md"></span>;
}

export function CreateColorModal({ setColors }: { setColors: React.Dispatch<React.SetStateAction<Color[]>> }) {
  const [loading, setLoading] = useState(false);
  const [newColor, setNewColor] = useState<Color>({ id: 0, name: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewColor({ ...newColor, name: e.target.value });
  }

  async function handleCreate(e: React.MouseEvent) {
    e.preventDefault();
    if (newColor.name.length == 0) return;
    setLoading(true);
    await createColor(restoreToken(), newColor);
    const colors = await getColors();
    setColors(colors);
    setLoading(false);
    setNewColor({ id: 0, name: "" });
    const colorModal = document.getElementById("create_color_modal");
    if (colorModal) (colorModal as HTMLDialogElement).close();
  }

  return (
    <>
      <dialog id="create_color_modal" className="modal">
        <div className="modal-box">
          <div className="max-w-96 m-auto text-left">
            <h3 className="font-bold text-lg mb-4">Create Color</h3>
            {loading ? (
              <div className="text-center">
                <LoadingSpinnerSmall />
              </div>
            ) : (
              <div>
                <input onChange={handleChange} value={newColor.name} type="text" placeholder="Type here" className="input input-bordered w-full " />
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
