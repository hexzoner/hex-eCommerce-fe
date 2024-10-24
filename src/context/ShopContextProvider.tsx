import { useState, ReactNode, useEffect } from "react";
import { restoreToken } from "../utils/storage";
import { getWishlist } from "../api/wishlist";
import { ShopContext } from ".";
import { useAuth } from "../context";
import { getCategories } from "../api/categories";
import { getStyles } from "../api/styles";
import { getMaterials } from "../api/material";
import { getTechniques } from "../api/technique";
import { getShapes } from "../api/shapes";
import { getColors } from "../api/colors";
import { getSizes } from "../api/sizes";
import { getCart, updateCart } from "../api/cart";
import { toast } from "react-toastify";
import { getProducers } from "../api/producers";
import { getRooms } from "../api/rooms";
import { getFeatures } from "../api/features";
import { iFilter } from ".";

const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const [styles, setStyles] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [techniques, setTechniques] = useState<any[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [producers, setProducers] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [filter, setFilter] = useState<iFilter>({
    type: "",
    id: 0,
    value: "",
  });
  const [cart, setCart] = useState<any>({ products: [], total: 0 });

  const [shopLoading, setShopLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  function addToCart(product: any, quantity: number, size: number, color: number) {
    // if (!cart) return;
    if (!user || !isAuthenticated) {
      toast.error("Please login to add products to cart");
      return;
    }
    const productInCart = cart.products.find((p: any) => p.id === product.id);

    let _quantity = quantity;
    if (productInCart) _quantity = productInCart.cartProduct.quantity + quantity;

    setCartLoading(true);
    updateCart({
      productId: product.id,
      quantity: _quantity,
      color: color,
      size: size,
    })
      .then((res) => {
        setCart(res);
        toast.success("Product added to cart");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setCartLoading(false));
  }

  function updateCartQuantity(productId: number, quantity: number, color: number, size: number) {
    setCartLoading(true);
    updateCart({
      productId: productId,
      quantity: quantity,
      color: color,
      size: size,
    })
      .then((res) => {
        setCart(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setCartLoading(false));
  }

  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const shapes = await getShapes();
        setShapes(shapes);
        const materials = await getMaterials();
        setMaterials(materials);
        const styles = await getStyles();
        setStyles(styles);
        const categories = await getCategories();
        setCategories(categories);
        const producers = await getProducers();
        setProducers(producers);
        const colors = await getColors();
        setColors(colors);
        const sizes = await getSizes();
        setSizes(sizes);
        const techniques = await getTechniques();
        setTechniques(techniques);
        const rooms = await getRooms();
        setRooms(rooms);
        const features = await getFeatures();
        setFeatures(features);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTaxonomies();
  }, []);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      setShopLoading(false);
      return;
    }
    if (user.role === "admin") return;
    setShopLoading(true);
    getCart()
      .then((res) => {
        setCart(res);
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() =>
        getWishlist(restoreToken())
          .then((res) => {
            setWishlist(res);
            // console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => setShopLoading(false))
      );
  }, [user, isAuthenticated]);

  return (
    <ShopContext.Provider
      value={{
        addToCart,
        cart,
        setCart,
        wishlist,
        setWishlist,
        shopLoading,
        setShopLoading,
        categories,
        colors,
        setCategories,
        setColors,
        sizes,
        setSizes,
        cartLoading,
        updateCartQuantity,
        producers,
        setProducers,
        materials,
        setMaterials,
        techniques,
        setTechniques,
        styles,
        setStyles,
        shapes,
        setShapes,
        rooms,
        setRooms,
        features,
        setFeatures,
        filter,
        setFilter,
      }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
