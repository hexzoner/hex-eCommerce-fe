import { useState, useEffect } from "react";
import sortTables from "../../utils/sortTables";
import { getReviews } from "../../api/reviews";
import { getProducts } from "../../api/products";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDateShort } from "../../utils/dateUtils";
import AddEditReviewPopup from "./AddEditReviewPopup";
import Pagination from "../../components/Pagination";

export interface Review {
  title: string;
  review: string;
  rating: string;
  author: string;
  image: string;
  createdAt: string;
  product: {
    id: number;
    name: string;
  };
  date: string;
  id: number;
  featured: boolean;
}

export default function Reviews() {
  const emptyReview = {
    id: 0,
    title: "",
    review: "",
    rating: "",
    author: "",
    image: "",
    createdAt: "",
    product: {
      id: 0,
      name: "",
    },
    date: "",
    featured: false,
  };
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(emptyReview);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // const [sort, setSort] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    getReviews(page, perPage)
      .then((res) => {
        // console.log(res);
        setReviews(sortTables(res.reviews, "id", "desc"));
        setTotalPages(res.totalPages);
        setTotalReviews(res.totalReviews);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, perPage]);

  useEffect(() => {
    getProducts()
      .then((res) => {
        setProducts(res.results);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoadingProducts(false);
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

  if (loading || loadingProducts) return <LoadingSpinner />;

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
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("id")}>
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
                  <span>Product</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("product.name")}>
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
                  <span>Rating</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("rating")}>
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
                  <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("date")}>
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
                <td>
                  {review.product.name} [{review.product.id}]
                </td>
                <td>{review.author}</td>
                <td>{review.rating}</td>
                <td>{review.title}</td>
                <td>{review.review}</td>
                <td>{formatDateShort(review.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          perPage={perPage}
          setPerPage={setPerPage}
          totalResults={totalReviews}
          options={[10, 25, 50]}
        />
      </div>
      <AddEditReviewPopup selectedReview={selectedReview} resetReview={resetReview} setReviews={setReviews} products={products} />
    </div>
  );
}
