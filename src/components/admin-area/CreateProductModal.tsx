import { Product } from "./Products";
// import { useState } from "react";
import { useForm } from "react-hook-form";

export function CreateProductModal({ setProducts }: { setProducts: React.Dispatch<React.SetStateAction<Product[]>> }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ name: string; description: string; price: number; category: number }>();

  async function onSubmit(data: { name: string; description: string; price: number; category: number }) {
    console.log(data);
  }

  // const [newProduct, setNewProduct] = useState({
  //   name: "",
  //   description: "",
  //   price: 0,
  //   category: 0,
  //   id: 0,
  // });

  return (
    <>
      <dialog id="create_product_modal" className="modal">
        <div className="modal-box">
          <div className="max-w-96 m-auto text-left">
            <p className="mx-2 mb-4 text-lg">Create new product</p>
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <input
                type="text"
                className="input input-bordered w-full grow"
                placeholder="Enter a product name"
                autoComplete="off"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && <p className="text-error text-xs text-left bottom-[18.4rem] absolute">{errors.name.message?.toString()}</p>}
              <input
                type="text"
                className="input input-bordered w-full grow"
                placeholder="Enter a product description"
                autoComplete="off"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-error text-xs text-left bottom-[13.9rem] absolute">{errors.description.message?.toString()}</p>
              )}
              <input
                type="text"
                className="input input-bordered w-full grow"
                placeholder="Enter a product price"
                autoComplete="off"
                {...register("price", {
                  required: "Price is required",
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Price must be a valid number with up to two decimal places",
                  },
                  validate: (value) => {
                    if (value < 0) return "Price must be greater than 0";
                    return true;
                  },
                })}
              />
              {errors.price && <p className="text-error text-xs text-left bottom-[9.4rem] absolute">{errors.price.message?.toString()}</p>}

              <select
                className="input input-bordered w-full grow"
                {...register("category", {
                  required: "Category is required",
                })}>
                <option value={0}>Select a category</option>
                <option value={1}>Category 1</option>
                <option value={2}>Category 2</option>
                <option value={3}>Category 3</option>
              </select>
              {errors.category && <p className="text-error text-xs text-left bottom-[4.9rem] absolute">{errors.category.message?.toString()}</p>}
              <div className="flex w-full justify-evenly">
                <button type="submit" className="btn btn-primary px-8 w-1/2">
                  Submit
                </button>
                <button
                  onClick={() => {
                    reset();
                    const createProductModal = document.getElementById("create_product_modal");
                    if (createProductModal) (createProductModal as HTMLDialogElement).close();
                  }}
                  type="button"
                  className="btn w-1/2">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
