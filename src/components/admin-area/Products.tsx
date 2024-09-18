import { getProducts } from "../../api/products";
import { useState, useEffect } from "react";
import { restoreToken } from "../../utils/storage";
import LoadingSpinner from "../LoadingSpinner";
import sortTables from "../../utils/sortTables";
import { CreateProductModal } from "./admin-components";
import { formatDateShort } from "../../utils/dateUtils";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  isEdit: boolean;
  category: {
    id: number;
    name: string;
  };
  color: {
    id: number;
    name: string;
  };
  createdAt: string;
  image: string;
}

export default function Products() {
  const emptyProduct = {
    id: 0,
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    category: {
      id: 0,
      name: "",
    },
    color: {
      id: 0,
      name: "",
    },
    isEdit: false,
    createdAt: "",
    image: "",
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product>(emptyProduct);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const token = restoreToken();
        if (!token) return;
        const products = await getProducts(token);
        // console.log(products);
        setProducts(sortTables(products, "id", "desc"));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [sortOrder, setSortOrder] = useState("asc");
  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedUsers = sortTables(products, key, newSortOrder);
    setProducts(sortedUsers);
  };

  function createProduct() {
    setSelectedProduct(emptyProduct);
    const createProductModal = document.getElementById("create_product_modal");
    if (createProductModal) (createProductModal as HTMLDialogElement).showModal();
  }

  if (loading) return <LoadingSpinner />;

  const borderMarkup = ""; //border-[2px] border-base-content p-3 my-4 font-semibold";

  return (
    <div className="min-h-screen">
      <div className="w-full flex max-w-6xl m-auto justify-center items-center mb-4 gap-4">
        <p className="text-3xl my-6">Products</p>
        <button onClick={createProduct} className="btn btn-outline btn-sm">
          Create Product
        </button>
      </div>
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
                  <span>Category</span>
                  <button title="SortByEmail" className="hover:cursor-pointer" onClick={() => handleSortClick("category.id")}>
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
                  <span>Color</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("color.id")}>
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
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product) => {
              return (
                <tr
                  key={product.id}
                  className="hover cursor-pointer"
                  onClick={() => {
                    product.isEdit = true;
                    setSelectedProduct(product);
                    // const productModal = document.getElementById("product_modal");
                    const productModal = document.getElementById("create_product_modal");
                    if (productModal) (productModal as HTMLDialogElement).showModal();
                  }}>
                  <td className={borderMarkup}>{product.id}</td>
                  <td className={borderMarkup}>{product.name}</td>
                  <td className={borderMarkup}>{product.description}</td>
                  <td className="w-1/6">€{product.price}</td>
                  <td className={borderMarkup}>{product.category.name}</td>
                  <td className={borderMarkup}>{product.color.name}</td>
                  <td className="w-[12%]">{formatDateShort(product.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* <Pagination page={page} setPage={setPage} totalPages={totalPages} perPage={perPage} setPerPage={setPerPage} totalResults={totalTasks} /> */}
        {/* <ProductModal product={selectedProduct} /> */}
        <CreateProductModal product={selectedProduct} setProducts={setProducts} />
      </div>
    </div>
  );
}
