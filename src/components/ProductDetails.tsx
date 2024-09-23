import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(Number(id))
      .then((res) => {
        setProduct(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex flex-col gap-2 justify-center items-center">
      {/* <p className=" text-3xl">Product Details </p> */}
      <p className="text-3xl font-semibold">{product.name}</p>
      <p className="text-xl">€{product.price}</p>
      <img className="max-w-96" src={product.image} alt="Product image" />
      <div className="flex gap-4 italic">
        <p>{product.category.name}</p>
        <p>{product.color.name}</p>
      </div>
      <p>{product.description}</p>
    </div>
  );
}
