import { getOrders } from "../../api/orders";
import { useState, useEffect } from "react";
import { restoreToken } from "../../utils/storage";
import LoadingSpinner from "../LoadingSpinner";
import sortTables from "../../utils/sortTables";
import { Product } from "./Products";
import { formatDateFull } from "../../utils/dateUtils";

export default function Orders() {
  interface Order {
    id: number;
    userId: number;
    products: Product[];
    total: number;
    createdAt: string;
    updatedAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order>({
    id: 0,
    userId: 0,
    products: [],
    total: 0,
    createdAt: "",
    updatedAt: "",
    user: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = restoreToken();
        if (!token) return;
        const orders = await getOrders(token);
        // console.log(orders);
        setOrders(sortTables(orders, "id", "asc"));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";

    setSortOrder(newSortOrder);
    const sortedOrders = sortTables(orders, key, newSortOrder);
    setOrders(sortedOrders);
  };

  if (loading) return <LoadingSpinner />;

  const borderMarkup = ""; //border-[2px] border-base-content p-3 my-4 font-semibold";

  return (
    <div className="min-h-screen">
      <p className="text-3xl my-6">Orders [{selectedOrder?.id}]</p>

      <div className="overflow-x-auto rounded-md max-w-6xl m-auto">
        <table className="table rounded-md table-zebra table-sm w-full shadow-md">
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
                  <span>userId</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("userId")}>
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
                  <span>Email</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("email")}>
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
                  <span>Products</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("products")}>
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
                  <span>total</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("total")}>
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
                  <span>Created At</span>
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
              <th className="font-bold">
                <div className="flex gap-1 items-center">
                  <span>Updated At</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("updatedAt")}>
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
            {orders.map((order: Order) => {
              return (
                <tr
                  key={order.id}
                  className="hover cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    // document.getElementById("taskDetails").showModal();
                  }}>
                  <td className={borderMarkup}>{order.id}</td>
                  <td className={borderMarkup}>{order.userId}</td>
                  <td className={borderMarkup}>{order.user.email}</td>
                  <td className={borderMarkup}>{order.products.length}</td>
                  <td className={borderMarkup}>${order.total}</td>
                  <td className={borderMarkup}>{formatDateFull(order.createdAt)}</td>
                  <td className={borderMarkup}>{formatDateFull(order.updatedAt)}</td>
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
