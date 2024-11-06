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
import { getSizes, getSizeById } from "../api/sizes";
import { getCart, updateCart } from "../api/cart";
import { toast } from "react-toastify";
import { getProducers } from "../api/producers";
import { getRooms } from "../api/rooms";
import { getFeatures } from "../api/features";
import { iFilter } from ".";
import { restoreWishlist, storeCart, restoreCart } from "../utils/storage";
import { getPatternById } from "../api/patterns";

interface iShopCartProduct {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    priceTotal: number;
  };
  quantity: number;
  size: {
    id: number;
    name: string;
  };
  pattern: {
    id: number;
    name: string;
    icon: string;
  };
}

interface iShopCart {
  products: iShopCartProduct[];
  total: number;
}

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
  const [cart, setCart] = useState<iShopCart>({ products: [], total: 0 });

  const [shopLoading, setShopLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  function calcCart(userCart: iShopCartProduct[]) {
    for (let i = 0; i < userCart.length; i++) {
      const heightWidth = userCart[i].size.name.split("x");
      if (heightWidth.length === 2)
        userCart[i].product.priceTotal = Number((userCart[i].product.price * Number(heightWidth[0]) * Number(heightWidth[1])).toFixed(2));
    }

    // Calculate the total price
    const totalPrice = userCart.reduce((total, item) => {
      return total + item.product.priceTotal * item.quantity;
    }, 0);

    return { products: userCart, total: Number(totalPrice.toFixed(2)) };
  }

  async function addToCart(product: any, quantity: number, size: number, pattern: number) {
    // if (!cart) return;
    if (!user || !isAuthenticated) {
      const productInCart = cart.products.find((p: any) => p.product.id === product.id && p.size.id === size && p.pattern.id === pattern);
      if (productInCart) {
        const products = cart.products.map((p: any) => {
          if (p.product.id === product.id && p.size.id === size && p.pattern.id === pattern) {
            if (quantity === 0) return null;
            if (quantity > 0) {
              return {
                ...p,
                quantity: p.quantity + quantity,
              };
            }
          }
          return p;
        });
        const newCart = calcCart(products.filter((p: any) => p !== null));
        setCart(newCart);
        storeCart(newCart);
      } else {
        const newSize = await getSizeById(size);
        const newPattern = await getPatternById(pattern);
        const newProduct: iShopCartProduct = {
          product: product,
          quantity: quantity,
          size: newSize,
          pattern: newPattern,
        };

        const newCart = calcCart([...cart.products, newProduct]);

        setCart(newCart);
        storeCart(newCart);
      }
      return;
    }

    let _quantity = quantity;

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

  async function deleteFromCart(productId: number, pattern: number, size: number) {
    if (user && isAuthenticated) {
      updateCart({ productId, quantity: 0, pattern, size: size })
        .then((res) => {
          // console.log(res);
          toast.success("Product removed from cart");
          setCart(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const updatedCartProducts = cart.products.filter((p: any) => p.product.id !== productId || p.size.id !== size || p.pattern.id !== pattern);
      const updatedCart = calcCart(updatedCartProducts);
      setCart(updatedCart);
      storeCart(updatedCart);
    }
  }

  function updateCartQuantity(productId: number, quantity: number, pattern: number, size: number) {
    if (user && isAuthenticated) {
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
    } else {
      const updatedCart = cart.products.map((p: any) => {
        if (p.product.id === productId && p.size.id === size && p.pattern.id === pattern) {
          return {
            ...p,
            quantity: p.quantity + quantity,
          };
        }
        return p;
      });
      const newCart = calcCart(updatedCart);
      setCart(newCart);
      storeCart(newCart);
    }
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
      setCart(restoreCart());
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

            // storeWishlist([]);
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
        deleteFromCart,
      }}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
