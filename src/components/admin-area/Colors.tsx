import { getColors } from "../../api/colors";
import { useState, useEffect } from "react";
import { restoreToken } from "../../utils/storage";
import LoadingSpinner from "../LoadingSpinner";
import sortTables from "../../utils/sortTables";
// import { CategoryModal, CreateCategoryModal } from "./admin-components";
import ColorModal from "./ColorModals";
import { CreateColorModal } from "./ColorModals";

export interface Color {
  id: number;
  name: string;
}

export default function Colors() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<Color>({
    id: 0,
    name: "",
  });

  useEffect(() => {
    const fetchColors = async () => {
      setLoading(true);
      try {
        const token = restoreToken();
        if (!token) return;
        const colors = await getColors(token);
        // console.log(users);
        setColors(colors);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchColors();
  }, []);

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedColors = sortTables(colors, key, newSortOrder);
    setColors(sortedColors);
  };

  function createColor() {
    const colorModal = document.getElementById("create_color_modal");
    if (colorModal) (colorModal as HTMLDialogElement).showModal();
  }

  if (loading) return <LoadingSpinner />;

  const borderMarkup = ""; //border-[2px] border-base-content p-3 my-4 font-semibold";
  return (
    <div className="min-h-screen">
      <div className="w-full flex max-w-3xl m-auto justify-center mb-4 items-center gap-4">
        <p className="text-3xl my-6">Colors </p>
        <button onClick={createColor} className="btn btn-outline btn-sm">
          Create Color
        </button>
      </div>
      <div className="overflow-x-auto rounded-md max-w-3xl m-auto">
        <table className="table rounded-md table-zebra table-sm w-full shadow-md">
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
            {colors.map((color: Color) => {
              return (
                <tr
                  key={color.id}
                  className="hover cursor-pointer"
                  onClick={() => {
                    setSelectedColor(color);
                    const colorModal = document.getElementById("color_modal");
                    if (colorModal) (colorModal as HTMLDialogElement).showModal();
                  }}>
                  <td className={borderMarkup}>{color.id}</td>
                  <td className={borderMarkup}>{color.name}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* <Pagination page={page} setPage={setPage} totalPages={totalPages} perPage={perPage} setPerPage={setPerPage} totalResults={totalTasks} /> */}
        <ColorModal color={selectedColor} setSelectedColor={setSelectedColor} setColors={setColors} />
        <CreateColorModal setColors={setColors} />
      </div>
    </div>
  );
}
