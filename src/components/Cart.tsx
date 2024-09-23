import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen max-w-[70rem] m-auto">
      <p className="text-left text-2xl mt-12 font-semibold">Shopping Cart</p>
      <div className="flex flex-col gap-4 items-center justify-center min-h-[75vh]">
        <p>There are no items in your cart.</p>
        <button onClick={() => navigate("/")} className="hover:text-primary">
          Continue Shopping →
        </button>
      </div>
    </div>
  );
}
