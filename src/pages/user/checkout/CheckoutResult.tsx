import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { verifyCheckoutSession } from "../../../api/checkout";

export const CheckoutResult = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    setLoading(true);
    async function verySession() {
      if (sessionId) {
        // setPaymentStatus("SUCCESS");
        const sessionData = await verifyCheckoutSession({ sessionId });
        if (sessionData && sessionData.paymentStatus === "paid") {
          //check if order exists in db with this session id else show error "Payment already processed"
          setPaymentStatus("SUCCESS");
        } else {
          setPaymentStatus("FAILED");
        }
      } else {
        setPaymentStatus("FAILED");
        setErrorMessage("No session ID provided.");
      }
      setLoading(false);
    }

    verySession();
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
