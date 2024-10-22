import { useState, useEffect } from "react";
import sortTables from "../../utils/sortTables";
import { getTechniques } from "../../api/technique";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
// import { formatDateShort } from "../../utils/dateUtils";
import { AddEditTechniquePopup } from "../../components/admin-area/admin-components";
// import { truncateText } from "../../utils/miscUtils";

export interface Technique {
  id: number;
  name: string;
  image: string;
}

export default function Technqiue() {
  const emptyTechnqiue = {
    id: 0,
    name: "",
    image: "",
  };

  const [loading, setLoading] = useState(true);
  const [selectedTechnique, setSelectedTechnique] = useState(emptyTechnqiue);
  const [technique, setTechnique] = useState([]);

  useEffect(() => {
    getTechniques()
      .then((res) => {
        setTechnique(res);
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
    setSelectedTechnique(emptyTechnqiue);
    openModal();
  }

  function openModal() {
    const modal = document.getElementById("technique_modal");
    if (modal) (modal as HTMLDialogElement).showModal();
  }

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sorted = sortTables(technique, key, newSortOrder);
    setTechnique(sorted);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen ">
      <div className="w-full flex m-auto justify-center items-center mb-4 gap-4">
        <p className="text-3xl my-6">Technique</p>
        <button onClick={handleAdd} className="btn btn-outline btn-sm">
          Add Technique
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
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {technique.map((t: any) => (
              <tr
                onClick={() => {
                  setSelectedTechnique(t);
                  openModal();
                }}
                className="cursor-pointer hover"
                key={t.id}>
                <td>{t.id}</td>
                <td className="">{t.name}</td>
                <td>
                  <img src={t.image} className="h-12 w-12" alt="shape image" />
                </td>
                {/* <td>{truncateText(producer.description, 200)}</td> */}
                {/* <td>{formatDateShort(producer.createdAt)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddEditTechniquePopup technique={selectedTechnique} setTechnique={setTechnique} />
    </div>
  );
}
