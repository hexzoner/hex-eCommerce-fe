import { removeFromWishlist } from "../api/wishlist";
// import { useEffect, useState } from "react";
import { restoreToken } from "../utils/storage";
import { toast } from "react-toastify";
import { useShop } from "../context";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, setWishlist, shopLoading, addToCart, cartLoading } = useShop();
  if (shopLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pb-12">
      <p className="text-3xl mt-8">My Wishlist</p>
      <section>
        <div>
          {wishlist.length === 0 ? (
            <p className="text-xl mt-24">Your wishlist is empty</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 max-w-[75rem] m-auto ">
              {wishlist.map((item) => (
                <WishlistCard key={item.id} item={item} setWishlist={setWishlist} addToCart={addToCart} cartLoading={cartLoading} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function WishlistCard({ item, setWishlist, addToCart, cartLoading }: { item: any; setWishlist: any; addToCart: any; cartLoading: boolean }) {
  function handleRemoveClick() {
    const token = restoreToken();
    if (!token) return;
    removeFromWishlist(token, item.id)
      .then((res) => {
        // console.log(res);
        setWishlist((prev: any) => prev.filter((i: any) => i.id !== item.id));
        toast.success(res.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  }

  const navigate = useNavigate();
  function handleNavigate() {
    navigate(`/product/${item.id}`);
  }

  function handleAddToCart() {
    addToCart(item, 1, item.defaultSizeId, item.defaultColorId);
  }

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg w-72">
      <p onClick={handleRemoveClick} className="text-right font-bold cursor-pointer">
        ✕
      </p>
      <img onClick={handleNavigate} src={item.image} alt={item.name} className=" h-36 w-72 object-cover px-4 cursor-pointer" />
      <div className="grid grid-col gap-3">
        <p onClick={handleNavigate} className="text-lg font-semibold cursor-pointer hover:text-[#b04e2d]">
          {item.name}
        </p>
        <p className="text-lg font-semibold">${item.price}</p>
        <button onClick={handleAddToCart} className="btn btn-primary rounded-none mx-2" disabled={cartLoading}>
          ADD TO CART
        </button>
      </div>
    </div>
  );
}
