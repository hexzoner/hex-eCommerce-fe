export const mainMakrupColors = "bg-white text-[#363636]";
import { getProducts } from "../../api/products";
import { useEffect, useState } from "react";
// import LoadingSpinner from "./LoadingSpinner";
import { Product } from "../../components/admin-area/Products";
// import { truncateText } from "../utils/sortTables";
import { addToWishlist, removeFromWishlist } from "../../api/wishlist";
import { restoreToken } from "../../utils/storage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useShop } from "../../context";
import Filters from "../../components/Filters";
import { calculatePriceRange } from "../../utils/miscUtils";
import Pagination from "../../components/Pagination";
import { NewBestSellerBadge } from "../../components/components";
import { getProductMainImageUrl } from "../../utils/miscUtils";
import { storeWishlist } from "../../utils/storage";

export default function ProductBrowser() {
  // /products/room/Hallway
  // /products/type/Wool
  // const { room } = useParams<{ type: string; room: string; color: string }>();
  const { wishlist, setWishlist, shopLoading, filter } = useShop();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>(filter.type === "Rug Types" ? [{ id: filter.id, name: filter.value }] : []);
  const [selectedColors, setSelectedColors] = useState<any[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<any[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<any[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<any[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
  const [selectedTechniques, setSelectedTechniques] = useState<any[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<any[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<any[]>(filter.type === "Rug Sizes" ? [{ id: filter.id, name: filter.value }] : []);
  const [loading, setLoading] = useState(true);
  const [refreshSelected, setRefreshSelected] = useState(false);

  const navigate = useNavigate();

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  // const [sort, setSort] = useState("desc");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    // if (shopLoading) return;
    setLoading(true);
    // console.log("Filters - fetching products");
    getProducts({
      // categories: filter.type === "Rug Types" ? [filter.id] : selectedCategories.map((x) => x.id),
      categories: selectedCategories.map((x) => x.id),
      colors: selectedColors.map((x) => x.id),
      sizes: selectedSizes.map((x) => x.id),
      shapes: selectedShapes.map((x) => x.id),
      techniques: selectedTechniques.map((x) => x.id),
      materials: selectedMaterials.map((x) => x.id),
      styles: selectedStyles.map((x) => x.id),
      // rooms: filter.type === "Rug Sizes" ? [filter.id] : selectedRooms.map((x) => x.id),
      rooms: selectedRooms.map((x) => x.id),
      features: selectedFeatures.map((x) => x.id),
      page,
      perPage,
      isNew: filter.type === "New Arrivals" ? (filter.value === "true" ? true : false) : undefined,
    })
      .then((res) => {
        setProducts(res.results.filter((x: any) => x.active == true));
        setTotalPages(res.totalPages);
        setTotalProducts(res.totalResults);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [
    selectedCategories,
    selectedColors,
    selectedSizes,
    selectedStyles,
    selectedShapes,
    selectedMaterials,
    selectedTechniques,
    selectedFeatures,
    selectedRooms,
    page,
    perPage,
  ]);

  useEffect(() => {
    // console.log("Filter", filter);
    if (filter.type === "Rug Sizes") setSelectedRooms([{ id: filter.id, name: filter.value }]);
    if (filter.type === "Rug Types") setSelectedCategories([{ id: filter.id, name: filter.value }]);

    setRefreshSelected(!refreshSelected);
  }, [filter]);

  // console.log(selectedRooms);

  return (
    <div className={mainMakrupColors + " min-h-screen max-w-[80rem] m-auto py-6"}>
      <div className="breadcrumbs text-sm text-blue-600 ">
        <ul>
          <li>
            <a onClick={() => navigate("/")}>Home</a>
          </li>
          <li>
            <p className="underline underline-offset-2">Rugs</p>
          </li>
        </ul>
      </div>
      <p className="text-2xl text-left mt-8 font-semibold px-5">Our collection of handmade rugs</p>
      <p className="text-base text-left mt-4 px-5">Discover our collection, handmade of eco-friendly wool material</p>
      <div className="px-5 my-6">
        <Filters
          selectedColors={selectedColors}
          selectedCategories={selectedCategories}
          setProducts={setProducts}
          setSelectedCategories={setSelectedCategories}
          setSelectedColors={setSelectedColors}
          selectedSizes={selectedSizes}
          setSelectedSizes={setSelectedSizes}
          selectedStyles={selectedStyles}
          setSelectedStyles={setSelectedStyles}
          selectedShapes={selectedShapes}
          setSelectedShapes={setSelectedShapes}
          selectedMaterials={selectedMaterials}
          setSelectedMaterials={setSelectedMaterials}
          selectedTechniques={selectedTechniques}
          setSelectedTechniques={setSelectedTechniques}
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
          selectedRooms={selectedRooms}
          setSelectedRooms={setSelectedRooms}
          refreshSelected={refreshSelected}
          setRefreshSelected={setRefreshSelected}
        />
      </div>
      <section className="my-8 ">
        {loading || shopLoading ? (
          <div className="flex flex-col justify-center items-center min-h-[50vh]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {products.map((product) => {
                return <ProductCard key={product.id} product={product} wishlist={wishlist} setWishlist={setWishlist} />;
              })}
            </div>
            {products.length === 0 && <p className="text-center text-xl mt-24">No products found</p>}
            <Pagination
              page={page}
              setPage={setPage}
              perPage={perPage}
              setPerPage={setPerPage}
              totalPages={totalPages}
              totalResults={totalProducts}
              options={[8, 16, 24]}
            />
          </>
        )}
      </section>
    </div>
  );
}

export const ProductCard = ({ product, wishlist, setWishlist }: { product: Product; wishlist: any; setWishlist: any }) => {
  const navigate = useNavigate();
  function handleClick() {
    navigate(`/product/${product.id}`);
  }

  return (
    <div className="card bg-base-100 w-72 mx-auto ">
      <figure className="relative tooltip">
        <img onClick={handleClick} className="w-72 h-48 object-cover  cursor-pointer p-2" src={getProductMainImageUrl(product)} alt="Rug Image" />
        <NewBestSellerBadge isNew={product.new} isBestSeller={product.bestSeller} />
      </figure>
      <div className="card-body">
        <h2 className="text-xl font-bold text-center flex items-center justify-between ">
          <div className="opacity-0">+</div>
          <div onClick={handleClick} className="cursor-pointer hover:text-[#b04e2d]">
            {product.name}
          </div>
          {/* <div className="badge badge-secondary"></div> */}
          <FavIcon product={product} wishlist={wishlist} setWishlist={setWishlist} />
        </h2>
        {calculatePriceRange(product)}
        {/* <p className="text-sm text-justify ">{truncateText(product.description, 128)}</p> */}
        <div className="card-actions justify-end">
          <div className="badge badge-outline">{product.category.name}</div>
          <div className="badge badge-outline">{product.defaultColor.name}</div>
        </div>
      </div>
    </div>
  );
};

export function FavIcon({ product, wishlist, setWishlist }: { product: Product; wishlist: any; setWishlist?: any }) {
  function isInWishlist() {
    if (!wishlist) return false;
    const wishlistToArray = Object.values(wishlist);
    return wishlistToArray.some((item: any) => item.id === product.id);
  }

  const [favorited, setFavorited] = useState(isInWishlist());

  useEffect(() => {
    setFavorited(isInWishlist());
  }, [wishlist]);

  function handleAddtoWishlist() {
    const token = restoreToken();
    if (!token) {
      // toast.error("Please login to add products to wishlist");
      if (favorited) {
        const newWishlist = wishlist.filter((i: any) => i.id !== product.id);
        setWishlist(newWishlist);
        storeWishlist(newWishlist);
      } else {
        const newWishlist = [...wishlist, product];
        setWishlist(newWishlist);
        storeWishlist(newWishlist);
      }
      setFavorited(!favorited);
      return;
    }

    if (favorited) {
      removeFromWishlist(token, product.id)
        .then((res) => {
          setWishlist((prev: any) => prev.filter((i: any) => i.id !== product.id));
          toast.success(res.message);
          setFavorited(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        });
    } else {
      addToWishlist(token, product.id)
        .then((res) => {
          setWishlist((prev: any) => [...prev, product]);
          toast.success(res.message);
          setFavorited(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.message);
        });
    }
  }

  return (
    <svg
      onClick={handleAddtoWishlist}
      className="size-6  stroke-black hover:cursor-pointer hover:animate-pulse"
      width="22"
      height="19"
      viewBox="0 0 22 19"
      fill={favorited ? "black" : "none"}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.9981 17.6694L2.51765 9.99133C-2.09133 5.38446 4.68385 -3.46071 10.9981 3.69527C17.3124 -3.46071 24.057 5.41518 19.4787 9.99133L10.9981 17.6694Z"
        // stroke="current"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
