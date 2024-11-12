import { getOrders } from "../../api/orders";
import { useState, useEffect } from "react";
import { restoreToken } from "../../utils/storage";
import LoadingSpinner from "../LoadingSpinner";
import sortTables from "../../utils/sortTables";
import { formatDateFull } from "../../utils/dateUtils";
import { OrderModal } from "./admin-components";
import Pagination from "../Pagination";

export interface iOrder {
  id: number;
  name: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  products: iOrderProduct[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface iOrderProduct {
  id: number;
  quantity: number;
  name: string;
  price: number;
  pattern: {
    id: number;
    name: string;
    icon: string;
  };
  size: {
    id: number;
    name: string;
  };
  priceTotal: number;
}

export default function Orders() {
  const [orders, setOrders] = useState<iOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<iOrder>({
    id: 0,
    name: "",
    products: [],
    total: 0,
    createdAt: "",
    updatedAt: "",
    user: {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  // const [sort, setSort] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = restoreToken();
        if (!token) return;
        const orders = await getOrders({ page, perPage });
        // console.log(orders);

        setTotalProducts(orders.total);
        setOrders(sortTables(orders.results, "id", "desc"));
        setTotalPages(orders.totalPages);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, perPage]);

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
      <p className="text-3xl my-6">Orders</p>

      <div className="overflow-x-auto rounded-md max-w-6xl m-auto">
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
            {orders.map((order: iOrder) => {
              return (
                <tr
                  key={order.id}
                  className="hover cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    const orderModal = document.getElementById("order_modal");
                    if (orderModal) (orderModal as HTMLDialogElement).showModal();
                  }}>
                  <td className={borderMarkup}>{order.id}</td>
                  <td className={borderMarkup}>{order.user.id}</td>
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

        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          perPage={perPage}
          setPerPage={setPerPage}
          totalResults={totalProducts}
          options={[10, 25, 50]}
        />

        <OrderModal order={selectedOrder} />
      </div>
    </div>
  );
}
