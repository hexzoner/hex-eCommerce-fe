import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => `btn btn-ghost  + ${isActive ? "underline underline-offset-4 text-error" : ""} `;
  return (
    <div className="min-h-screen">
      <div className="flex w-full">
        <ul className="menu bg-base-200 rounded-none w-56 min-h-screen">
          <li>
            <NavLink to="home-latest" className={navLinkClass}>
              Latest Arrivals
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

export default DashboardLayout;
