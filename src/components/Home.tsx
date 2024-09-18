export const mainMakrupColors = "bg-white text-[#363636]";
import { getProducts } from "../api/products";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Product } from "./admin-area/Products";
import { truncateText } from "../utils/sortTables";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const products = await getProducts("token");
        setProducts(products);
        // console.log(products);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchProducts();
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
        <div className="grid grid-cols-4 gap-2">
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </div>
      </section>
    </div>
  );
}

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="card bg-base-100 w-80 ">
      <figure>
        <img className="w-80 h-48 object-cover" src={product.image} alt="Rug Image" />
      </figure>
      <div className="card-body">
        <h2 className="text-xl font-bold text-center flex items-center justify-between">
          <div className="opacity-0">+</div>
          {product.name}
          {/* <div className="badge badge-secondary"></div> */}
          <FavIcon />
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

export function FavIcon() {
  const [favorited, setFavorited] = useState(false);

  return (
    <svg
      onClick={() => setFavorited(!favorited)}
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
