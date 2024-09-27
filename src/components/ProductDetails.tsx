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
  const [selectedSize, setSelectedSize] = useState<any>({});

  useEffect(() => {
    getProductById(Number(id))
      .then((res) => {
        setProduct(res);
        setSelectedSize(res.defaultSize);
        // console.log(res);
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
          <p>{product.defaultColor.name}</p>
        </div>
        <p>{product.description}</p>
        <div className="font-semibold text-lg">
          <span>Size:</span> <span className="ml-1 ">{selectedSize.name}</span>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {/* <p>Sizes: </p> */}
          {product.sizes.map((size: any) => (
            // <button
            //   onClick={() => {
            //     setSelectedSize(size);
            //   }}
            //   key={size.id}
            //   className="btn btn-sm btn-outline py-0 px-5">
            //   {size.name}
            // </button>
            <ProductSize size={size} setSelectedSize={setSelectedSize} selectedSize={selectedSize} key={size.id} />
          ))}
        </div>
        <button className="btn btn-primary">ADD TO CART</button>
      </div>
    </div>
  );
}

function ProductSize({ size, setSelectedSize, selectedSize }: { size: any; setSelectedSize: any; selectedSize: any }) {
  return (
    <button
      onClick={() => {
        setSelectedSize(size);
      }}
      key={size.id}
      className={`btn btn-sm py-0 px-5 ${selectedSize.id == size.id ? "btn-primary" : "btn-outline"}`}>
      {size.name}
    </button>
  );
}
