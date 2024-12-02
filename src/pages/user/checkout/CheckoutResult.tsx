import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyCheckoutSession } from "../../../api/checkout";
import { createOrder } from "../../../api/orders";
import { getCart } from "../../../api/cart";

export const CheckoutResult = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    async function verySession() {
      if (!isMounted) return;
      if (sessionId) {
        // setPaymentStatus("SUCCESS");
        const sessionData = await verifyCheckoutSession({ sessionId });
        if (sessionData && sessionData.paymentStatus === "paid" && isMounted) {
          // console.log(sessionData);
          //creating new oreder and check if order exists in db with this session id
          const cartData = await getCart();
          // console.log(cartData);
          if (!cartData) {
            setPaymentStatus("FAILED");
            setErrorMessage("Something went wrong - No cart data found.");
            setLoading(false);
            return;
          }
          const products = cartData.products.map((product: any) => ({
            productId: product.product.id,
            patternId: product.pattern.id,
            sizeId: product.size.id,
            quantity: product.quantity,
          }));
          const orderData = await createOrder({ products, stripeSessionId: sessionId });
          // console.log(orderData);
          if (orderData.status && orderData.status === 400) {
            // Trying to create order with the same stripe session id
            setPaymentStatus("FAILED");
            setErrorMessage(orderData.message);
          } else setPaymentStatus("SUCCESS");
        } else if (isMounted) {
          setPaymentStatus("FAILED");
        }
      } else if (isMounted) {
        setPaymentStatus("FAILED");
        setErrorMessage("No session ID provided.");
      }
      setLoading(false);
    }

    verySession();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // console.log({ isSuccess, isCanceled, paymentStatus, errorMessage, sessionId });
  if (loading) return <Loading />;

  if (isSuccess && paymentStatus === "SUCCESS") {
    return <Success />;
  } else if (isCanceled || paymentStatus === "FAILED") {
    return <Cancelled errorMessage={errorMessage} />;
  } else {
    return <Loading />;
  }
};

function Success() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <p>Thank you for your purchase!</p>
        <ContinueShoppingButton />
      </div>
    </div>
  );
}

function Cancelled({ errorMessage }: { errorMessage: string | null }) {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex flex-col gap-4">
        <p>Something went wrong or the payment was cancelled.</p>
        {errorMessage && <p>{errorMessage}</p>}
        <ReturnToCartButton />
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="h-screen flex justify-center items-center">
      <p>Processing... </p>
    </div>
  );
}

function ReturnToCartButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/cart")} className="btn btn-primary">
      Return to Cart
    </button>
  );
}

function ContinueShoppingButton() {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate("/products")} className="btn btn-primary">
      Continue Shopping
    </button>
  );
}

export default CheckoutResult;
