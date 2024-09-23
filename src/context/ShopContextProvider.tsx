import { useState, ReactNode, useEffect } from "react";
import { restoreToken } from "../utils/storage";
import { getWishlist } from "../api/wishlist";
import { ShopContext } from ".";
import { useAuth } from "../context";

const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [shopLoading, setShopLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setShopLoading(false);
      return;
    }
    if (user.role === "admin") return;

    getWishlist(restoreToken())
      .then((res) => {
        setWishlist(res);
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setShopLoading(false));
  }, [user, isAuthenticated]);

  return <ShopContext.Provider value={{ wishlist, setWishlist, shopLoading, setShopLoading }}>{children}</ShopContext.Provider>;
};

export default ShopProvider;
