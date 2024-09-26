import { Product } from "../Products";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getCategories } from "../../../api/categories";
import { getColors } from "../../../api/colors";
import { createProduct, updateProduct, deleteProduct } from "../../../api/products";
// import { restoreToken } from "../../utils/storage";
import { ConfirmPopup, LoadingSpinnerSmall } from "../admin-components";

export function CreateProductModal({ product, setProducts }: { product: Product; setProducts: React.Dispatch<React.SetStateAction<Product[]>> }) {
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ name: string; description: string; price: number | string; category: number | string; image: string; color: number | string }>();

  useEffect(() => {
    reset({
      name: product.name,
      description: product.description,
      price: product.isEdit ? product.price : "",
      category: product.isEdit ? product.category.id : "",
      color: product.isEdit ? product.color.id : "",
      image: product.image,
    });
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
        // console.log(categories);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchColors = async () => {
      try {
        const colors = await getColors();
        setColors(colors);
        // console.log(categories);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
    fetchColors();
  }, []);

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    const deletePopup = document.getElementById("confirmPopup");
    if (deletePopup) (deletePopup as HTMLDialogElement).showModal();
  }

  async function handleConfirmDelete() {
    // console.log("Deleting product " + product.id);
    await deleteProduct(product.id);
    const deletePopup = document.getElementById("create_product_modal");
    if (deletePopup) (deletePopup as HTMLDialogElement).close();
    setProducts((prev) => prev.filter((x) => x.id != product.id));
  }

  async function onSubmit(data: {
    name: string;
    description: string;
    price: string | number;
    category: number | string;
    color: number | string;
    image: string;
  }) {
    const price = typeof data.price === "string" ? parseFloat(data.price) : data.price;
    const category = typeof data.category === "string" ? parseInt(data.category) : data.category;
    const color = typeof data.color === "string" ? parseInt(data.color) : data.color;
    // console.log({ name: data.name, description: data.description, price, categoryId: category });
    setLoading(true);
    if (!product.isEdit) {
      try {
        await createProduct({
          name: data.name,
          description: data.description,
          price,
          categoryId: category,
          image: data.image,
          colorId: color,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await updateProduct({
          name: data.name,
          description: data.description,
          price,
          categoryId: category,
          id: product.id,
          image: data.image,
          colorId: color,
        });
      } catch (err) {
        console.log(err);
      }
    }

    setLoading(false);
    const popup = document.getElementById("create_product_modal");
    if (popup) (popup as HTMLDialogElement).close();
    // setProducts(await getProducts(restoreToken()));
    window.location.reload(); //refresh the page
    reset();
  }

  return (
    <>
      <dialog id="create_product_modal" className="modal">
        <div className="modal-box w-full max-w-[70%]">
          {!loading ? (
            <div className="m-auto text-left w-full">
              {product.isEdit ? <p className="mx-2 mb-4 text-lg">Editing product</p> : <p className="mx-2 mb-4 text-lg">Create new product</p>}
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex gap-6">
                  <div className="w-1/2 flex flex-col gap-6">
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="Enter a product name"
                      autoComplete="off"
                      {...register("name", {
                        required: "Name is required",
                      })}
                    />
                    {errors.name && (
                      <p className="font-semibold text-error text-xs text-left top-[7.4rem] absolute">{errors.name.message?.toString()}</p>
                    )}
                    <textarea
                      // type="text"
                      className="input input-bordered w-full grow pt-1 resize-none h-48"
                      placeholder="Enter a product description"
                      autoComplete="off"
                      {...register("description", {
                        required: "Description is required",
                      })}
                    />
                    {errors.description && (
                      <p className="font-semibold text-error text-xs text-left top-[20.7rem] absolute">{errors.description.message?.toString()}</p>
                    )}
                    <input
                      type="text"
                      className="input input-bordered w-full "
                      placeholder="Enter a product price"
                      autoComplete="off"
                      {...register("price", {
                        required: "Price is required",
                        pattern: {
                          value: /^\d+(\.\d{1,2})?$/,
                          message: "Price must be a valid number with up to two decimal places",
                        },
                        validate: (value) => {
                          {
                            const _v = typeof value === "string" ? parseFloat(value) : value;
                            if (_v < 0) return "Price must be greater than 0";
                            return true;
                          }
                        },
                      })}
                    />
                    {errors.price && (
                      <p className="font-semibold text-error text-xs text-left top-[25.3rem] absolute">{errors.price.message?.toString()}</p>
                    )}
                  </div>
                  <div className="w-1/2 flex flex-col gap-6">
                    <select
                      className="select select-bordered w-full"
                      {...register("category", {
                        required: "Category is required",
                      })}>
                      <option value="">Select a category</option>
                      {categories.map((category: any) => {
                        return (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors.category && (
                      <p className="text-error text-xs text-left top-[7.3rem] right-8 absolute font-semibold">
                        {errors.category.message?.toString()}
                      </p>
                    )}

                    <select
                      className="select select-bordered w-full"
                      {...register("color", {
                        required: "Color is required",
                      })}>
                      <option value="">Select a color</option>
                      {colors.map((color: any) => {
                        return (
                          <option key={color.id} value={color.id}>
                            {color.name}
                          </option>
                        );
                      })}
                    </select>
                    {errors.color && (
                      <p className="text-error text-xs text-left top-[11.8rem] right-8 absolute font-semibold">{errors.color.message?.toString()}</p>
                    )}

                    <input type="text" className="input input-bordered w-full " placeholder="Image URL" autoComplete="off" {...register("image")} />
                    {errors.image && (
                      <p className="font-semibold text-error text-xs text-left top-[7.4rem] absolute">{errors.image.message?.toString()}</p>
                    )}
                    {product.image?.length > 0 && (
                      <div className="flex justify-center">
                        <img src={product.image} alt="product" className="h-1/2" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex w-full justify-evenly">
                  {product.isEdit ? (
                    <>
                      <button onClick={handleDelete} className="btn btn-error w-1/3">
                        Delete
                      </button>
                      <button type="submit" className="btn btn-success w-1/3">
                        Update
                      </button>
                      <button
                        onClick={() => {
                          reset();
                          const createProductModal = document.getElementById("create_product_modal");
                          if (createProductModal) (createProductModal as HTMLDialogElement).close();
                        }}
                        type="button"
                        className="btn w-1/3">
                        Close
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="h-[40rem] flex items-center justify-center">
              <LoadingSpinnerSmall />
            </div>
          )}
        </div>
      </dialog>
      <ConfirmPopup confirmText="Are you sure you want to delete this product?" deleteConfirmed={handleConfirmDelete} />
    </>
  );
}
