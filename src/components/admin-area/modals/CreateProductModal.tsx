import { Product } from "../Products";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createProduct, updateProduct, deleteProduct } from "../../../api/products";
import { getReviews, updateReview } from "../../../api/reviews";
import sortTables from "../../../utils/sortTables";
import { formatDateShort } from "../../../utils/dateUtils";
import { ConfirmPopup, LoadingSpinnerSmall } from "../admin-components";
import { FilterDropdown } from "../../Filters";
import { Size } from "../Sizes";
import Editor from "react-simple-wysiwyg";
import { Review } from "../../../pages/admin/Reviews";
import { iCreateReviewAPI } from "../../../api/reviews";
import { useShop } from "../../../context";
import { iRoom } from "../../../utils/constants";
import { iTaxonomy } from "../../../pages/admin/Taxonomies";
import { uploadImageToS3 } from "../../../api/image-upload";
import { deletePattern } from "../../../api/patterns";
import { getProductPricesByProductId } from "../../../api/productPrices";

// const dummyRug = "https://th.bing.com/th/id/OIP.MvnwHj_3a0ICmk72FNI5WQHaFR?rs=1&pid=ImgDetMain";

const selectStyle = "select select-bordered w-full select-sm rounded-none";
const inputStyle = "input input-bordered w-full rounded-none input-sm";

export interface iPattern {
  id: number;
  name: string;
  icon: string;
  active: boolean;
  images: iPatternImage[];
  iconFile?: File;
  order: number;
}

interface iPatternImage {
  id: number;
  imageURL: string;
  file: File;
  order?: number;
}

enum PatternMode {
  View,
  Add,
  Edit,
}

export function CreateProductModal({
  product,
  setProducts,
  setUpdate,
}: {
  product: Product;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const markupTable = "table rounded-md table-zebra table-sm w-full shadow-md mb-12";
  const markupTableHead = "text-sm bg-base-300";
  const markupTableHeadCell = "font-bold";

  const { categories, techniques, shapes, producers, colors, sizes, materials, styles, rooms, features } = useShop();

  const [productPrices, setProductPrices] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Size[]>([]);
  const [selectedColors, setSelectedColors] = useState<iTaxonomy[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<iRoom[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState(""); // Local state for the WYSIWYG editor
  const [detailsHtml, setDetailsHtml] = useState(""); // Local state for the WYSIWYG editor
  const [notesHtml, setNotesHtml] = useState(""); // Local state for the WYSIWYG editor
  const [instructionsHtml, setInstructionsHtml] = useState(""); // Local state for the WYSIWYG editor
  const [patternMode, setPatternMode] = useState<PatternMode>(PatternMode.View);
  const [patterns, setPatterns] = useState<iPattern[]>(product.patterns);
  const [pattern, setPattern] = useState<iPattern>({
    id: Math.floor(Math.random() * 1000),
    name: "",
    icon: "",
    active: true,
    images: [],
    order: patterns.length + 1,
    // iconFile: new File([""], "filename"),
  });
  const [patternErrors, setPatternErrors] = useState({
    name: "",
    icon: "",
    images: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    // watch,
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
    new: boolean;
    bestSeller: boolean;
  }>();

  // const imageInput = watch("image");
  function resetFormToDefault() {
    // console.log(product);
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
      new: product.isEdit ? product.new : false,
      bestSeller: product.isEdit ? product.bestSeller : false,
    });
    setSelectedSizes(product.isEdit ? product.sizes.map((x) => ({ id: x.id, name: x.name, squareMeters: x.squareMeters })) : []);
    setSelectedColors(product.isEdit ? product.colors.map((x) => ({ id: x.id, name: x.name, image: x.image })) : []);
    setSelectedRooms(product.isEdit ? product.rooms.map((x) => ({ id: x.id, name: x.name })) : []);
    setSelectedFeatures(product.isEdit ? product.features.map((x) => ({ id: x.id, name: x.name, image: x.image })) : []);
    setDescriptionHtml(product.description);
    setDetailsHtml(product.details);
    setNotesHtml(product.notes);
    setInstructionsHtml(product.instructions);
  }

  useEffect(() => {
    setLoading(true);
    resetFormToDefault();
    if (product.id === 0) return;
    const fetchReviews = async () => {
      try {
        const response = await getReviews({ productId: product.id });
        setReviews(response.reviews);
        const productPrices = await getProductPricesByProductId({ productId: product.id });
        setProductPrices(productPrices);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    setPatterns(product.patterns);
    // console.log(product.patterns);

    fetchReviews();
  }, [product]);

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    const deletePopup = document.getElementById("confirmPopupDeleteProduct");
    if (deletePopup) (deletePopup as HTMLDialogElement).showModal();
  }

  async function handleConfirmDelete() {
    // console.log("Deleting product " + product.id);
    await deleteProduct(product.id);
    const deletePopup = document.getElementById("confirmPopupDeleteProduct");
    if (deletePopup) (deletePopup as HTMLDialogElement).close();
    const productModal = document.getElementById("create_product_modal");
    if (productModal) (productModal as HTMLDialogElement).close();
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
    new: boolean;
    bestSeller: boolean;
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
      rooms: selectedRooms.map((r) => r.id),
      features: selectedFeatures.map((f) => f.id),
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
      new: data.new,
      bestSeller: data.bestSeller,
    };

    if (!product.isEdit) {
      try {
        const _patterns = patterns;
        for (const p of _patterns) {
          const iconUrl = await uploadImageToS3(p.iconFile);
          p.icon = iconUrl;
          const _images = p.images;
          for (const i of _images) {
            const imageUrl = await uploadImageToS3(i.file);
            i.imageURL = imageUrl;
          }
        }

        const res = await createProduct({ ...body, patterns });
        if (res.id) {
          setUpdate((prev) => !prev);
          handleClose();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        // let patternsChanged = false;
        const _patterns = patterns;
        for (const p of _patterns) {
          if (!p.icon.startsWith("https://")) {
            const iconUrl = await uploadImageToS3(p.iconFile);
            p.icon = iconUrl;
            // patternsChanged = true;
          }
          const _images = p.images;
          for (const i of _images) {
            if (i.imageURL.startsWith("https://")) {
              continue;
            }
            // if (i.imageURL === "deleted") {
            //   patternsChanged = true;
            //   p.images = p.images.filter((x) => x.id !== i.id);
            //   continue;
            // }
            const imageUrl = await uploadImageToS3(i.file);
            i.imageURL = imageUrl;
            // patternsChanged = true;
          }
        }
        // if (patternsChanged) {
        //   // console.log("Patterns changed");
        //   setPatterns(_patterns);
        //   await updateProduct({
        //     ...body,
        //     id: product.id,
        //     patterns: _patterns,
        //   });
        // } else await updateProduct({ ...body, id: product.id });

        await updateProduct({
          ...body,
          id: product.id,
          patterns: _patterns,
        });

        setUpdate((prev) => !prev);
        handleClose();
      } catch (err) {
        console.log(err);
      }
    }

    setLoading(false);
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
    setPatternMode(PatternMode.View);
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
      <dialog id="create_product_modal" className="modal ">
        <div className="modal-box w-full max-w-[90%] ">
          {!loading ? (
            <div className="m-auto text-left w-full">
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 min-h-[85vh] relative">
                <div className="mx-2 mb-4 text-lg flex justify-between">
                  <p className="w-full">{product.isEdit ? "Editing product: " + product.name : "Creating product"}</p>
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
                  {/* Tab 1 - Main*/}
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
                          <p className="text-sm">Is Active?</p>
                          <input type="checkbox" className="h-5 w-5 text-primary checkbox-sm" {...register("active")} />
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-sm">Is New?</p>
                          <input type="checkbox" className="h-5 w-5 text-primary checkbox-sm" {...register("new")} />
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="text-sm">Is Best Seller?</p>
                          <input type="checkbox" className="h-5 w-5 text-primary checkbox-sm" {...register("bestSeller")} />
                        </div>
                      </div>

                      <div className="w-1/2 flex flex-col gap-6">
                        <FilterDropdown
                          name="Rooms"
                          options={rooms}
                          setSelected={setSelectedRooms}
                          selected={selectedRooms}
                          selectedRemoved={selectedRooms}
                        />

                        <FilterDropdown
                          name="Features"
                          options={features}
                          setSelected={setSelectedFeatures}
                          selected={selectedFeatures}
                          selectedRemoved={selectedFeatures}
                        />

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

                  {/* Tab 2 - Details */}
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

                  {/* Tab 3 - Patterns */}
                  <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Images" />
                  <div role="tabpanel" className="tab-content p-10">
                    <PatternsTab
                      pattern={pattern}
                      setPattern={setPattern}
                      patterns={patterns}
                      setPatterns={setPatterns}
                      setPatternMode={setPatternMode}
                      patternMode={patternMode}
                      setPatternErrors={setPatternErrors}
                      patternErrors={patternErrors}
                      product={product}
                    />
                  </div>

                  {/* Tab 4 - Reviews */}
                  <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Reviews" />
                  <div role="tabpanel" className="tab-content p-10">
                    <div>
                      <table className={markupTable}>
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

                  {/* Tab 5 */}
                  <input type="radio" name="my_tabs_1" role="tab" className="tab " aria-label="Prices" />
                  <div role="tabpanel" className="tab-content p-10">
                    <div className="flex flex-col gap-4">
                      {/* <p>{product.stripeProductId}</p> */}
                      <table className={markupTable}>
                        <thead className={markupTableHead + " text-center"}>
                          <tr>
                            <th className={markupTableHeadCell}>
                              <div className="flex gap-1 items-center">
                                <span>Size</span>
                              </div>
                            </th>
                            <th className={markupTableHeadCell}>
                              <div className="flex gap-1 items-center ">
                                <span>SquareMeters</span>
                              </div>
                            </th>
                            <th className={markupTableHeadCell}>
                              <div className="flex gap-1 items-center ">
                                <span>Price</span>
                                {/* <button
                                  title="Sort"
                                  className="hover:cursor-pointer"
                                  onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleSortClick("sizes.squareMeters", e)}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                  </svg>
                                </button> */}
                              </div>
                            </th>
                            <th className={markupTableHeadCell}>
                              <div className="flex gap-1 items-center ">
                                <span>StripePriceId</span>
                              </div>
                            </th>
                            <th className={markupTableHeadCell}>
                              <div className="flex gap-1 items-center ">
                                <span>StripeProductId</span>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="">
                          {/* {selectedSizes.map((size) => (
                            <tr key={size.id}>
                              <td>{size.name}</td>
                              <td>€{size.squareMeters * product.price}</td>
                            </tr>
                          ))}  */}
                          {productPrices.map((price) => (
                            <tr key={price.id}>
                              <td>{price.size.name}</td>
                              <td>{price.size.squareMeters}</td>
                              <td>€{price.price > 0 ? price.price / 100 : 0}</td>
                              <td>€{price.stripePriceId}</td>
                              <td>€{price.stripeProductId}</td>
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
      <ConfirmPopup
        popupId="confirmPopupDeleteProduct"
        confirmText="Are you sure you want to delete this product?"
        deleteConfirmed={handleConfirmDelete}
      />
    </>
  );
}

import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRef } from "react";

const DraggableRow = ({
  pattern,
  index,
  moveRow,
  setPattern,
  setPatternMode,
  draggingIndex,
  setDraggingIndex,
}: {
  pattern: iPattern;
  index: number;
  moveRow: (fromIndex: number, toIndex: number) => void;
  setPattern: React.Dispatch<React.SetStateAction<iPattern>>;
  setPatternMode: React.Dispatch<React.SetStateAction<PatternMode>>;
  draggingIndex: number | null;
  setDraggingIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const initialIndexRef = useRef(index);

  const [, ref] = useDrag({
    type: "ROW",
    item: () => {
      setDraggingIndex(index);
      initialIndexRef.current = index;
      return { index };
    },
    end: () => {
      // console.log("useDrag - End dragging");
      setDraggingIndex(null);
    }, // Reset dragging index on drag end
  });

  const [, drop] = useDrop({
    accept: "ROW",
    hover(item: { index: number }) {
      if (item.index !== index && draggingIndex !== index) {
        // console.log("item.index:", item.index, "index:", index, "draggingIndex:", draggingIndex, "initialIndexRef:", initialIndexRef.current);
        moveRow(item.index, index);
        item.index = index; // Update to the new index
        setDraggingIndex(index); // Set the current dragging index
      }
    },
  });

  function handleDelete(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setPattern(pattern);
    const deletePopup = document.getElementById("confirmDeletePattern");
    if (deletePopup) (deletePopup as HTMLDialogElement).showModal();
  }

  function handleClick() {
    setPattern(pattern);
    setPatternMode(PatternMode.Edit);
  }

  return (
    <tr ref={(node) => ref(drop(node))} className="hover cursor-pointer" onClick={handleClick}>
      <td>
        <img
          src={pattern.images.length > 0 ? pattern.images[0].imageURL : "https://placehold.co/300"}
          alt={"Image"}
          className="h-24 w-24 object-cover"
        />
      </td>
      <td>{pattern.name}</td>
      <td>
        <img src={pattern.icon} alt={"Icon"} className="h-16 w-16 rounded-full object-cover" />
      </td>
      <td>
        <p>{pattern.active ? "Active" : "Inactive"}</p>
      </td>
      <td className="w-1/12 pointer-events-none">
        <button onClick={handleDelete} className="btn btn-sm btn-warning pointer-events-auto">
          Delete
        </button>
      </td>
    </tr>
  );
};

const DraggableImage = ({
  image,
  index,
  moveRow,
  draggingIndex,
  setDraggingIndex,
  setPattern,
}: {
  image: iPatternImage;
  index: number;
  moveRow: (fromIndex: number, toIndex: number) => void;
  setPattern: React.Dispatch<React.SetStateAction<iPattern>>;
  // setPatternMode: React.Dispatch<React.SetStateAction<PatternMode>>;
  draggingIndex: number | null;
  setDraggingIndex: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const initialIndexRef = useRef(index);
  const [, ref] = useDrag({
    type: "ROW",
    item: () => {
      setDraggingIndex(index);
      initialIndexRef.current = index;
      return { index };
    },
    end: () => {
      setDraggingIndex(null);
    },
  });

  const [, drop] = useDrop({
    accept: "ROW",
    hover(item: { index: number }) {
      if (item.index !== index && draggingIndex !== index) {
        // console.log("item.index:", item.index, "index:", index, "draggingIndex:", draggingIndex, "initialIndexRef:", initialIndexRef.current);
        moveRow(item.index, index);
        item.index = index; // Update to the new index
        setDraggingIndex(index); // Set the current dragging index
      }
    },
  });

  function handDeletePatternImage(e: any, image: iPatternImage) {
    e.preventDefault();

    setPattern((prevPattern) => {
      return {
        ...prevPattern,
        images: prevPattern.images.filter((img) => img.id !== image.id),
      };
    });
  }

  return (
    <div ref={(node) => ref(drop(node))} key={index} className="relative">
      <div>
        <img src={image.imageURL} alt="Pattern" className="h-48 w-48 rounded-none object-cover" />
        <button
          onClick={(e: any) => handDeletePatternImage(e, image)}
          className="absolute top-0 right-0 btn btn-neutral w-8 h-6 btn-sm rounded-none p-0 text-white">
          X
        </button>
      </div>
    </div>
  );
};

function PatternsTab({
  pattern,
  patterns,
  setPatterns,
  setPattern,
  setPatternMode,
  patternMode,
  setPatternErrors,
  patternErrors,
}: {
  pattern: iPattern;
  product: Product;
  setPatterns: React.Dispatch<React.SetStateAction<iPattern[]>>;
  patterns: iPattern[];
  setPattern: React.Dispatch<React.SetStateAction<iPattern>>;
  setPatternMode: React.Dispatch<React.SetStateAction<PatternMode>>;
  patternMode: PatternMode;
  setPatternErrors: React.Dispatch<React.SetStateAction<{ name: string; icon: string; images: string }>>;
  patternErrors: { name: string; icon: string; images: string };
}) {
  function handleAddPattern(e: any) {
    setPattern({
      name: "",
      icon: "",
      active: true,
      images: [],
      id: Math.floor(Math.random() * 1000),
      order: patterns.length,
    });
    e.preventDefault();
    setPatternMode(PatternMode.Add);
  }

  function handleSavePattern(e: any) {
    e.preventDefault();
    const errors = { name: "", icon: "", images: "" };
    const patternImages = pattern.images.filter((x) => x.imageURL !== "deleted");
    if (pattern.name.length == 0) errors.name = "Pattern name is required";
    if (pattern.icon.length == 0) errors.icon = "Pattern icon is required";
    if (patternImages.length == 0) errors.images = "Pattern images are required";
    setPatternErrors(errors);
    if (errors.name.length > 0 || errors.icon.length > 0 || errors.images.length > 0) return;

    if (patternMode === PatternMode.Add) setPatterns((prev) => [...prev, pattern]);
    else setPatterns((prev) => prev.map((x) => (x.id === pattern.id ? pattern : x)));

    setPattern({
      name: "",
      icon: "",
      active: true,
      images: [],
      id: Math.floor(Math.random() * 1000),
      order: patterns.length,
    });
    setPatternMode(PatternMode.View);
    // console.log(pattern);
  }

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const moveRow = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updatedPatterns = [...patterns];
    const movedItem = updatedPatterns.splice(fromIndex, 1);
    movedItem[0].order = toIndex;
    updatedPatterns.splice(toIndex, 0, movedItem[0]);

    setPatterns(updatedPatterns);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updatedImages = [...pattern.images];
    const movedItem = updatedImages.splice(fromIndex, 1);
    movedItem[0].order = toIndex;
    updatedImages.splice(toIndex, 0, movedItem[0]);

    setPattern({ ...pattern, images: updatedImages });
  };

  async function handleConfirmDeletePattern(e: any) {
    e.preventDefault();
    setPatterns((prev) => prev.filter((x) => x.id !== pattern.id));
    await deletePattern(pattern.id);
    const popup = document.getElementById("confirmDeletePattern");
    if (popup) (popup as HTMLDialogElement).close();
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col gap-4 max-w-screen-lg m-auto">
        {patternMode == PatternMode.View ? (
          <button onClick={handleAddPattern} className="btn btn-primary max-w-sm self-end rounded-none">
            Add Pattern
          </button>
        ) : (
          <div className="flex self-end">
            <button onClick={handleSavePattern} className="btn btn-success max-w-sm self-end rounded-none">
              Save
            </button>
            <button onClick={() => setPatternMode(PatternMode.View)} className="btn max-w-sm self-end rounded-none">
              Cancel
            </button>
          </div>
        )}
        {/* View Mode */}
        {patternMode === PatternMode.View ? (
          <div>
            <table className="table rounded-md table-zebra table-sm w-full shadow-md mb-12">
              <thead className="text-sm bg-base-300">
                <tr>
                  <th className="font-bold">Image</th>
                  <th className="font-bold">Name</th>
                  <th className="font-bold">Icon</th>
                  <th className="font-bold">Active</th>
                  <th className="font-bold"></th>
                </tr>
              </thead>
              <tbody>
                {patterns.map((pattern: iPattern, index) => {
                  pattern.order = index;
                  return (
                    <DraggableRow
                      key={pattern.id}
                      pattern={pattern}
                      index={index}
                      moveRow={moveRow}
                      setPattern={setPattern}
                      setPatternMode={setPatternMode}
                      draggingIndex={draggingIndex}
                      setDraggingIndex={setDraggingIndex}
                    />
                  );
                })}
              </tbody>
            </table>
            <ConfirmPopup
              popupId="confirmDeletePattern"
              confirmText="Are you sure you want to delete this pattern?"
              deleteConfirmed={handleConfirmDeletePattern}
            />
          </div>
        ) : (
          // Edit Mode
          <div className="flex flex-col gap-8 text-sm font-semibold">
            <label htmlFor="patternName">Pattern Name</label>
            <div className="flex justify-between gap-4">
              <div className="w-3/4">
                <input
                  type="text"
                  className="input input-bordered w-full input-sm"
                  placeholder="Pattern Name"
                  autoComplete="off"
                  id="patternName"
                  onChange={(e) => {
                    setPatternErrors({ ...patternErrors, name: "" });
                    setPattern({ ...pattern, name: e.target.value });
                  }}
                  value={pattern.name}
                />
                {patternErrors.name.length > 0 && <p className="font-semibold text-error text-xs text-left ">{patternErrors.name}</p>}
              </div>
              <div className="flex items-center gap-4 w-1/4 m-auto">
                <p className="text-sm">Is Active?</p>
                <input
                  checked={pattern.active}
                  title="active"
                  type="checkbox"
                  className="h-5 w-5 text-primary checkbox-sm"
                  onChange={(e) => {
                    setPattern({ ...pattern, active: e.target.checked });
                  }}
                />
              </div>
            </div>

            <label htmlFor="patternIcon">Pattern Icon</label>
            {pattern.icon && <img className="h-24 w-24 rounded-full object-cover" src={pattern.icon} alt="Pattern icon" />}
            <div>
              <input
                id="patternIcon"
                type="file"
                accept="image/*"
                className="file-input file-input-xs file-input-bordered w-full max-w-xs rounded-none"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPatternErrors({ ...patternErrors, icon: "" });
                    setPattern({
                      ...pattern,
                      icon: URL.createObjectURL(file),
                      iconFile: file, // Store the File object for later use (e.g., for upload)
                    });
                  }
                }}
              />
              {patternErrors.icon.length > 0 && <p className="font-semibold text-error text-xs text-left ">{patternErrors.icon}</p>}
            </div>

            <div>
              {patternErrors.images.length > 0 && <p className="font-semibold text-error text-xs text-left ">{patternErrors.images}</p>}
              <p className="w-full border-b-[1.5px] border-black">Pattern Images</p>
              <div className="flex gap-4 flex-wrap py-4">
                {pattern.images.map((image, index) => {
                  image.order = index;
                  return (
                    // <div key={index} className="relative">
                    //   <div>
                    //     <img src={image.imageURL} alt="Pattern" className="h-48 w-48 rounded-none object-cover" />
                    //     <button
                    //       onClick={(e: any) => handDeletePatternImage(e, image)}
                    //       className="absolute top-0 right-0 btn btn-neutral w-8 h-6 btn-sm rounded-none p-0 text-white">
                    //       X
                    //     </button>
                    //   </div>
                    // </div>
                    <DraggableImage
                      key={index}
                      image={image}
                      index={index}
                      moveRow={moveImage}
                      draggingIndex={draggingIndex}
                      setDraggingIndex={setDraggingIndex}
                      setPattern={setPattern}
                    />
                  );
                })}
                <label htmlFor="pattern_image" className="btn btn-neutral rounded-none btn-lg w-48 h-48 text-3xl">
                  +
                </label>
                <input
                  id="pattern_image"
                  type="file"
                  accept="image/*"
                  className="file-input file-input-sm file-input-bordered opacity-0"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPatternErrors({ ...patternErrors, images: "" });
                      const newImage = {
                        ...pattern,
                        images: [
                          ...pattern.images,
                          {
                            id: Math.floor(Math.random() * 1000),
                            imageURL: URL.createObjectURL(file),
                            file: file, // Store the File object for later use (e.g., for upload)
                            order: pattern.images.length,
                          },
                        ],
                      };
                      // console.log(pattern.images.length);
                      // console.log(newImage);
                      setPattern(newImage);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
