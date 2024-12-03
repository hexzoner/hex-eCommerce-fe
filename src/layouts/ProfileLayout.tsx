import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => `btn btn-ghost  + ${isActive ? `underline underline-offset-4 text-[#b63c3e]` : ""} `;
  return (
    <div className="min-h-screen">
      <div className="flex w-full">
        <ul className="menu bg-base-200 rounded-none w-56 min-h-screen">
          <li>
            <NavLink to="account" className={navLinkClass}>
              Account
            </NavLink>
          </li>
          <li>
            <NavLink to="personal-details" className={navLinkClass}>
              Personal Details
            </NavLink>
          </li>
          <li>
            <NavLink to="order-history" className={navLinkClass}>
              Order History
            </NavLink>
          </li>
          <li>
            <NavLink to="settings" className={navLinkClass}>
              Settings
            </NavLink>
          </li>
        </ul>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
