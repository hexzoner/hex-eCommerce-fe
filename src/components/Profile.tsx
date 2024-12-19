import { useAuth } from "../context";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function Profile() {
  const { user, authLoading } = useAuth();

  if (authLoading) return <LoadingSpinner />;
  if (!user) <Navigate to={"/"} />;

  return (
    <div className="min-h-screen">
      {/* <p className="text-3xl font-semibold mt-8"> User Profile</p> */}
      <div className="min-h-screen flex flex-col gap-4 justify-center items-center text-2xl text-left">
        <div className="flex justify-between w-full max-w-sm items-center">
          <p className="w-1/2">Email: </p>
          <div className="flex w-1/2 items-center">
            <p className="">{user.email}</p>
            <p
              className={
                `text-base rounded-md py-1 px-2 text-nowrap ml-1 ${user.verified ? `bg-green-600 text-white` : `bg-red-500 text-white`}`
                // ? ` bg-success text-success-content text-base`
                // : ` bg-warning text-warning-content text-base`
              }>
              ({user.verified ? "Verified" : "Not verified"})
            </p>
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
      </div>
    </div>
  );
}
