import { getProducts } from "../../api/products";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import sortTables from "../../utils/sortTables";
import { CreateProductModal } from "./admin-components";
import { formatDateShort } from "../../utils/dateUtils";
import { Size } from "./Sizes";
// import { Color } from "../../pages/admin/Colors";
import Pagination from "../../components/Pagination";
import { iRoom } from "../../utils/constants";
import { iTaxonomy } from "../../pages/admin/Taxonomies";
import { iPattern } from "../../pages/admin/modals/CreateProductModal";

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
  style: {
    id: number;
    name: string;
  };
  technique: {
    id: number;
    name: string;
  };
  shape: {
    id: number;
    name: string;
  };
  material: {
    id: number;
    name: string;
  };

  defaultColor: {
    id: number;
    name: string;
  };
  createdAt: string;
  image: string;
  wishlisted: boolean;
  sizes: Size[];
  defaultSize: Size;
  colors: iTaxonomy[];
  rooms: iRoom[];
  features: iTaxonomy[];
  active: boolean;
  details: string;
  notes: string;
  instructions: string;
  producer: {
    id: number;
    name: string;
  };
  new: boolean;
  bestSeller: boolean;
  patterns: iPattern[];
  stripeProductId: string;
  producerQuote: string;
  samplePrice: number;
  shippingDays: number;
}

export default function Products() {
  const emptyProduct = {
    id: 0,
    name: "",
    description: "No description available",
    price: 0,
    quantity: 0,
    category: {
      id: 0,
      name: "",
    },
    defaultColor: {
      id: 0,
      name: "",
    },
    isEdit: false,
    createdAt: "",
    image: "",
    wishlisted: false,
    sizes: [],
    defaultSize: {
      id: 0,
      name: "",
      squareMeters: 0,
    },
    colors: [],
    active: false,
    details: "No details available",
    notes: "No notes available",
    instructions: "No instructions available",
    producer: {
      id: 0,
      name: "",
    },
    style: {
      id: 0,
      name: "",
    },
    technique: {
      id: 0,
      name: "",
    },
    shape: {
      id: 0,
      name: "",
    },
    material: {
      id: 0,
      name: "",
    },
    rooms: [],
    features: [],
    new: false,
    bestSeller: false,
    patterns: [],
    stripeProductId: "",
    producerQuote: "",
    samplePrice: 0,
    shippingDays: 10,
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product>(emptyProduct);
  const [update, setUpdate] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // const [sort, setSort] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const products = await getProducts({ page, perPage });
        // console.log(products);
        setProducts(sortTables(products.results, "id", "desc"));
        setTotalPages(products.totalPages);
        setTotalProducts(products.totalResults);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [update, page, perPage]);

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
      <div className="w-full flex m-auto justify-center items-center mb-4 gap-4">
        <p className="text-3xl my-6">Products</p>
        <button onClick={createProduct} className="btn btn-outline btn-sm">
          Create Product
        </button>
      </div>
      <div className="overflow-x-auto rounded-md max-w-7xl m-auto pb-4">
        <table className="table rounded-md table-zebra table-sm w-full shadow-md ">
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
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("defaultColor.id")}>
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
                  <span>Active</span>
                  <button title="Sort" className="hover:cursor-pointer" onClick={() => handleSortClick("active")}>
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
                  <td className={borderMarkup}>{product.defaultColor.name}</td>
                  <td className={borderMarkup}>{product.active ? "Active" : "Deactivated"}</td>
                  <td className="w-[12%]">{formatDateShort(product.createdAt)}</td>
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
        {/* <ProductModal product={selectedProduct} /> */}
        <CreateProductModal product={selectedProduct} setProducts={setProducts} setUpdate={setUpdate} />
      </div>
    </div>
  );
}
