import { useState, ReactNode, useEffect } from "react";
import { restoreToken } from "../utils/storage";
import { getWishlist } from "../api/wishlist";
import { ShopContext } from ".";
import { useAuth } from "../context";
import { getCategories } from "../api/categories";
import { getColors } from "../api/colors";
import { getSizes } from "../api/sizes";

const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);

  const [shopLoading, setShopLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories(res);
      })
      .catch((err) => {
        console.log(err);
      });

    getColors()
      .then((res) => {
        setColors(res);
      })
      .catch((err) => {
        console.log(err);
      });

    getSizes()
      .then((res) => {
        setSizes(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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

  return (
    <ShopContext.Provider
      value={{ wishlist, setWishlist, shopLoading, setShopLoading, categories, colors, setCategories, setColors, sizes, setSizes }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
