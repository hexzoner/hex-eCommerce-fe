import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// import axios from "axios";

export const CheckoutResult = () => {
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      setPaymentStatus("SUCCESS");
      // axios
      //   .get(`/verify-checkout-session?session_id=${sessionId}`)
      //   .then((response) => {
      //     console.log(response.data);
      //     if (response.data.success) {
      //       setPaymentStatus("SUCCESS");
      //     } else {
      //       setPaymentStatus("FAILED");
      //       setErrorMessage(response.data.error);
      //     }
      //   })
      //   .catch((error) => {
      //     setPaymentStatus("Error fetching payment status.");
      //     console.error(error);
      //   });
    } else {
      setPaymentStatus("FAILED");
      setErrorMessage("No session ID provided.");
    }
  }, [searchParams]);

  // console.log({ isSuccess, isCanceled, paymentStatus, errorMessage, sessionId });

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
        <p>Payment was canceled. Please try again.</p>
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
