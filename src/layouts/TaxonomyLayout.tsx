import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";

const TaxonomyLayout = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => `btn btn-ghost  + ${isActive ? `underline underline-offset-4 text-[#b63c3e]` : ""} `;
  return (
    <div className="min-h-screen">
      <div className="flex w-full">
        <ul className="menu bg-base-200 rounded-none w-56 min-h-screen">
          <li>
            <NavLink to="categories" className={navLinkClass}>
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink to="colors" className={navLinkClass}>
              Colors
            </NavLink>
          </li>
          <li>
            <NavLink to="sizes" className={navLinkClass}>
              Sizes
            </NavLink>
          </li>
          <li>
            <NavLink to="producers" className={navLinkClass}>
              Producers
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

export default TaxonomyLayout;
