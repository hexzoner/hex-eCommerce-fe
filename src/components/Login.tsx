import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoadingSpinner } from "./components";
import { loginApiCall } from "../api/auth";
// import { toast } from "react-toastify";
import { useShop } from "../context";
// import { storeToken } from "../utils/storage";
// import { toast } from "react-toastify";
// import { mainMakrupColors } from "./Home";
import useRedirect from "../hooks/useRedirect";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const { setUser, setIsAuthenticated, setAuthLoading } = useAuth();
  const { login } = useShop();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>();

  const { redirectTo } = useRedirect();
  async function onSubmit(data: { email: string; password: string }) {
    setIsLoading(true);
    try {
      const res = await loginApiCall(data.email, data.password);
      login(res);
      setIsLoading(false);
      if (res.user.role === "admin") navigate("/admin/dashboard");
      else {
        redirectTo();
        // navigate("/");
      }
    } catch (err) {
      setIsLoading(false);
      // toast.error("Login failed");
    }
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="login-background">
      <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen ">
        <div className="h-screen flex items-center justify-center">
          <div className="flex flex-col gap-6 justify-center items-center bg-white max-w-lg m-auto pt-12 pb-8 px-16 border-[1.5px] border-black border-opacity-60">
            <p className="text-lg font-semibold">Customer Login</p>
            <div className="">
              <label className="input input-bordered flex items-center gap-2 border-neutral border-opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  className="grow"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </label>
              {errors.email && <p className="text-error text-xs text-left mt-1 ml-2 absolute">{errors.email.message?.toString()}</p>}
            </div>
            <div>
              <label htmlFor="password" className="input input-bordered flex items-center gap-2  border-neutral border-opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  type="password"
                  id="password"
                  className="grow"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
              </label>
              {errors.password && <p className="text-error text-xs text-left mt-1 ml-2 absolute">{errors.password.message?.toString()}</p>}
            </div>
            <button type="submit" className="btn btn-primary px-8">
              Login
            </button>
            <div className="label ">
              <span
                onClick={() => navigate("/forgot-password")}
                className="label-text-alt font-bold text-blue-600 hover:underline hover:cursor-pointer">
                Forgot your password?
              </span>
            </div>
            <div className="label ">
              <span onClick={() => navigate("/signup")} className="label-text-alt font-bold text-blue-600  hover:underline hover:cursor-pointer">
                Don't have an account yet? Signup here!
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
