import { getProducts } from "../../api/products";
import { useState, useEffect } from "react";
import { restoreToken } from "../../utils/storage";
import LoadingSpinner from "../LoadingSpinner";
import sortTables from "../../utils/sortTables";

export default function Products() {
  interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProducts] = useState({
    id: 0,
    name: "",
    description: "",
    price: 0,
    categoryId: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = restoreToken();
        if (!token) return;
        const products = await getProducts(token);
        // console.log(users);
        setProducts(sortTables(products, "id", "asc"));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedUsers = sortTables(products, key, newSortOrder);
    setProducts(sortedUsers);
  };

  if (loading) return <LoadingSpinner />;

  const borderMarkup = ""; //border-[2px] border-base-content p-3 my-4 font-semibold";

  return (
    <div className="min-h-screen">
      <p className="text-3xl my-6">Products [{selectedProduct?.id}]</p>

      <div className="overflow-x-auto rounded-md max-w-6xl m-auto">
        <table className="table rounded-md table-zebra table-sm w-full shadow-md">
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
              <th className="font-bold">
                <div className="flex gap-1 items-center">
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
                  <span>Price</span>
                  <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("price")}>
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
                  <span>Category ID</span>
                  <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("categoryId")}>
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
            {products.map((product: Product) => {
              return (
                <tr
                  key={product.id}
                  className="hover cursor-pointer"
                  onClick={() => {
                    setSelectedProducts(product);
                    // document.getElementById("taskDetails").showModal();
                  }}>
                  <td className={borderMarkup}>{product.id}</td>
                  <td className={borderMarkup}>{product.name}</td>
                  <td className={borderMarkup}>{product.description}</td>
                  <td className={borderMarkup}>{product.price}</td>
                  <td className={borderMarkup}>{product.categoryId}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* <Pagination page={page} setPage={setPage} totalPages={totalPages} perPage={perPage} setPerPage={setPerPage} totalResults={totalTasks} /> */}
        {/* <TaskDetailsPopup task={selectedTask} /> */}
      </div>
    </div>
  );
}
