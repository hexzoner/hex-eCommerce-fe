import { Product } from "../Products";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getCategories } from "../../../api/categories";
import { getColors } from "../../../api/colors";
import { getSizes } from "../../../api/sizes";
import { createProduct, updateProduct, deleteProduct } from "../../../api/products";
// import { restoreToken } from "../../utils/storage";
import { ConfirmPopup, LoadingSpinnerSmall } from "../admin-components";
import { FilterDropdown } from "../../Filters";
import { Size } from "../Sizes";
import { Color } from "../Colors";
const dummyRug = "https://th.bing.com/th/id/OIP.MvnwHj_3a0ICmk72FNI5WQHaFR?rs=1&pid=ImgDetMain";

export function CreateProductModal({
  product,
  setProducts,
  setUpdate,
}: {
  product: Product;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<{
    name: string;
    description: string;
    price: number | string;
    category: number | string;
    image: string;
    color: number | string;
    defaultSize: number | string;
    active: boolean;
  }>();

  const imageInput = watch("image");

  useEffect(() => {
    reset({
      name: product.name,
      description: product.description,
      price: product.isEdit ? product.price : "",
      category: product.isEdit ? product.category.id : "",
      color: product.isEdit ? product.defaultColor.id : "",
      image: product.image,
      defaultSize: product.isEdit ? product.defaultSize.id : "",
      active: product.isEdit ? product.active : true,
    });

    setSelectedSizes(product.isEdit ? product.sizes.map((s) => ({ id: s.id, name: s.name })) : []);
    setSelectedColors(product.isEdit ? product.colors.map((c) => ({ id: c.id, name: c.name })) : []);
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

    const fetchSizes = async () => {
      try {
        const sizes = await getSizes();
        setSizes(sizes);
        // console.log(categories);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSizes();
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
    defaultSize: number | string;
    active: boolean;
  }) {
    // parsing the data to the correct type before sending it to the server
    const price = typeof data.price === "string" ? parseFloat(data.price) : data.price;
    const category = typeof data.category === "string" ? parseInt(data.category) : data.category;
    const color = typeof data.color === "string" ? parseInt(data.color) : data.color;
    const defaultSize = typeof data.defaultSize === "string" ? parseInt(data.defaultSize) : data.defaultSize;
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
          colors: selectedColors.map((c) => c.id),
          defaultColorId: color,
          sizes: selectedSizes.map((s) => s.id),
          defaultSize,
          active: data.active === undefined ? false : data.active,
        });
        setUpdate((prev) => !prev);
        closing();
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
          colors: selectedColors.map((c) => c.id),
          defaultColorId: color,
          sizes: selectedSizes.map((s) => s.id),
          active: data.active === undefined ? false : data.active,
          defaultSize,
        });
        setUpdate((prev) => !prev);
        closing();
      } catch (err) {
        console.log(err);
      }
    }

    setLoading(false);

    function closing() {
      const popup = document.getElementById("create_product_modal");
      if (popup) (popup as HTMLDialogElement).close();
      reset();
      // window.location.reload(); //refresh the page
      // setProducts(await getProducts(restoreToken()));
    }
  }

  return (
    <>
      <dialog id="create_product_modal" className="modal">
        <div className="modal-box w-full max-w-[90%]">
          {!loading ? (
            <div className="m-auto text-left w-full">
              {product.isEdit ? <p className="mx-2 mb-4 text-lg">Editing product</p> : <p className="mx-2 mb-4 text-lg">Create new product</p>}
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <div className="flex gap-6">
                  <div className="w-1/2 flex flex-col gap-6 ">
                    <div>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Enter a product name"
                        autoComplete="off"
                        {...register("name", {
                          required: "Name is required",
                        })}
                      />
                      {errors.name && <p className="font-semibold text-error text-xs text-left ">{errors.name.message?.toString()}</p>}
                    </div>

                    <div>
                      <textarea
                        // type="text"
                        className="input input-bordered w-full pt-1 resize-none h-64"
                        placeholder="Enter a product description"
                        autoComplete="off"
                        {...register("description", {
                          required: "Description is required",
                        })}
                      />
                      {errors.description && <p className="font-semibold text-error text-xs text-left ">{errors.description.message?.toString()}</p>}
                    </div>

                    <div>
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
                      {errors.price && <p className="font-semibold text-error text-xs text-left ">{errors.price.message?.toString()}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                      <p>Is Active?</p>
                      <input type="checkbox" className="h-5 w-5 text-primary" {...register("active")} />
                    </div>
                  </div>

                  <div className="w-1/2 flex flex-col gap-6">
                    <div>
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
                      {errors.category && <p className="text-error text-xs text-left right-8 font-semibold">{errors.category.message?.toString()}</p>}
                    </div>

                    <FilterDropdown
                      name="Colors"
                      options={colors}
                      setSelected={setSelectedColors}
                      selected={selectedColors}
                      selectedRemoved={selectedColors}
                    />

                    <FilterDropdown
                      name="Sizes"
                      options={sizes}
                      setSelected={setSelectedSizes}
                      selected={selectedSizes}
                      selectedRemoved={selectedSizes}
                    />

                    <div>
                      <select
                        className="select select-bordered w-full"
                        {...register("color", {
                          required: "Color is required",
                        })}>
                        <option value="">Select a color</option>
                        {selectedColors.map((color: any) => {
                          return (
                            <option key={color.id} value={color.id}>
                              {color.name}
                            </option>
                          );
                        })}
                      </select>
                      {errors.color && <p className="text-error text-xs text-left right-8 font-semibold">{errors.color.message?.toString()}</p>}
                    </div>

                    <div>
                      <select
                        className="select select-bordered w-full"
                        {...register("defaultSize", {
                          required: "Default size is required",
                        })}>
                        <option value="">Select a default size</option>
                        {selectedSizes.length > 0 &&
                          selectedSizes.map((size: any) => {
                            return (
                              <option key={size.id} value={size.id}>
                                {size.name}
                              </option>
                            );
                          })}
                      </select>
                      {errors.defaultSize && (
                        <p className="text-error text-xs text-left right-8 font-semibold">{errors.defaultSize.message?.toString()}</p>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        className="input input-bordered w-full "
                        placeholder="Image URL"
                        autoComplete="off"
                        {...register("image", {
                          required: "Image is required",
                        })}
                      />
                      {errors.image && <p className="font-semibold text-error text-xs text-left ">{errors.image.message?.toString()}</p>}
                    </div>

                    <div className="flex justify-center">
                      <img
                        src={product.image?.length > 0 ? product.image : imageInput && imageInput.length > 0 ? imageInput : dummyRug}
                        alt="product"
                        className="h-64"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex w-full justify-evenly">
                  {product.isEdit ? (
                    <>
                      <button onClick={handleDelete} className="btn btn-error w-1/3 rounded-none">
                        Delete
                      </button>
                      <button type="submit" className="btn btn-success w-1/3  rounded-none">
                        Update
                      </button>
                      <button
                        onClick={() => {
                          reset();
                          const createProductModal = document.getElementById("create_product_modal");
                          if (createProductModal) (createProductModal as HTMLDialogElement).close();
                        }}
                        type="button"
                        className="btn w-1/3 rounded-none">
                        Close
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="submit" className="btn btn-primary px-8 w-1/2 rounded-none">
                        Submit
                      </button>
                      <button
                        onClick={() => {
                          reset();
                          const createProductModal = document.getElementById("create_product_modal");
                          if (createProductModal) (createProductModal as HTMLDialogElement).close();
                        }}
                        type="button"
                        className="btn w-1/2 rounded-none">
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
