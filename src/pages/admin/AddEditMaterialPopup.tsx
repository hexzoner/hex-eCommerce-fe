import { Material } from "./Material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createMaterial, updateMaterial, deleteMaterial } from "../../api/material";
import { LoadingSpinnerSmall } from "../../components/admin-area/modals/ColorModals";
import { ConfirmPopup } from "../../components/admin-area/admin-components";

export default function AddEditMaterialPopup({ material, setMaterials }: { material: Material; setMaterials: any }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<{
    name: string;
    description: string;
    image: string;
  }>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    resetForm();
  }, [material]);

  function resetForm() {
    reset({
      name: material.name,
      //   description: material.description,
      image: material.image,
    });
  }

  // Watch the image input field
  const imageUrl = watch("image");

  function onSubmit(data: any) {
    // console.log(data);
    if (material.id <= 0) {
      setLoading(true);
      createMaterial(data)
        .then((res) => {
          // console.log(res);
          if (res) {
            setMaterials((prev: any) => [...prev, res]);
            resetForm();
            const modal = document.getElementById("material_modal");
            if (modal) (modal as HTMLDialogElement).close();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(true);
      updateMaterial(data, material.id)
        .then((res) => {
          if (res) setMaterials((prev: any) => prev.map((p: any) => (p.id === material.id ? res : p)));
          resetForm();
          const modal = document.getElementById("material_modal");
          if (modal) (modal as HTMLDialogElement).close();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  function handleDelete(e: any) {
    e.preventDefault();

    const confirm = document.getElementById("confirmPopup");
    if (confirm) (confirm as HTMLDialogElement).showModal();
  }

  function deleteConfirmed() {
    setLoading(true);
    deleteMaterial(material.id)
      .then((res) => {
        if (res) setMaterials((prev: any) => prev.filter((p: any) => p.id !== material.id));
        resetForm();
        const modal = document.getElementById("material_modal");
        if (modal) (modal as HTMLDialogElement).close();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <dialog id="material_modal" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <form method="dialog">
          <button onClick={resetForm} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>

        {!loading ? (
          <div className="text-left">
            <form className="flex flex-col gap-3 pt-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <div className="flex gap-2 items-center">
                  <label className="min-w-24" htmlFor="name">
                    Name:
                  </label>
                  <input id="name" type="text" className="input input-bordered w-full" {...register("name", { required: true })} />
                </div>
                {errors.name && <p className="text-error text-xs ml-28">Name is required</p>}
              </div>

              {/* <div>
                <div className="flex gap-2 items-start w-full">
                  <label className="min-w-24 mt-2" htmlFor="description">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    className="textarea textarea-bordered resize-none w-full min-h-48"
                    {...register("description", { required: true })}
                  />
                </div>
                {errors.description && <p className="text-error text-xs ml-28">Description is required</p>}
              </div> */}

              <div>
                <div className="flex gap-2 items-center">
                  <label className="min-w-24" htmlFor="image">
                    Image:
                  </label>
                  <input id="image" type="text" className="input input-bordered w-full" {...register("image", { required: true })} />
                </div>
                {errors.image && <p className="text-error text-xs ml-28">Image is required</p>}
              </div>
              {imageUrl && <img className="w-[30rem] m-auto" src={imageUrl} alt="image" />}

              <div>
                <button className="btn btn-success btn-sm rounded-none">Save</button>
                {/* <button onClick={handleCancel} className="btn btn-sm">
                  Cancel
                </button> */}
                {material.id > 0 && (
                  <button onClick={handleDelete} className="btn btn-error btn-sm rounded-none">
                    Delete
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="min-h-96 flex flex-col items-center justify-center">
            <LoadingSpinnerSmall />
          </div>
        )}
      </div>
      <ConfirmPopup deleteConfirmed={deleteConfirmed} confirmText="Are you sure to delete this material?" />
    </dialog>
  );
}
