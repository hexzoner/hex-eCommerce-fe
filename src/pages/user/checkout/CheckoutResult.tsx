import { useSearchParams } from "react-router-dom";

export const CheckoutResult = () => {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";

  if (isSuccess) {
    return <Success />;
  } else if (isCanceled) {
    return <Cancelled />;
  } else {
    return <Loading />;
  }
};

function Success() {
  return (
    <div className="h-screen flex justify-center items-center">
      <p>Thank you for your purchase!</p>
    </div>
  );
}

function Cancelled() {
  return (
    <div className="h-screen flex justify-center items-center">
      <p>Payment was canceled. Please try again.</p>
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

export default CheckoutResult;
