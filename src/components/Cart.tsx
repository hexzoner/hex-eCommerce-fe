import { useNavigate } from "react-router-dom";
import { useShop } from "../context";
import { updateCart } from "../api/cart";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";

export default function Cart() {
  const { cart, setCart, colors, shopLoading } = useShop();
  const navigate = useNavigate();

  if (shopLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen max-w-[70rem] m-auto">
      <p className="text-left text-2xl mt-12 font-semibold">Shopping Cart</p>
      <div className="flex flex-col gap-4  min-h-[75vh] m-auto">
        {cart && cart.products.length > 0 ? (
          <div className="flex flex-col gap-4 items-center justify-between ">
            <p className="text-3xl">Total: €{cart.total}</p>
            {cart.products.map((product: any) => (
              <CartProduct key={product.id} product={product} setCart={setCart} colors={colors} />
            ))}
            <button className="btn btn-primary btn-lg">Checkout</button>
          </div>
        ) : (
          <>
            <p>There are no items in your cart.</p>
            <button onClick={() => navigate("/")} className="hover:text-primary">
              Continue Shopping →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export const CartProduct = ({ product, setCart, colors }: { product: any; setCart: any; colors: any }) => {
  // console.log(product);
  function handleDelete() {
    updateCart({ productId: product.id, quantity: 0, color: product.cartProduct.color, size: product.cartProduct.size })
      .then((res) => {
        // console.log(res);
        toast.success("Product removed from cart");
        setCart(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const colorName = colors.find((x: any) => x.id == product.cartProduct.color).name;
  const sizeName = product.sizes.find((x: any) => x.id == product.cartProduct.size).name;

  return (
    <div>
      <div className="flex gap-4 items-center w-full">
        <img src={product.image} alt="Product" className="w-1/6" />
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-2 text-left w-1/3 ">
            <p className="font-semibold text-lg">{product.name}</p>
            <p className="text-sm">Size: {sizeName}</p>
            <p className="text-sm">Color: {colorName}</p>
          </div>
          <div className="text-left w-2/3 text-sm flex flex-col ">
            <p>{product.description}</p>
          </div>
          <div className="w-1/4">
            {product.cartProduct.quantity > 1 && <span className="text-lg">{product.cartProduct.quantity} x </span>}
            <span className="font-semibold text-xl">€{product.price}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4 text-sm px-4">
        <button onClick={handleDelete} className="text-primary hover:underline">
          Delete
        </button>
        <button className="text-primary hover:underline">Save for later</button>
      </div>
    </div>
  );
};
