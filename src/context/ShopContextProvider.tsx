import { useState, ReactNode, useEffect } from "react";
import { restoreToken } from "../utils/storage";
import { getWishlist } from "../api/wishlist";
import { ShopContext } from ".";

const ShopProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [shopLoading, setShopLoading] = useState(true);

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
      .finally(() => setShopLoading(false));
  }, []);

  return <ShopContext.Provider value={{ wishlist, setWishlist, shopLoading, setShopLoading }}>{children}</ShopContext.Provider>;
};

export default ShopProvider;
