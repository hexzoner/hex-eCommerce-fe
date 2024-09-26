import { getSizes } from "../../api/sizes";
import { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";
import sortTables from "../../utils/sortTables";
import { CreateSizeModal, SizeModal } from "./admin-components";

export interface Size {
  id: number;
  name: string;
}

export default function Sizes() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<Size>({
    id: 0,
    name: "",
  });

  useEffect(() => {
    const fetchSizes = async () => {
      setLoading(true);
      try {
        const sizes = await getSizes();
        // console.log(users);
        setSizes(sizes);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchSizes();
  }, []);

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedSizes = sortTables(sizes, key, newSortOrder);
    setSizes(sortedSizes);
  };

  function createSize() {
    const sizeModal = document.getElementById("create_size_modal");
    if (sizeModal) (sizeModal as HTMLDialogElement).showModal();
  }

  if (loading) return <LoadingSpinner />;

  const borderMarkup = ""; //border-[2px] border-base-content p-3 my-4 font-semibold";
  return (
    <div className="min-h-screen">
      <div className="w-full flex max-w-3xl m-auto justify-center mb-4 items-center gap-4">
        <p className="text-3xl my-6">Sizes </p>
        <button onClick={createSize} className="btn btn-outline btn-sm">
          Create Size
        </button>
      </div>
      <div className="overflow-x-auto rounded-md max-w-3xl m-auto">
        <table className="table rounded-md table-zebra table-sm w-full shadow-md mb-12">
          <thead className="text-sm bg-base-300">
            <tr>
              <th className="font-bold w-1/6">
                <div className="flex gap-1 items-center ">
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
                  <span>Name</span>
                  <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("name")}>
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
            {sizes.map((size: Size) => {
              return (
                <tr
                  key={size.id}
                  className="hover cursor-pointer"
                  onClick={() => {
                    setSelectedSize(size);
                    const sizeModal = document.getElementById("size_modal");
                    if (sizeModal) (sizeModal as HTMLDialogElement).showModal();
                  }}>
                  <td className={borderMarkup}>{size.id}</td>
                  <td className={borderMarkup}>{size.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* <Pagination page={page} setPage={setPage} totalPages={totalPages} perPage={perPage} setPerPage={setPerPage} totalResults={totalTasks} /> */}
        <SizeModal size={selectedSize} setSelectedSize={setSelectedSize} setSizes={setSizes} />
        <CreateSizeModal setSizes={setSizes} />
      </div>
    </div>
  );
}
