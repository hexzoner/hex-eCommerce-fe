import { useAuth } from "../context";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { sendVerificationEmail } from "../api/email";
import { toast } from "react-toastify";
import { useState } from "react";
import { LoadingSpinnerSmall } from "./admin-area/admin-components";

export default function Profile() {
  const { user, authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  if (authLoading) return <LoadingSpinner />;
  if (!user) <Navigate to={"/"} />;

  async function sendVerificationEmailHandler() {
    setLoading(true);
    sendVerificationEmail(user.email)
      .then((res) => {
        toast.info("Verification email sent to: " + user.email);
        console.log(res);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  }

  // const [result, setResult] = useState<string>()
  // const input = 2779 //-> ['A', 'B', 'C', 'c', 'A', 'D']
  // const iterableArray = Array.from(iterable);


  return (
    <div className="min-h-screen">
      {/* <p className="text-3xl font-semibold mt-8"> User Profile</p> */}
      <div className="min-h-screen flex flex-col gap-4 justify-center items-center text-2xl text-left">
        <div className="flex justify-between w-full max-w-sm items-center">
          <p className="w-1/2">Email: </p>
          <div className="flex w-1/2 items-center gap-2">
            <p className="">{user.email}</p>
            <p
              className={
                `text-base rounded-md py-1 px-2 text-nowrap ml-1 ${user.verified ? `bg-green-600 text-white` : `bg-red-500 text-white`}`
                // ? ` bg-success text-success-content text-base`
                // : ` bg-warning text-warning-content text-base`
              }>
              ({user.verified ? "Verified" : "Not verified"})
            </p>
            {!user.verified && (
              <button onClick={sendVerificationEmailHandler} className="btn btn-success btn-sm">
                {loading ? <LoadingSpinnerSmall /> : "Resend email"}
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-between w-full max-w-sm items-center">
          <p className="w-1/2">First Name: </p>
          <p className="w-1/2">{user.firstName}</p>
        </div>
        <div className="flex justify-between w-full max-w-sm items-center">
          <p className="w-1/2">Last Name:</p>
          <p className="w-1/2"> {user.lastName}</p>
        </div>
        {/* <div>
          <p>{input}</p>
          <input type="text" className="input" />
          <button onClick={toRoman} className="btn btn-neutral">Result</button>
          <p>{result}</p>
        </div> */}
      </div>
    </div>
  );
}
