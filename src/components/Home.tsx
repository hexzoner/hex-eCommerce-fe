export const mainMakrupColors = "bg-white text-[#363636]";
import { getProducts } from "../api/products";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Product } from "./admin-area/Products";
import { truncateText } from "../utils/sortTables";
import { addToWishlist, removeFromWishlist, getWishlist } from "../api/wishlist";
import { restoreToken } from "../utils/storage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    const token = restoreToken();
    getWishlist(token)
      .then((res) => {
        // console.log(res);
        setWishlist(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        getProducts(token)
          .then((res) => setProducts(res))
          .catch((err) => {
            console.log(err);
            toast.error(err.message);
          })
          .finally(() => setLoading(false));
      });
  }, []);

  if (loading)
    return (
      <div className={mainMakrupColors}>
        <LoadingSpinner />
      </div>
    );

  return (
    <div className={mainMakrupColors + " min-h-screen max-w-[90rem] m-auto "}>
      <p className="text-2xl text-left mt-8 ml-16 font-semibold ">Our collection of handmade rugs</p>
      <p className="text-base text-left mt-4 ml-16">Discover our collection, handmade of eco-friendly wool material</p>
      <section className="my-8 px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} setProducts={setProducts} wishlist={wishlist} />;
          })}
        </div>
      </section>
    </div>
  );
}

export const ProductCard = ({ product, setProducts, wishlist }: { product: Product; setProducts: any; wishlist: any }) => {
  const navigate = useNavigate();
  function handleClick() {
    navigate(`/product/${product.id}`);
  }

  return (
    <div className="card bg-base-100 w-72 mx-auto">
      <figure>
        <img onClick={handleClick} className="w-72 h-48 object-cover  cursor-pointer" src={product.image} alt="Rug Image" />
      </figure>
      <div className="card-body">
        <h2 className="text-xl font-bold text-center flex items-center justify-between ">
          <div className="opacity-0">+</div>
          <div onClick={handleClick} className="cursor-pointer hover:text-[#b04e2d]">
            {product.name}
          </div>
          {/* <div className="badge badge-secondary"></div> */}
          <FavIcon product={product} setProducts={setProducts} wishlist={wishlist} />
        </h2>
        €{product.price}
        <p className="text-sm text-justify ">{truncateText(product.description, 128)}</p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">{product.category.name}</div>
          <div className="badge badge-outline">{product.color.name}</div>
        </div>
      </div>
    </div>
  );
};

export function FavIcon({ product, wishlist }: { product: Product; setProducts: any; wishlist: any }) {
  function isInWishlist() {
    if (!wishlist) return false;
    const wishlistToArray = Object.values(wishlist);
    return wishlistToArray.some((item: any) => item.id === product.id);
  }

  const [favorited, setFavorited] = useState(isInWishlist());

  function handleAddtoWishlist() {
    const token = restoreToken();
    if (!token) return;

    if (favorited) {
      removeFromWishlist(token, product.id)
        .then((res) => {
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
      className="size-4 stroke-black hover:cursor-pointer hover:animate-pulse"
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
