import { useEffect, useState } from "react";
import { Review } from "./reviews";
import { formatDateFull } from "../../utils/dateUtils";
import { useForm } from "react-hook-form";
import { createReview, updateReview, deleteReview } from "../../api/reviews";
import { iCreateReviewAPI } from "../../api/reviews";
import { ConfirmPopup } from "../../components/admin-area/admin-components";
// import LoadingSpinner from "../../components/LoadingSpinner";

const AddEditReviewPopup = ({ selectedReview, resetReview, setReviews }: { selectedReview: Review; resetReview: any; setReviews: any }) => {
  if (!selectedReview) return <></>;

  const creatingNewReview = selectedReview.createdAt == "";
  const [editMode, setEditMode] = useState(selectedReview.createdAt == "" ? false : true);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    //watch,
    reset,
    //   setValue,
    // getValues,
  } = useForm<{
    author: string;
    title: string;
    review: string;
    rating: string;
    date: string;
    product: string;
    image: string;
  }>();

  function resetForm() {
    reset({
      author: selectedReview.author,
      title: selectedReview.title,
      review: selectedReview.review,
      rating: selectedReview.rating,
      date: selectedReview.date ? new Date(selectedReview.date).toISOString().slice(0, 10) : "",
      product: selectedReview.product.name,
      image: selectedReview.image,
    });
    // resetReview();
  }

  useEffect(() => {
    resetForm();
  }, [selectedReview]);

  function handleEdit() {
    setEditMode(true);
  }

  //   function handleSave() {
  //     setEditMode(false);
  //   }

  function handleClose() {
    const modal = document.getElementById("editReview_modal");
    if (modal) (modal as HTMLDialogElement).close();
    resetForm();
    resetReview();
    setEditMode(false);
  }

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    const deletePopup = document.getElementById("confirmPopup");
    if (deletePopup) (deletePopup as HTMLDialogElement).showModal();
  }

  async function handleConfirmDelete() {
    const response = await deleteReview(selectedReview.id);
    if (response && response.status === "success") {
      setReviews((prev: any) => prev.filter((r: any) => r.id !== selectedReview.id));
      handleClose();
    }
  }

  //   console.log(selectedReview);
  async function onSubmit(data: any) {
    // console.log(data);
    setLoading(true);
    const body: iCreateReviewAPI = {
      author: data.author,
      rating: data.rating,
      title: data.title,
      review: data.review,
      image: data.image,
      productId: 1,
      date: data.date,
    };
    if (creatingNewReview) {
      try {
        const response = await createReview(body);
        if (response) {
          //   console.log(response);
          setReviews((prev: any) => [response, ...prev]);
          handleClose();
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      try {
        const response = await updateReview(body, selectedReview.id);
        if (response) {
          //   console.log(response);
          setReviews((prev: any) => {
            const index = prev.findIndex((r: any) => r.id === response.id);
            if (index !== -1) {
              prev[index] = response;
            }
            return prev;
          });
          handleClose();
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  }

  return (
    <>
      <dialog id="editReview_modal" className="modal">
        <div className="modal-box text-left">
          <h3 className="font-bold text-lg">{editMode ? "Edit Review" : creatingNewReview ? "Add Review" : "Review Info"}</h3>

          {!loading && selectedReview ? (
            <div>
              {editMode || creatingNewReview ? (
                <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                  <label className="input input-bordered flex items-center gap-2 rounded-none ">
                    Product:
                    <input type="text" className="grow rounded-none" placeholder="Enter product here" {...register("product", { required: true })} />
                  </label>
                  {errors.product && <p className="text-red-500">{errors.product.message?.toString()}</p>}
                  <label className="input input-bordered flex items-center gap-2 rounded-none ">
                    Author:
                    <input type="text" className="grow rounded-none" placeholder="Enter name here" {...register("author", { required: true })} />
                  </label>
                  {errors.author && <p className="text-red-500">{errors.author.message?.toString()}</p>}
                  <label className="input input-bordered flex items-center gap-2 rounded-none">
                    Rating:
                    <input
                      type="number"
                      className="grow rounded-none"
                      placeholder="Rating from 0 to 5"
                      {...register("rating", {
                        required: true,
                        min: { value: 0, message: "Rating must be between 0 and 5" },
                        max: { value: 5, message: "Rating must be between 0 and 5" },
                      })}
                    />
                  </label>
                  {errors.rating && <span className="text-red-500">{errors.rating.message?.toString()}</span>}
                  <label className="input input-bordered flex items-center gap-2 rounded-none">
                    Title:
                    <input
                      type="text"
                      className="grow rounded-none ml-5"
                      placeholder="Enter title here.."
                      {...register("title", { required: true })}
                    />
                  </label>
                  {errors.title && <span className="text-red-500">{errors.title.message?.toString()}</span>}
                  <label className="flex items-center gap-2 textarea textarea-bordered resize-none rounded-none">
                    Review:
                    <textarea
                      className="grow textarea textarea-bordered resize-none rounded-none h-48"
                      placeholder="Enter review here.."
                      {...register("review", { required: true })}
                    />
                  </label>
                  {errors.review && <span className="text-red-500">{errors.review.message?.toString()}</span>}
                  <label className="input input-bordered flex items-center gap-2 rounded-none">
                    Image:
                    <input
                      type="text"
                      className="grow rounded-none ml-5"
                      placeholder="Enter image URL here.."
                      {...register("image", { required: false })}
                    />
                  </label>
                  {errors.image && <span className="text-red-500">{errors.image.message?.toString()}</span>}
                  <label className="input input-bordered flex items-center gap-2 rounded-none">
                    Date:
                    <input type="date" className="grow rounded-none ml-4" {...register("date", { required: true })} />
                  </label>
                  {errors.date && <span className="text-red-500">{errors.date.message?.toString()}</span>}
                  <>
                    <button type="submit" className="btn btn-success btn-sm rounded-none mt-4">
                      Save
                    </button>
                    <CloseButton handleClose={handleClose} />
                  </>
                </form>
              ) : (
                <>
                  <p className="py-2">
                    Product Id: {selectedReview.product.name} [id = {selectedReview.product.id}]
                  </p>
                  <p className="py-2">Rating: {selectedReview.rating} / 5</p>
                  <p className="py-2">Title: {selectedReview.title}</p>
                  <p className="py-2">Review: {selectedReview.review}</p>
                  <p className="py-2">Author: {selectedReview.author}</p>
                  <p className="py-2">Date: {formatDateFull(selectedReview.date)}</p>
                  {selectedReview.image && <img src={selectedReview.image} alt="Review Image" />}
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="loading loading-dots loading-md"></div>
            </div>
          )}

          <div className="flex py-4">
            {editMode || creatingNewReview ? (
              <>
                {/* <button onClick={handleSave} className="btn btn-success btn-sm rounded-none">
                  Save
                </button> */}
              </>
            ) : (
              <>
                <button onClick={handleEdit} className="btn btn-warning btn-sm rounded-none">
                  Edit
                </button>
                <button onClick={handleDelete} className="btn btn-error btn-sm rounded-none">
                  Delete
                </button>
                <CloseButton handleClose={handleClose} />
              </>
            )}
          </div>
        </div>
        <ConfirmPopup confirmText="Are you sure you want to delete this review?" deleteConfirmed={handleConfirmDelete} />
      </dialog>
    </>
  );
};

export default AddEditReviewPopup;

function CloseButton({ handleClose }: { handleClose: any }) {
  function handleClick(e: any) {
    e.preventDefault();
    handleClose();
  }

  return (
    <button onClick={handleClick} className="btn btn-sm rounded-none">
      Close
    </button>
  );
}
