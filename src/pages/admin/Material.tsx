import { useState, useEffect } from "react";
import sortTables from "../../utils/sortTables";
import { getMaterials } from "../../api/material";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
// import { formatDateShort } from "../../utils/dateUtils";
import { AddEditMaterialPopup } from "../../components/admin-area/admin-components";
// import { truncateText } from "../../utils/miscUtils";

export interface Material {
  id: number;
  name: string;
  image: string;
}

export default function Material() {
  const emptyMaterial = {
    id: 0,
    name: "",
    image: "",
  };

  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState(emptyMaterial);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    getMaterials()
      .then((res) => {
        setMaterials(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleAddMaterial() {
    setSelectedMaterial(emptyMaterial);
    openModal();
  }

  function openModal() {
    const modal = document.getElementById("material_modal");
    if (modal) (modal as HTMLDialogElement).showModal();
  }

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sorted = sortTables(materials, key, newSortOrder);
    setMaterials(sorted);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen ">
      <div className="w-full flex m-auto justify-center items-center mb-4 gap-4">
        <p className="text-3xl my-6">Materials</p>
        <button onClick={handleAddMaterial} className="btn btn-outline btn-sm">
          Add Material
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
            {materials.map((material: any) => (
              <tr
                onClick={() => {
                  setSelectedMaterial(material);
                  openModal();
                }}
                className="cursor-pointer hover"
                key={material.id}>
                <td>{material.id}</td>
                <td className="">{material.name}</td>
                <td>
                  <img src={material.image} className="h-12 w-12" alt="shape image" />
                </td>
                {/* <td>{truncateText(producer.description, 200)}</td> */}
                {/* <td>{formatDateShort(producer.createdAt)}</td> */}
              </tr>
            ))}
          </tbody>
        </table>

        <AddEditMaterialPopup material={selectedMaterial} setMaterials={setMaterials} />
      </div>
    </div>
  );
}
