import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { FavIcon } from "./Home";
import { useShop } from "../context";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { wishlist, setWishlist } = useShop();

  useEffect(() => {
    getProductById(Number(id))
      .then((res) => {
        setProduct(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex gap-0 items-start mt-16 text-left max-w-[80rem] m-auto">
      <img className="w-1/2" src={product.image} alt="Product image" />
      <div className="flex flex-col gap-6 w-1/2 px-16 min-h-[55vh] justify-between">
        <div className="flex justify-between items-center">
          <p className="text-3xl font-semibold">{product.name}</p>
          <FavIcon product={product} wishlist={wishlist} setWishlist={setWishlist} />
        </div>
        <p className="text-xl">€{product.price}</p>
        <div className="flex gap-4 italic">
          <p>{product.category.name}</p>
          <p>{product.color.name}</p>
        </div>
        <p>{product.description}</p>
        <button className="btn btn-primary">ADD TO CART</button>
      </div>
    </div>
  );
}
