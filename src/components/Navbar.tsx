import { NavLink } from "react-router-dom";
import { useAuth } from "../context";
// import { mainMakrupColors } from "./Home";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navLinkClass = ({ isActive }: { isActive: boolean }) => `btn btn-ghost  + ${isActive ? "underline underline-offset-4 text-info" : ""} `;

  const htmlElement = document.querySelector("html");
  if (htmlElement) {
    if (user && user.role == "admin") htmlElement.setAttribute("data-theme", "business");
    else htmlElement.setAttribute("data-theme", "winter");
  }

  return (
    <div className="bg-[#1f3041] text-white">
      <div className="navbar max-w-screen-xl m-auto">
        <div className="flex-1">
          {isAuthenticated && user.role == "admin" ? (
            <>
              <NavLink to="admin/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="admin/categories" className={navLinkClass}>
                Categories
              </NavLink>
              <NavLink to="admin/colors" className={navLinkClass}>
                Colors
              </NavLink>
              <NavLink to="admin/products" className={navLinkClass}>
                Products
              </NavLink>
              <NavLink to="admin/orders" className={navLinkClass}>
                Orders
              </NavLink>
              <NavLink to="admin/users" className={navLinkClass}>
                Users
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
              {isAuthenticated && user.role == "user" && <></>}
            </>
          )}
        </div>
        {!isAuthenticated ? (
          <div className="flex-none">
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className={navLinkClass}>
              Signup
            </NavLink>
          </div>
        ) : (
          <div className="flex gap-4 text-sm">
            <span className="italic">Logged as: </span>
            <span className="text-accent mr-2">{user?.email}</span>
            <NavLink
              to="/profile"
              className={({ isActive }: { isActive: boolean }) =>
                `cursor-pointer hover:opacity-75 "  + ${isActive ? "fill-accent" : "fill-current"} `
              }>
              <UserProfileSVG />
            </NavLink>
            <button
              onClick={() => {
                logout();
                // window.location.href = "/";
              }}
              className="btn btn-ghost  ">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const UserProfileSVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="" className="size-8">
      <path
        fillRule="evenodd"
        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
