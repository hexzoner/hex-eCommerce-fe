import { useState, useEffect } from "react";
import sortTables from "../../utils/sortTables";
import { getProducers } from "../../api/producers";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { formatDateShort } from "../../utils/dateUtils";
import AddEditProducerPopup from "./AddEditProducerPopup";
import { truncateText } from "../../utils/miscUtils";

export interface Producer {
  id: number;
  name: string;
  description: string;
  image: string;
  createdAt: string;
}

export default function Reviews() {
  const emptyProducer = {
    id: 0,
    name: "",
    description: "",
    image: "",
    createdAt: "",
  };

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducer, setSelectedProducer] = useState(emptyProducer);
  const [producers, setProducers] = useState([]);

  useEffect(() => {
    getProducers()
      .then((res) => {
        setProducers(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleAddProducer() {
    setSelectedProducer(emptyProducer);
    openModal();
  }

  function openModal() {
    const modal = document.getElementById("producer_modal");
    if (modal) (modal as HTMLDialogElement).showModal();
  }

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sorted = sortTables(reviews, key, newSortOrder);
    setReviews(sorted);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen ">
      <div className="w-full flex m-auto justify-center items-center mb-4 gap-4">
        <p className="text-3xl my-6">Producers</p>
        <button onClick={handleAddProducer} className="btn btn-outline btn-sm">
          Add Producer
        </button>
      </div>
      <div className="overflow-x-auto rounded-md max-w-5xl m-auto">
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
                  <span>Name</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("name")}>
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
                <div className="flex gap-1 items-center justify-center">
                  <span>Description</span>
                  <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("description")}>
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
                  <span>CreatedAt</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("createdAt")}>
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
            {producers.map((producer: any) => (
              <tr
                onClick={() => {
                  setSelectedProducer(producer);
                  openModal();
                }}
                className="cursor-pointer hover"
                key={producer.id}>
                <td>{producer.id}</td>
                <td className="w-1/4">{producer.name}</td>
                <td>{truncateText(producer.description, 200)}</td>
                <td>{formatDateShort(producer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <AddEditProducerPopup producer={selectedProducer} setProducers={setProducers} />
      </div>
    </div>
  );
}
