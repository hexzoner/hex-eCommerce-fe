import { useState, useEffect } from "react";
import sortTables from "../../utils/sortTables";
import { getReviews } from "../../api/reviews";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDateFull } from "../../utils/dateUtils";

export interface Review {
  title: string;
  review: string;
  rating: number;
  author: string;
  image: string;
  createdAt: string;
  product: {
    id: number;
    name: string;
  };
  date: string;
}

export default function Reviews() {
  const emptyReview = {
    title: "",
    review: "",
    rating: 0,
    author: "",
    image: "",
    createdAt: "",
    product: {
      id: 0,
      name: "",
    },
    date: "",
  };
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(emptyReview);

  useEffect(() => {
    getReviews()
      .then((res) => {
        setReviews(sortTables(res, "id", "asc"));
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleAddReview() {
    const modal = document.getElementById("editReview_modal");
    if (modal) (modal as HTMLDialogElement).showModal();
  }

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sorted = sortTables(reviews, key, newSortOrder);
    setReviews(sorted);
  };

  function resetReview() {
    setSelectedReview(emptyReview);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen ">
      <div className="w-full flex m-auto justify-center items-center mb-4 gap-4">
        <p className="text-3xl my-6">Reviews</p>
        <button onClick={handleAddReview} className="btn btn-outline btn-sm">
          Add Review
        </button>
      </div>
      <div className="overflow-x-auto rounded-md max-w-7xl m-auto">
        <table className="table rounded-md table-zebra table-sm w-full shadow-md mb-12">
          <thead className="text-sm bg-base-300">
            <tr>
              <th className="font-bold">
                <div className="flex gap-1 items-center">
                  <span>ID</span>
                  <button title="SortById" className="hover:cursor-pointer" onClick={() => handleSortClick("id")}>
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
                  <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("author")}>
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
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("title")}>
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
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("review")}>
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
                  <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("createdAt")}>
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
            {reviews.map((review: any) => (
              <tr
                onClick={() => {
                  setSelectedReview(review);
                  handleAddReview();
                }}
                className="cursor-pointer hover"
                key={review.id}>
                <td>{review.id}</td>
                <td>{review.author}</td>
                <td>{review.title}</td>
                <td>{review.review}</td>
                <td>{formatDateFull(review.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddEditReviewPopup selectedReview={selectedReview} resetReview={resetReview} />
    </div>
  );
}

const AddEditReviewPopup = ({ selectedReview, resetReview }: { selectedReview: Review; resetReview: any }) => {
  if (!selectedReview) return <></>;

  const creatingNewReview = selectedReview.createdAt == "";
  const [editMode, setEditMode] = useState(selectedReview.createdAt == "" ? false : true);

  function handleEdit() {
    setEditMode(true);
  }
  function handleDelete() {}
  function handleSave() {
    setEditMode(false);
  }

  return (
    <>
      <dialog id="editReview_modal" className="modal">
        <div className="modal-box text-left">
          <h3 className="font-bold text-lg">{editMode ? "Edit Review" : creatingNewReview ? "Add Review" : "Review Info"}</h3>

          <p className="py-2">
            Product Id: {selectedReview.product.name} [id = {selectedReview.product.id}]
          </p>
          {editMode || creatingNewReview ? (
            <>
              <label className="input input-bordered flex items-center gap-2">
                Author
                <input type="text" className="grow" placeholder="Enter name here" />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Rating
                <input type="text" className="grow" placeholder="Rating from 0 to 5" />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Title
                <input type="text" className="grow" placeholder="Enter title here.." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Review
                <input type="text" className="grow" placeholder="Enter review here.." />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                Date
                <input type="date" className="grow" />
              </label>
            </>
          ) : (
            <>
              <p className="py-2">Rating: {selectedReview.rating} / 5</p>
              <p className="py-2">Title: {selectedReview.title}</p>
              <p className="py-2">Review: {selectedReview.review}</p>
              <p className="py-2">Author: {selectedReview.author}</p>
              <p className="py-2">Date: {formatDateFull(selectedReview.date)}</p>
            </>
          )}

          <div className="flex py-4">
            {editMode || creatingNewReview ? (
              <>
                <button onClick={handleSave} className="btn btn-success btn-sm rounded-none">
                  Save
                </button>
              </>
            ) : (
              <>
                <button onClick={handleEdit} className="btn btn-warning btn-sm rounded-none">
                  Edit
                </button>
                <button onClick={handleDelete} className="btn btn-error btn-sm rounded-none">
                  Delete
                </button>
              </>
            )}
            <form method="dialog">
              <button
                onClick={() => {
                  resetReview();
                  setEditMode(false);
                }}
                className="btn btn-sm rounded-none">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
