import { createContext, useContext } from "react";
import AuthContextProvider from "./AuthContextProvider";
import ShopContextProvider from "./ShopContextProvider";

// AuthContext -----------------------------------------------------
interface AuthContextProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  authLoading: boolean;
  setAuthLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  authLoading: true,
  setAuthLoading: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: () => {},
});

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthContextProvider");
  return context;
};

// ShopContext -----------------------------------------------------
interface ShopContextProps {
  wishlist: any[];
  setWishlist: React.Dispatch<React.SetStateAction<any[]>>;
  shopLoading: boolean;
  setShopLoading: React.Dispatch<React.SetStateAction<boolean>>;
  categories: any[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
  colors: any[];
  setColors: React.Dispatch<React.SetStateAction<any[]>>;
  sizes: any[];
  setSizes: React.Dispatch<React.SetStateAction<any[]>>;
  cart: {
    products: any[];
    total: number;
  };
  setCart: React.Dispatch<React.SetStateAction<any>>;
  addToCart: (product: any, quantity: number, size: number, color: number) => void;
  cartLoading: boolean;
  updateCartQuantity: (productId: number, quantity: number, color: number, size: number) => void;
}

const ShopContext = createContext<ShopContextProps>({
  wishlist: [],
  setWishlist: () => {},
  shopLoading: true,
  setShopLoading: () => {},
  categories: [],
  setCategories: () => {},
  colors: [],
  setColors: () => {},
  sizes: [],
  setSizes: () => {},
  cart: {
    products: [],
    total: 0,
  },
  setCart: () => {},
  addToCart: () => {},
  cartLoading: false,
  updateCartQuantity: () => {},
});

const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopContextProvider");
  return context;
};

export { AuthContext, useAuth, AuthContextProvider, ShopContextProvider, ShopContext, useShop };
