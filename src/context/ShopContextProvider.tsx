import { useState, ReactNode, useEffect } from "react";
import { restoreToken, storeToken } from "../utils/storage";
import { getWishlist, addToWishlist } from "../api/wishlist";
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
import { restoreWishlist, storeWishlist } from "../utils/storage";

const ShopProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, isAuthenticated, setIsAuthenticated, setAuthLoading } = useAuth();
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

  function addToCart(product: any, quantity: number, size: number, pattern: number) {
    // if (!cart) return;
    if (!user || !isAuthenticated) {
      toast.error("Please login to add products to cart");
      return;
    }
    const productInCart = cart.products.find((p: any) => p.id === product.id);

    let _quantity = quantity;
    if (productInCart) _quantity = productInCart.cartProduct.quantity + quantity;

    // console.log({
    //   productId: product.id,
    //   quantity: _quantity,
    //   pattern,
    //   size: size,
    // });

    setCartLoading(true);
    updateCart({
      productId: product.id,
      quantity: _quantity,
      pattern,
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

  function updateCartQuantity(productId: number, quantity: number, pattern: number, size: number) {
    setCartLoading(true);
    updateCart({
      productId: productId,
      quantity: quantity,
      pattern,
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
      setWishlist(restoreWishlist());
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
            // console.log(res);
            const wishlistFromStorage = restoreWishlist();

            const newItemsFromStorage = wishlistFromStorage.filter((item: any) => !res.find((i: any) => i.id === item.id));
            // console.log(newItemsFromStorage);
            // console.log("-----------------");
            if (newItemsFromStorage.length > 0) {
              newItemsFromStorage.forEach((item: any) => {
                addToWishlist(restoreToken(), item.id)
                  .then(() => {
                    // if (res.status === "success") {
                    //   // toast.success(res.message);
                    //   storeWishlist(wishlistFromStorage.filter((i: any) => i.id !== item.id));
                    // }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }

            const combinedWithlist = [...wishlistFromStorage, ...res].reduce((acc, current) => {
              // Check if the current item is already in the accumulator array
              const x = acc.find((item: any) => item.id === current.id);
              if (!x) {
                // If not found, add the current item to the accumulator array
                acc.push(current);
              }
              // Return the accumulator array
              return acc;
            }, []); // Initial value for the accumulator is an empty array

            storeWishlist([]);
            setWishlist(combinedWithlist);
            // console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => setShopLoading(false))
      );
  }, [user, isAuthenticated]);

  function login(res: any) {
    setUser(res.user);
    setIsAuthenticated(true);
    setAuthLoading(false);
    storeToken(res.token);
  }

  return (
    <ShopContext.Provider
      value={{
        login,
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
