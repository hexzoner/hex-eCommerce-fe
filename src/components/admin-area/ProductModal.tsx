import { Product } from "./Products";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ProductModal({ product }: { product: Product }) {
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
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

export function CreateProductModal({ setProducts }: { setCategories: React.Dispatch<React.SetStateAction<Product[]>> }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
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
      <dialog id="product_modal" className="modal">
        <div className="modal-box">
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="max-w-96 m-auto text-left">
              <input
                type="text"
                className="grow"
                placeholder="Enter a product name"
                autoComplete="off"
                {...register("name", {
                  required: "Name is required",
                })}
              />

              <input
                type="text"
                className="grow"
                placeholder="Enter a product description"
                autoComplete="off"
                {...register("description", {
                  required: "Description is required",
                })}
              />

              <input
                type="text"
                className="grow"
                placeholder="Enter a product price"
                autoComplete="off"
                {...register("price", {
                  required: "Price is required",
                })}
              />
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
