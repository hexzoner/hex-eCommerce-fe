import { useState, useEffect } from "react";
// import LoadingSpinner from "../LoadingSpinner";
import sortTables from "../../utils/sortTables";
import { getLatestArrivals } from "../../api/latest";
import LoadingSpinner from "../../components/LoadingSpinner";
import { ConfirmPopup, LoadingSpinnerPopup } from "./admin-components";
import { useForm, SubmitHandler } from "react-hook-form";
import { createLatestArrival, updateLatestArrival, deleteLatestArrival } from "../../api/latest";
import { toast } from "react-toastify";

export type LatestArrivalInputs = {
  name: string;
  image: string;
  link: string;
};

export interface LatestArrival {
  id: number;
  name: string;
  image: string;
  link: string;
}

export function HomeArrivals() {
  const [latestArrivals, setLatestArrivals] = useState<LatestArrival[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<LatestArrival>({} as LatestArrival);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestArrivals()
      .then((res) => setLatestArrivals(res))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedColors = sortTables(latestArrivals, key, newSortOrder);
    setLatestArrivals(sortedColors);
  };

  function openPopup() {
    const modal = document.getElementById("modal_arrivals");
    if (modal) (modal as HTMLDialogElement).showModal();
  }

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    const deletePopup = document.getElementById("confirmPopup");
    if (deletePopup) (deletePopup as HTMLDialogElement).showModal();
  }

  function handleConfirmDelete() {
    deleteLatestArrival(selectedProduct.id)
      .then(() => {
        const updatedProducts = latestArrivals.filter((product) => product.id !== selectedProduct.id);
        setLatestArrivals(updatedProducts);
        setSelectedProduct({} as LatestArrival);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Oops! Something went wrong deleting the product");
      });

    const modal = document.getElementById("modal_arrivals");
    if (modal) (modal as HTMLDialogElement).close();
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center gap-4">
        <p className="flex justify-center text-2xl my-8">Home Latest Arrivals</p>
        <button onClick={openPopup} className="btn btn-outline btn-sm">
          Add New
        </button>
      </div>

      <table className="table rounded-md table-zebra table-sm w-full shadow-md mb-12 max-w-screen-sm m-auto">
        <thead className="text-sm bg-base-300">
          <tr>
            <th className="font-bold w-1/6">
              <div className="flex gap-1 items-center ">
                <span>ID</span>
                <button title="SortById" className="hover:cursor-pointer" onClick={() => handleSortClick("id")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </button>
              </div>
            </th>
            <th className="font-bold">
              <div className="flex gap-1 items-center">
                <span>Name</span>
                <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("name")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </button>
              </div>
            </th>
            <th className="font-bold">
              <div className="flex gap-1 items-center">
                <span>Product</span>
                <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("product")}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                  </svg>
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {latestArrivals.map((latestArrival) => (
            <tr
              className="cursor-pointer hover"
              key={latestArrival.id}
              onClick={() => {
                setSelectedProduct(latestArrival);
                openPopup();
              }}>
              <td>{latestArrival.id}</td>
              <td>{latestArrival.name}</td>
              <td>{latestArrival.link}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddEditLatestArrival
        product={selectedProduct}
        handleDelete={handleDelete}
        setSelectedProduct={setSelectedProduct}
        setLatestArrivals={setLatestArrivals}
        isLoading={loading}
      />
      <ConfirmPopup confirmText="Are you sure you want to remove this product?" deleteConfirmed={handleConfirmDelete} />
    </div>
  );
}

const AddEditLatestArrival = ({
  product,
  handleDelete,
  setSelectedProduct,
  setLatestArrivals,
  isLoading,
}: {
  product: LatestArrival;
  handleDelete: any;
  setSelectedProduct: any;
  setLatestArrivals: any;
  isLoading: boolean;
}) => {
  const adding = product.name ? false : true;
  const [editMode, setEditMode] = useState(adding);

  useEffect(() => {
    setEditMode(product.name ? false : true);
  }, [product]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LatestArrivalInputs>();

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        link: product.link,
        image: product.image,
      });
    }
  }, [product, editMode, reset]);

  const onSubmit: SubmitHandler<LatestArrivalInputs> = async (data) => {
    // console.log(data);
    if (adding) {
      const response = await createLatestArrival(data);
      if (response) setLatestArrivals((prev: LatestArrival[]) => [...prev, response]);
      closePopup();
    } else {
      const bodyToSend: Partial<LatestArrivalInputs> = {};
      for (const key in data) {
        if (data[key as keyof LatestArrivalInputs] !== product[key as keyof LatestArrivalInputs]) {
          bodyToSend[key as keyof LatestArrivalInputs] = data[key as keyof LatestArrivalInputs];
        }
      }

      if (Object.keys(bodyToSend).length > 0) {
        const response = await updateLatestArrival(bodyToSend, product.id);
        if (response) setLatestArrivals((prev: LatestArrival[]) => prev.map((item) => (item.id === product.id ? response : item)));

        setSelectedProduct({
          name: data.name,
          image: data.image,
          link: data.link,
          id: product.id,
        });
      }

      setEditMode(false);
    }
  };

  function closePopup() {
    setSelectedProduct({
      name: "",
      image: "",
      link: "",
    });
    const modal = document.getElementById("modal_arrivals");
    if (modal) (modal as HTMLDialogElement).close();
  }

  return (
    <dialog id="modal_arrivals" className="modal text-left">
      <div className="modal-box">
        <form method="dialog">
          <button onClick={() => setSelectedProduct({} as LatestArrival)} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        {!isLoading ? (
          <div>
            {!editMode ? (
              <div className="flex flex-col gap-4">
                <h3 className="font-bold text-lg px-8">{product.name}</h3>
                <img src={product.image} alt="product image" />
                <p className="px-8">{product.link}</p>
                <div className="flex justify-start gap-2 mx-8">
                  <button onClick={() => setEditMode(true)} className="btn btn-warning btn-sm ">
                    Edit
                  </button>
                  <button onClick={handleDelete} className="btn btn-error btn-sm ">
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 min-h-72 justify-between pt-6">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col justify-between h-64">
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <label htmlFor="name" className="label min-w-16">
                            Name
                          </label>
                          <input
                            defaultValue={product && product.name?.length > 0 ? product.name : ""}
                            id="name"
                            type="text"
                            className="input input-bordered input-sm w-full "
                            {...register("name", { required: true })}
                          />
                        </div>
                        {errors.name && <span className="text-xs text-error italic">Name is required</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <label htmlFor="image" className="label min-w-16">
                            Image
                          </label>
                          <input
                            defaultValue={product && product.image?.length > 0 ? product.image : ""}
                            id="image"
                            type="text"
                            className="input input-bordered input-sm w-full"
                            {...register("image", { required: true })}
                          />
                        </div>
                        {errors.image && <span className="text-xs text-error italic">Image is required</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <label htmlFor="link" className="label min-w-16">
                            Link
                          </label>
                          <input
                            defaultValue={product && product.link?.length > 0 ? product.link : ""}
                            id="link"
                            type="text"
                            className="input input-bordered input-sm w-full"
                            {...register("link", { required: true })}
                          />
                        </div>
                        {errors.link && <span className="text-xs text-error italic">Link is required</span>}
                      </div>
                    </div>
                    <div className="flex justify-start mx-0 gap-2">
                      <button onClick={() => { }} className="btn btn-warning btn-sm ">
                        Save
                      </button>
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                          e.preventDefault();
                          //   setEditMode(false);
                          closePopup();
                        }}
                        className="btn btn-sm ">
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          <LoadingSpinnerPopup />
        )}
      </div>
    </dialog>
  );
};
