import { getWishlist, removeFromWishlist } from "../api/wishlist";
import { useEffect, useState } from "react";
import { restoreToken } from "../utils/storage";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = restoreToken();
    if (!token) return;
    getWishlist(token)
      .then((res) => {
        setWishlist(res);
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner />;

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
                <WishlistCard key={item.id} item={item} setWishlist={setWishlist} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function WishlistCard({ item, setWishlist }: { item: any; setWishlist: any }) {
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

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg w-72">
      <p onClick={handleRemoveClick} className="text-right font-bold cursor-pointer">
        ✕
      </p>
      <img src={item.image} alt={item.name} className=" h-36 w-72 object-cover px-4" />
      <div className="grid grid-col gap-3">
        <p className="text-lg font-semibold">{item.name}</p>
        <p className="text-lg font-semibold">${item.price}</p>
        <button className="btn btn-primary rounded-none mx-2">ADD TO CART</button>
      </div>
    </div>
  );
}
