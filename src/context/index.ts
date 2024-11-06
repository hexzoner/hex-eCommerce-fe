import { createContext, useContext } from "react";
import AuthContextProvider from "./AuthContextProvider";
import ShopContextProvider from "./ShopContextProvider";
export interface iFilter {
  type: string;
  id: number;
  value: string;
}

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
  login: (res: any) => void;
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
  styles: any[];
  setStyles: React.Dispatch<React.SetStateAction<any[]>>;
  materials: any[];
  setMaterials: React.Dispatch<React.SetStateAction<any[]>>;
  techniques: any[];
  setTechniques: React.Dispatch<React.SetStateAction<any[]>>;
  shapes: any[];
  setShapes: React.Dispatch<React.SetStateAction<any[]>>;
  producers: any[];
  setProducers: React.Dispatch<React.SetStateAction<any[]>>;
  rooms: any[];
  setRooms: React.Dispatch<React.SetStateAction<any[]>>;
  features: any[];
  setFeatures: React.Dispatch<React.SetStateAction<any[]>>;
  filter: iFilter;
  setFilter: React.Dispatch<React.SetStateAction<iFilter>>;
  deleteFromCart: (productId: number, color: number, size: number) => void;
}

const ShopContext = createContext<ShopContextProps>({
  login: () => {},
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
  styles: [],
  setStyles: () => {},
  materials: [],
  setMaterials: () => {},
  techniques: [],
  setTechniques: () => {},
  shapes: [],
  setShapes: () => {},
  producers: [],
  setProducers: () => {},
  rooms: [],
  setRooms: () => {},
  features: [],
  setFeatures: () => {},
  filter: {
    id: 0,
    type: "",
    value: "",
  },
  setFilter: () => {},
  deleteFromCart: () => {},
});

const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within a ShopContextProvider");
  return context;
};

export { AuthContext, useAuth, AuthContextProvider, ShopContextProvider, ShopContext, useShop };
