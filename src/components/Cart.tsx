import { useNavigate } from "react-router-dom";
import { useShop } from "../context";
// import { toast } from "react-toastify";
// import { updateCart } from "../api/cart";

import LoadingSpinner from "./LoadingSpinner";

export default function Cart() {
  const { cart, shopLoading, updateCartQuantity, cartLoading, deleteFromCart } = useShop();

  const navigate = useNavigate();

  if (shopLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen max-w-[70rem] m-auto">
      <div className="flex justify-between items-center py-4">
        <p className="text-left text-2xl font-semibold my-4">Shopping Cart</p>
        <p className="text-3xl">Total: €{cart.total}</p>
      </div>
      <div className="flex flex-col gap-0 min-h-[75vh] m-auto">
        {cart.products.length > 0 ? (
          <div className="flex flex-col gap-1 items-center justify-between ">
            {cart.products.map((item: any, index: number) => (
              <CartProduct
                key={index}
                item={item}
                deleteFromCart={deleteFromCart}
                updateCartQuantity={updateCartQuantity}
                cartLoading={cartLoading}
              />
            ))}
            <button className="btn btn-primary btn-lg my-12">Checkout</button>
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
  deleteFromCart,
  updateCartQuantity,
  cartLoading,
}: {
  item: any;
  deleteFromCart: any;
  updateCartQuantity: any;
  cartLoading: any;
}) => {
  // console.log(item);
  function handleDelete() {
    deleteFromCart(item.product.id, item.pattern.id, item.size.id);
  }

  function handeIncrease() {
    handleUpdateCart(1);
  }

  function handleDecrease() {
    if (item.quantity === 1) handleDelete();
    else handleUpdateCart(-1);
  }

  function handleUpdateCart(quantity: number) {
    updateCartQuantity(item.product.id, quantity, item.pattern.id, item.size.id);
  }

  const navigate = useNavigate();
  function handleClick() {
    navigate(`/product/${item.product.id}`);
  }

  return (
    <div className="w-full max-w-5xl m-auto shadow bg-base-100 py-4">
      <div className="flex gap-4 items-center">
        <div className="flex justify-evenly w-full gap-6">
          <div className=" w-1/3 h-48 flex flex-col justify-center items-center">
            <img className="object-cover  m-auto h-48 w-64" src={item.pattern.icon} alt="color" />
            <div className="flex gap-4 text-sm px-4 py-1">
              <button onClick={handleDelete} className="text-primary hover:underline">
                Delete
              </button>
              <button className="text-primary hover:underline">Save for later</button>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-left w-1/2 ">
            <p onClick={handleClick} className="font-semibold text-xl cursor-pointer hover:text-[#b04e2d]">
              {item.product.name}
            </p>
            <p className="">Size: {item.size.name}</p>
            {item.pattern.name !== "Main" && item.pattern.name !== "Default" && <p className="">Color: {item.pattern.name}</p>}
          </div>
          {/* <div className="text-left w-1/2 text-sm flex flex-col items-center"> */}
          {/* <p>{item.product.description}</p> */}

          {/* <p className="text-sm font-semibold">{item.pattern.name}</p> */}
          {/* </div> */}
          <div className="w-1/4 flex flex-col items-center gap-4">
            {/* {
              item.quantity > 1 && <span className="text-lg">{item.quantity} x </span>} */}
            <span className="font-semibold text-xl">€{item.product.priceTotal ? item.product.priceTotal : item.product.price}</span>
            <div className="flex items-center gap-1">
              <button disabled={cartLoading} onClick={handleDecrease} className="btn btn-sm text-xl btn-primary px-[10px]">
                -
              </button>
              <p className="input input-sm input-bordered">{item.quantity}</p>
              <button onClick={handeIncrease} className="btn btn-sm text-xl btn-primary px-2" disabled={cartLoading}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
