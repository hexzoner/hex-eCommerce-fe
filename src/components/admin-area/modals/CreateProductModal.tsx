import { Product } from "../Products";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getCategories } from "../../../api/categories";
import { getColors } from "../../../api/colors";
import { getSizes } from "../../../api/sizes";
import { createProduct, updateProduct, deleteProduct } from "../../../api/products";
import { getStyles } from "../../../api/styles";
import { getMaterials } from "../../../api/material";
import { getTechniques } from "../../../api/technique";
import { getShapes } from "../../../api/shapes";
import { getReviews, updateReview } from "../../../api/reviews";
import { getProducers } from "../../../api/producers";
import sortTables from "../../../utils/sortTables";
import { formatDateShort } from "../../../utils/dateUtils";
// import { restoreToken } from "../../utils/storage";
import { ConfirmPopup, LoadingSpinnerSmall } from "../admin-components";
import { FilterDropdown } from "../../Filters";
import { Size } from "../Sizes";
import { Color } from "../Colors";
import Editor from "react-simple-wysiwyg";
import { Review } from "../../../pages/admin/Reviews";
import { iCreateReviewAPI } from "../../../api/reviews";
const dummyRug = "https://th.bing.com/th/id/OIP.MvnwHj_3a0ICmk72FNI5WQHaFR?rs=1&pid=ImgDetMain";

const selectStyle = "select select-bordered w-full select-sm rounded-none";
const inputStyle = "input input-bordered w-full rounded-none input-sm";

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
  const [shapes, setShapes] = useState([]);
  const [techniques, setTechniques] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [styles, setStyles] = useState([]);
  const [producers, setProducers] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [selectedColors, setSelectedColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState(""); // Local state for the WYSIWYG editor
  const [detailsHtml, setDetailsHtml] = useState(""); // Local state for the WYSIWYG editor
  const [notesHtml, setNotesHtml] = useState(""); // Local state for the WYSIWYG editor
  const [instructionsHtml, setInstructionsHtml] = useState(""); // Local state for the WYSIWYG editor

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    // getValues,
  } = useForm<{
    name: string;
    description: string;
    price: number | string;
    category: number | string;
    image: string;
    color: number | string;
    defaultSize: number | string;
    active: boolean;
    details: string;
    notes: string;
    instructions: string;
    producer: number | string;
    style: number | string;
    shape: number | string;
    technique: number | string;
    material: number | string;
  }>();

  const imageInput = watch("image");

  function resetFormToDefault() {
    reset({
      name: product.name,
      description: product.description,
      price: product.isEdit ? product.price : "",
      category: product.isEdit ? product.category.id : "",
      color: product.isEdit ? product.defaultColor.id : "",
      image: product.image,
      defaultSize: product.isEdit ? product.defaultSize.id : "",
      active: product.isEdit ? product.active : true,
      details: product.details,
      notes: product.notes,
      instructions: product.instructions,
      producer: product.isEdit ? product.producer.id : "",
      style: product.isEdit ? product.style.id : "",
      shape: product.isEdit ? product.shape.id : "",
      technique: product.isEdit ? product.technique.id : "",
      material: product.isEdit ? product.material.id : "",
    });

    setSelectedSizes(product.isEdit ? product.sizes.map((s) => ({ id: s.id, name: s.name })) : []);
    setSelectedColors(product.isEdit ? product.colors.map((c) => ({ id: c.id, name: c.name })) : []);
    setDescriptionHtml(product.description);
    setDetailsHtml(product.details);
    setNotesHtml(product.notes);
    setInstructionsHtml(product.instructions);
  }

  useEffect(() => {
    resetFormToDefault();
    if (product.id === 0) return;
    const fetchReviews = async () => {
      try {
        const response = await getReviews({ productId: product.id });
        setReviews(response.reviews);
        // console.log(response);
      } catch (err) {
        console.log(err);
      }
    };

    fetchReviews();
  }, [product]);

  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const shapes = await getShapes();
        setShapes(shapes);
        const materials = await getMaterials();
        setMaterials(materials);
        const styles = await getStyles();
        setStyles(styles);
        const categories = await getCategories();
        setCategories(categories);
        const producers = await getProducers();
        setProducers(producers);
        const colors = await getColors();
        setColors(colors);
        const sizes = await getSizes();
        setSizes(sizes);
        const techniques = await getTechniques();
        setTechniques(techniques);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTaxonomies();
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
    details: string;
    notes: string;
    instructions: string;
    producer: number | string;
    style: number | string;
    shape: number | string;
    technique: number | string;
    material: number | string;
  }) {
    // console.log(data);
    // parsing the data to the correct type before sending it to the server
    const price = typeof data.price === "string" ? parseFloat(data.price) : data.price;
    const category = typeof data.category === "string" ? parseInt(data.category) : data.category;
    const producer = typeof data.producer === "string" ? parseInt(data.producer) : data.producer;
    const color = typeof data.color === "string" ? parseInt(data.color) : data.color;
    const defaultSize = typeof data.defaultSize === "string" ? parseInt(data.defaultSize) : data.defaultSize;
    const style = typeof data.style === "string" ? parseInt(data.style) : data.style;
    const shape = typeof data.shape === "string" ? parseInt(data.shape) : data.shape;
    const technique = typeof data.technique === "string" ? parseInt(data.technique) : data.technique;
    const material = typeof data.material === "string" ? parseInt(data.material) : data.material;
    // console.log({ name: data.name, description: data.description, price, categoryId: category });
    setLoading(true);
    const body = {
      name: data.name,
      description: data.description,
      price,
      categoryId: category,
      image: data.image,
      colors: selectedColors.map((c) => c.id),
      defaultColorId: color,
      sizes: selectedSizes.map((s) => s.id),
      active: data.active === undefined ? false : data.active,
      defaultSize,
      details: data.details,
      notes: data.notes,
      instructions: data.instructions,
      producerId: producer,
      styleId: style,
      shapeId: shape,
      techniqueId: technique,
      materialId: material,
    };
    if (!product.isEdit) {
      try {
        await createProduct(body);
        setUpdate((prev) => !prev);
        handleClose();
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await updateProduct({ ...body, id: product.id });
        setUpdate((prev) => !prev);
        handleClose();
      } catch (err) {
        console.log(err);
      }
    }

    setLoading(false);

    // function closing() {
    //   const popup = document.getElementById("create_product_modal");
    //   if (popup) (popup as HTMLDialogElement).close();
    //   reset();
    //   // window.location.reload(); //refresh the page
    //   // setProducts(await getProducts(restoreToken()));
    // }
  }

  function onDescriptionChange(e: any) {
    setDescriptionHtml(e.target.value);
    setValue("description", e.target.value); // Update the react-hook-form description field
  }
  function onDetailsChange(e: any) {
    setDetailsHtml(e.target.value);
    setValue("details", e.target.value); // Update the react-hook-form description field
  }
  function onNotesChange(e: any) {
    setNotesHtml(e.target.value);
    setValue("notes", e.target.value); // Update the react-hook-form description field
  }
  function onInstructionsChange(e: any) {
    setInstructionsHtml(e.target.value);
    setValue("instructions", e.target.value); // Update the react-hook-form description field
  }

  function handleClose() {
    resetFormToDefault();
    const createProductModal = document.getElementById("create_product_modal");
    if (createProductModal) (createProductModal as HTMLDialogElement).close();
  }

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sorted = sortTables(reviews, key, newSortOrder);
    setReviews(sorted);
  };

  async function handleFeatuedCheckboxChange(e: any, review: Review) {
    const body: iCreateReviewAPI = {
      author: review.author,
      rating: review.rating,
      title: review.title,
      review: review.review,
      featured: e.target.checked,
      productId: product.id,
      image: review.image,
      date: review.date,
    };

    setReviews((prev) =>
      prev.map((r: Review) => {
        if (r.id === review.id) {
          return { ...r, featured: e.target.checked };
        }
        return r;
      })
    );
    await updateReview(body, review.id);
    // console.log(res);
  }

  return (
    <>
      <dialog id="create_product_modal" className="modal">
        <div className="modal-box w-full max-w-[90%]">
          {!loading ? (
            <div className="m-auto text-left w-full">
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 min-h-[85vh] relative">
                <div className="mx-2 mb-4 text-lg flex justify-between">
                  <p className="w-full">{product.isEdit ? "Editing product" : "Creating product"}</p>
                  {/* Buttons */}
                  <div className="flex w-full justify-end relative bottom-0">
                    {product.isEdit ? (
                      <>
                        <button onClick={handleDelete} className="btn btn-error w-1/5 rounded-none">
                          Delete
                        </button>
                        <button type="submit" className="btn btn-success w-1/5  rounded-none">
                          Update
                        </button>
                        <button onClick={handleClose} type="button" className="btn w-1/5 rounded-none">
                          Close
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="submit" className="btn btn-primary px-8 w-1/5 rounded-none">
                          Submit
                        </button>
                        <button onClick={handleClose} type="button" className="btn w-1/5 rounded-none">
                          Close
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div role="tablist" className="tabs tabs-bordered">
                  {/* Tab 1 */}
                  <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Main" defaultChecked />
                  <div role="tabpanel" className="tab-content p-10">
                    <div className="flex gap-6">
                      <div className="w-1/2 flex flex-col gap-6 ">
                        <div>
                          <input
                            type="text"
                            className={inputStyle}
                            placeholder="Enter a product name"
                            autoComplete="off"
                            {...register("name", {
                              required: "Name is required",
                            })}
                          />
                          {errors.name && <p className="font-semibold text-error text-xs text-left ">{errors.name.message?.toString()}</p>}
                        </div>

                        <div>
                          <select
                            className={selectStyle}
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
                            <p className="text-error text-xs text-left right-8 font-semibold">{errors.category.message?.toString()}</p>
                          )}
                        </div>

                        <div>
                          <select
                            className={selectStyle}
                            {...register("style", {
                              required: "Style is required",
                            })}>
                            <option value="">Select a style</option>
                            {styles.map((style: any) => {
                              return (
                                <option key={style.id} value={style.id}>
                                  {style.name}
                                </option>
                              );
                            })}
                          </select>
                          {errors.style && <p className="text-error text-xs text-left right-8 font-semibold">{errors.style.message?.toString()}</p>}
                        </div>

                        <div>
                          <select
                            className={selectStyle}
                            {...register("shape", {
                              required: "Shape is required",
                            })}>
                            <option value="">Select a shape</option>
                            {shapes.map((shape: any) => {
                              return (
                                <option key={shape.id} value={shape.id}>
                                  {shape.name}
                                </option>
                              );
                            })}
                          </select>
                          {errors.shape && <p className="text-error text-xs text-left right-8 font-semibold">{errors.shape.message?.toString()}</p>}
                        </div>

                        <div>
                          <select
                            className={selectStyle}
                            {...register("technique", {
                              required: "Technique is required",
                            })}>
                            <option value="">Select a technique</option>
                            {techniques.map((technique: any) => {
                              return (
                                <option key={technique.id} value={technique.id}>
                                  {technique.name}
                                </option>
                              );
                            })}
                          </select>
                          {errors.technique && (
                            <p className="text-error text-xs text-left right-8 font-semibold">{errors.technique.message?.toString()}</p>
                          )}
                        </div>

                        <div>
                          <select
                            className={selectStyle}
                            {...register("material", {
                              required: "Material is required",
                            })}>
                            <option value="">Select a material</option>
                            {materials.map((material: any) => {
                              return (
                                <option key={material.id} value={material.id}>
                                  {material.name}
                                </option>
                              );
                            })}
                          </select>
                          {errors.material && (
                            <p className="text-error text-xs text-left right-8 font-semibold">{errors.material.message?.toString()}</p>
                          )}
                        </div>

                        <div>
                          <select
                            className={selectStyle}
                            {...register("producer", {
                              required: "Producer is required",
                            })}>
                            <option value="">Select a producer</option>
                            {producers.map((producer: any) => {
                              return (
                                <option key={producer.id} value={producer.id}>
                                  {producer.name}
                                </option>
                              );
                            })}
                          </select>
                          {errors.producer && (
                            <p className="text-error text-xs text-left right-8 font-semibold">{errors.producer.message?.toString()}</p>
                          )}
                        </div>

                        <div>
                          <input
                            type="text"
                            className={inputStyle}
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
                            className={selectStyle}
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
                            className={selectStyle}
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
                      </div>
                    </div>
                  </div>

                  {/* Tab 2 */}
                  <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Details" />
                  <div role="tabpanel" className="tab-content p-10 w-full ">
                    <div className=" grid grid-cols-2 gap-3">
                      <div className="">
                        <label className="block text-sm font-medium ">Description</label>
                        <div className="prose">
                          <Editor
                            style={{ minHeight: "400px" }}
                            value={descriptionHtml}
                            onChange={onDescriptionChange}
                            className="input input-bordered w-full pt-1 h-96"
                          />
                        </div>
                        <div>
                          <input
                            className="h-0 w-0 opacity-0 absolute bottom-0"
                            autoComplete="off"
                            {...register("description", {
                              required: "Description is required",
                              maxLength: {
                                value: 2000,
                                message: "Description cannot exceed 2000 characters",
                              },
                            })}
                          />
                          {errors.description && (
                            <p className="font-semibold text-error text-xs text-left ">{errors.description.message?.toString()}</p>
                          )}
                        </div>
                      </div>

                      <div className="">
                        <label className="block text-sm font-medium ">Details</label>
                        <div className="prose">
                          <Editor
                            style={{ minHeight: "400px" }}
                            value={detailsHtml}
                            onChange={onDetailsChange}
                            className="input input-bordered w-full pt-1 h-96"
                          />
                        </div>
                        <div>
                          <input
                            className="h-0 w-0 opacity-0 absolute bottom-0"
                            autoComplete="off"
                            {...register("details", {
                              required: "Details are required",
                              maxLength: {
                                value: 2000,
                                message: "Details cannot exceed 2000 characters",
                              },
                            })}
                          />
                          {errors.details && <p className="font-semibold text-error text-xs text-left ">{errors.details.message?.toString()}</p>}
                        </div>
                      </div>

                      <div className="">
                        <label className="block text-sm font-medium ">Notes</label>
                        <div className="prose">
                          <Editor
                            style={{ minHeight: "400px" }}
                            value={notesHtml}
                            onChange={onNotesChange}
                            className="input input-bordered w-full pt-1 h-96"
                          />
                        </div>
                        <div>
                          <input
                            className="h-0 w-0 opacity-0 absolute bottom-0"
                            autoComplete="off"
                            {...register("notes", {
                              required: "Notes are required",
                              maxLength: {
                                value: 2000,
                                message: "Notes cannot exceed 2000 characters",
                              },
                            })}
                          />
                          {errors.notes && <p className="font-semibold text-error text-xs text-left ">{errors.notes.message?.toString()}</p>}
                        </div>
                      </div>

                      <div className="">
                        <label className="block text-sm font-medium">Instructions</label>
                        <div className="prose">
                          <Editor
                            style={{ minHeight: "400px" }}
                            value={instructionsHtml}
                            onChange={onInstructionsChange}
                            className="input input-bordered w-full pt-1 h-96"
                          />
                        </div>
                        <div>
                          <input
                            className="h-0 w-0 opacity-0 absolute bottom-0"
                            autoComplete="off"
                            {...register("instructions", {
                              required: "Instructions are required",
                              maxLength: {
                                value: 2000,
                                message: "Instructions cannot exceed 2000 characters",
                              },
                            })}
                          />
                          {errors.instructions && (
                            <p className="font-semibold text-error text-xs text-left ">{errors.instructions.message?.toString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tab 3 */}
                  <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Images" />
                  <div role="tabpanel" className="tab-content p-10">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-center">
                        <img
                          src={product.image?.length > 0 ? product.image : imageInput && imageInput.length > 0 ? imageInput : dummyRug}
                          alt="product"
                          className="h-64"
                        />
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
                    </div>
                  </div>

                  {/* Tab 4 */}
                  <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Reviews" />
                  <div role="tabpanel" className="tab-content p-10">
                    <div>
                      <table className="table rounded-md table-zebra table-sm w-full shadow-md mb-12">
                        <thead className="text-sm bg-base-300">
                          <tr>
                            <th className="font-bold">
                              <div className="flex gap-1 items-center">
                                <span>Featured</span>
                                <button
                                  title="Sort"
                                  className="hover:cursor-pointer"
                                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSortClick("featured", e)}>
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
                                <span>Author</span>
                                <button
                                  title="SortByEmail"
                                  className="hover:cursor-pointer"
                                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSortClick("author", e)}>
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
                                <span>Rating</span>
                                <button
                                  title="Sort"
                                  className="hover:cursor-pointer"
                                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSortClick("rating", e)}>
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
                                <span>Title</span>
                                <button
                                  title="Sort"
                                  className="hover:cursor-pointer"
                                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSortClick("title", e)}>
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
                                <span>Comment</span>
                                <button
                                  title="Sort"
                                  className="hover:cursor-pointer"
                                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSortClick("review", e)}>
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
                                <span>Date</span>
                                <button
                                  title="SortByEmail"
                                  className="hover:cursor-pointer"
                                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSortClick("date", e)}>
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
                          {reviews.map((review: Review) => (
                            <tr
                              onClick={() => {
                                // setSelectedReview(review);
                                // handleAddReview();
                              }}
                              className="cursor-pointer hover"
                              key={review.id}>
                              <td>
                                <input
                                  onChange={(e) => handleFeatuedCheckboxChange(e, review)}
                                  type="checkbox"
                                  className="checkbox"
                                  checked={review.featured ? true : false}
                                />
                              </td>
                              <td>{review.author}</td>
                              <td>{review.rating} </td>
                              <td>{review.title}</td>
                              <td>{review.review}</td>
                              <td>{formatDateShort(review.date)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
