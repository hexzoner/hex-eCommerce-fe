import { useState, useEffect } from "react";
import sortTables from "../../utils/sortTables";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import { TaxonomyPopup } from "../../components/admin-area/admin-components";

export interface iTaxonomy {
  id: number;
  name: string;
  image: string;
}

export default function Taxonomies({
  modalName,
  getTaxonomies,
  createTaxonomy,
  updateTaxonomy,
  deleteTaxonomy,
}: {
  modalName: string;
  getTaxonomies: () => Promise<any>;
  createTaxonomy: (data: any) => Promise<any>;
  updateTaxonomy: (data: any, id: number) => Promise<any>;
  deleteTaxonomy: (id: number) => Promise<any>;
}) {
  const empty = {
    id: 0,
    name: "",
    image: "",
  };

  const [loading, setLoading] = useState(true);
  const [selectedTaxonomy, setSelectedTaxonomy] = useState(empty);
  const [taxonomies, setTaxonomies] = useState([]);

  useEffect(() => {
    getTaxonomies()
      .then((res) => {
        setTaxonomies(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleAdd() {
    setSelectedTaxonomy(empty);
    openModal();
  }

  function openModal() {
    const modal = document.getElementById(modalName);
    if (modal) (modal as HTMLDialogElement).showModal();
  }

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sorted = sortTables(taxonomies, key, newSortOrder);
    setTaxonomies(sorted);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen ">
      <div className="w-full flex m-auto justify-center items-center mb-4 gap-4">
        <p className="text-3xl my-6">Features</p>
        <button onClick={handleAdd} className="btn btn-outline btn-sm">
          Add Feature
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
                <div className="flex gap-1 items-center">
                  <span>Image</span>
                  {/* <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("name")}>
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
            </tr>
          </thead>
          <tbody>
            {taxonomies.map((x: any) => (
              <tr
                onClick={() => {
                  setSelectedTaxonomy(x);
                  openModal();
                }}
                className="cursor-pointer hover"
                key={x.id}>
                <td>{x.id}</td>
                <td className="">{x.name}</td>
                <td>
                  <img src={x.image} className="h-12 w-12" alt="shape image" />
                </td>
                {/* <td>{truncateText(producer.description, 200)}</td> */}
                {/* <td>{formatDateShort(producer.createdAt)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TaxonomyPopup
        taxonomy={selectedTaxonomy}
        setTaxonomies={setTaxonomies}
        modalName={modalName}
        createTaxonomy={createTaxonomy}
        updateTaxonomy={updateTaxonomy}
        deleteTaxonomy={deleteTaxonomy}
      />
    </div>
  );
}
