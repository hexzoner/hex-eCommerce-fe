import { useNavigate } from "react-router-dom";
import { useShop } from "../context";
import { toast } from "react-toastify";
import { updateCart } from "../api/cart";
import LoadingSpinner from "./LoadingSpinner";

export default function Cart() {
  const { cart, setCart, shopLoading, updateCartQuantity, cartLoading } = useShop();
  const navigate = useNavigate();

  if (shopLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen max-w-[70rem] m-auto">
      <p className="text-left text-2xl mt-12 font-semibold">Shopping Cart</p>
      <div className="flex flex-col gap-4  min-h-[75vh] m-auto">
        {cart.products.length > 0 ? (
          <div className="flex flex-col gap-6 items-center justify-between ">
            <p className="text-3xl">Total: €{cart.total}</p>
            {cart.products.map((item: any, index: number) => (
              <CartProduct key={index} item={item} setCart={setCart} updateCartQuantity={updateCartQuantity} cartLoading={cartLoading} />
            ))}
            <button className="btn btn-primary btn-lg mb-12">Checkout</button>
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

export const CartProduct = ({
  item,
  setCart,
  updateCartQuantity,
  cartLoading,
}: {
  item: any;
  setCart: any;
  updateCartQuantity: any;
  cartLoading: any;
}) => {
  // console.log(item);
  function handleDelete() {
    updateCart({ productId: item.product.id, quantity: 0, color: item.color.id, size: item.size.id })
      .then((res) => {
        // console.log(res);
        toast.success("Product removed from cart");
        setCart(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handeIncrease() {
    handleUpdateCart(1);
  }

  function handleDecrease() {
    if (item.quantity === 1) handleDelete();
    else handleUpdateCart(-1);
  }

  function handleUpdateCart(quantity: number) {
    updateCartQuantity(item.product.id, quantity, item.color.id, item.size.id);
  }
  // const colorName = colors.find((x: any) => x.id == item.color.id).name;
  // const sizeName = item.sizes.find((x: any) => x.id == item.product.size).name;

  const navigate = useNavigate();
  function handleClick() {
    navigate(`/product/${item.product.id}`);
  }

  return (
    <div className="w-full">
      <div className="flex gap-4 items-center">
        <img src={item.product.image} alt="Product" className="w-1/6" />
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-2 text-left w-1/3 ">
            <p onClick={handleClick} className="font-semibold text-lg cursor-pointer hover:text-[#b04e2d]">
              {item.product.name}
            </p>
            <p className="text-sm">Size: {item.size.name}</p>
            <p className="text-sm">Color: {item.color.name}</p>
          </div>
          <div className="text-left w-2/3 text-sm flex flex-col ">
            <p>{item.product.description}</p>
          </div>
          <div className="w-1/4 flex flex-col items-center">
            {/* {
              item.quantity > 1 && <span className="text-lg">{item.quantity} x </span>} */}
            <span className="font-semibold text-xl">€{item.product.price}</span>
            <div className="flex items-center gap-1">
              <button disabled={cartLoading} onClick={handleDecrease} className="btn btn-sm text-xl">
                -
              </button>
              <p className="input input-sm input-bordered">{item.quantity}</p>
              <button onClick={handeIncrease} className="btn btn-sm text-xl" disabled={cartLoading}>
                +
              </button>
            </div>
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
