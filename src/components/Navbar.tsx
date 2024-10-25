import { NavLink, useLocation } from "react-router-dom";
import { useAuth, useShop } from "../context";
import { useState, useEffect } from "react";
// import { mainMakrupColors } from "./Home";
export const activeColor = "#b63c3e";
import { NavbarMenuDropdown } from "./components";
const navLinkClass = ({ isActive }: { isActive: boolean }) => `btn btn-ghost  + ${isActive ? `text-[${activeColor}]` : ""} `;

export default function Navbar() {
  const { user, isAuthenticated, logout, authLoading } = useAuth();
  const { cart, setCart, rooms, categories } = useShop();

  const htmlElement = document.querySelector("html");
  if (htmlElement) htmlElement.setAttribute("data-theme", "winter");

  // if (htmlElement && !authLoading) {
  //   if (user && user.role == "admin") htmlElement.setAttribute("data-theme", "business");
  //   else htmlElement.setAttribute("data-theme", "winter");
  // }

  return (
    <div className="bg-[#eff2f6] text-black">
      <div className="bg-[#303030]">
        <div className="flex justify-center text-white py-2 gap-6 font-normal flex-wrap px-2">
          <span className="text-sm">Quality Excellence</span>
          <span className="text-sm">|</span>
          <span className="text-sm">Sustanability</span>
          <span className="text-sm">|</span>
          <span className="text-sm">Cultural Appreciation</span>
          <span className="text-sm">|</span>
          <span className="text-sm">Integrity</span>
          <span className="text-sm">|</span>
          <span className="text-sm">4.7/5 Truspilot</span>
        </div>
      </div>
      <div className="navbar max-w-screen-xl m-auto font-normal text-lg">
        <div className="flex-1 flex-wrap ">
          <NavLink to="/" className="text-2xl mr-4">
            <Logo fill={"black"} />
          </NavLink>
          {isAuthenticated && user.role == "admin" ? (
            <>
              <NavLink to="admin/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="admin/taxonomy" className={navLinkClass}>
                Taxonomy
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
              <NavLink to="admin/reviews" className={navLinkClass}>
                Reviews
              </NavLink>
            </>
          ) : (
            <>
              {/* <NavLink to="/products" className={navLinkClass}>
                Featured Rugs
              </NavLink> */}
              {/* <NavLink to="/rug-types" className={navLinkClass}>
                Rug Types
              </NavLink> */}
              <NavbarMenuDropdown name={"Featured Rugs"} options={[]} />
              <NavbarMenuDropdown name={"Rug Types"} options={categories} />
              <NavbarMenuDropdown name={"Rug Sizes"} options={rooms} />
              {/* <NavLink to="/rug-sizes" className={navLinkClass}>
                Rug Sizes
              </NavLink> */}
              <NavLink to="/sales" className={navLinkClass}>
                Sales
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
              <Search />
              {isAuthenticated && user.role == "user" && <></>}
            </>
          )}
        </div>

        {!authLoading ? (
          <>
            {!isAuthenticated ? (
              <div className="flex flex-wrap">
                <NavLink to="/wishlist" className={navLinkClass}>
                  Wishlist
                </NavLink>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink to="/signup" className={navLinkClass}>
                  Signup
                </NavLink>
              </div>
            ) : (
              <div className="flex gap-1 text-sm flex-wrap">
                {/* <span className="italic">Logged as: </span>
                <span className="text-info mr-3">{user?.email}</span> */}

                {user.role === "user" && (
                  <>
                    <NavLink to="/wishlist" className={navLinkClass}>
                      Wishlist
                    </NavLink>
                    {/* <NavLink to="/cart" className={navLinkClass}>
                      Cart
                    </NavLink> */}
                    <CartIcon cart={cart} />
                  </>
                )}
                <NavLink
                  to="/profile"
                  className={({ isActive }: { isActive: boolean }) =>
                    `cursor-pointer hover:opacity-75 "  + ${isActive ? `fill-[${activeColor}]` : "fill-current"} `
                  }>
                  <UserProfileSVG />
                </NavLink>
                <button
                  onClick={() => {
                    logout();
                    setCart({ products: [], total: 0 });
                    // window.location.href = "/";
                  }}
                  className="btn btn-ghost  ">
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <></>
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

export const CartIcon = ({
  cart,
}: {
  cart: {
    products: any[];
    total: number;
  };
}) => {
  if (!cart || !cart.products) return <></>;

  const [isActive, setIsActive] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setIsActive(location.pathname === "/cart");
  }, [location]);

  return (
    <div className="dropdown dropdown-end ">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke={isActive ? "#b63c3e" : `currentColor`}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className={`badge badge-md indicator-item ${isActive ? `text-[${activeColor}]` : ""}`}>{cart.products.length}</span>
        </div>
      </div>
      <div tabIndex={0} className="card card-compact dropdown-content bg-base-200 z-[1] mt-3 w-52 shadow">
        <div className="card-body">
          <span className="text-lg font-bold text-neutral">{cart.products.length} Items</span>
          <span className="text-neutral">Subtotal: €{cart.total}</span>
          <div className="card-actions">
            {/* <NavLink to="/cart" className="btn btn-primary btn-block"> */}
            <NavLink to="/cart" className={`btn btn-primary btn-block ${isActive ? "fill-[#b63c3e]" : "fill-current"}`}>
              Cart
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Logo = ({ fill }: { fill: string }) => {
  return (
    <svg width="70" height="20" viewBox="0 0 70 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.00994 4.09091V6.36364H0.440341V4.09091H7.00994ZM1.93182 1.47727H4.95739V11.6477C4.95739 11.9271 5 12.1449 5.08523 12.3011C5.17045 12.4527 5.28883 12.5592 5.44034 12.6207C5.59659 12.6823 5.77652 12.7131 5.98011 12.7131C6.12216 12.7131 6.2642 12.7012 6.40625 12.6776C6.5483 12.6491 6.6572 12.6278 6.73295 12.6136L7.20881 14.8651C7.05729 14.9124 6.84422 14.9669 6.5696 15.0284C6.29498 15.0947 5.96117 15.1349 5.56818 15.1491C4.83902 15.1776 4.19981 15.0805 3.65057 14.858C3.10606 14.6354 2.68229 14.2898 2.37926 13.821C2.07623 13.3523 1.92708 12.7604 1.93182 12.0455V1.47727ZM13.2352 15.2131C12.1131 15.2131 11.1472 14.9858 10.3375 14.5312C9.53258 14.072 8.91231 13.4233 8.4767 12.5852C8.0411 11.7424 7.8233 10.7457 7.8233 9.59517C7.8233 8.47301 8.0411 7.48816 8.4767 6.64062C8.91231 5.79309 9.52547 5.13258 10.3162 4.65909C11.1116 4.18561 12.0444 3.94886 13.1145 3.94886C13.8342 3.94886 14.5042 4.06487 15.1244 4.29688C15.7494 4.52415 16.2939 4.86742 16.758 5.3267C17.2267 5.78598 17.5913 6.36364 17.8517 7.05966C18.1121 7.75095 18.2423 8.56061 18.2423 9.48864V10.3196H9.03068V8.4446H15.3943C15.3943 8.009 15.2996 7.62311 15.1102 7.28693C14.9208 6.95076 14.658 6.68797 14.3219 6.49858C13.9904 6.30445 13.6045 6.20739 13.1642 6.20739C12.7049 6.20739 12.2977 6.31392 11.9426 6.52699C11.5922 6.73532 11.3176 7.01705 11.1188 7.37216C10.9199 7.72254 10.8181 8.11316 10.8134 8.54403V10.3267C10.8134 10.8665 10.9128 11.3329 11.1116 11.7259C11.3152 12.1188 11.6017 12.4219 11.971 12.6349C12.3403 12.848 12.7783 12.9545 13.2849 12.9545C13.6211 12.9545 13.9289 12.9072 14.2082 12.8125C14.4876 12.7178 14.7267 12.5758 14.9256 12.3864C15.1244 12.197 15.2759 11.965 15.3801 11.6903L18.1784 11.875C18.0364 12.5473 17.7452 13.1345 17.3048 13.6364C16.8692 14.1335 16.3058 14.5218 15.6145 14.8011C14.9279 15.0758 14.1348 15.2131 13.2352 15.2131ZM19.6168 19.0909V4.09091H22.5997V5.9233H22.7347C22.8672 5.62973 23.059 5.33144 23.3099 5.02841C23.5656 4.72064 23.8971 4.46496 24.3043 4.26136C24.7162 4.05303 25.2276 3.94886 25.8384 3.94886C26.6338 3.94886 27.3677 4.1572 28.0401 4.57386C28.7124 4.9858 29.2498 5.60843 29.6523 6.44176C30.0547 7.27036 30.256 8.30966 30.256 9.55966C30.256 10.7765 30.0595 11.804 29.6665 12.642C29.2782 13.4754 28.7479 14.1075 28.0756 14.5384C27.408 14.9645 26.6598 15.1776 25.8312 15.1776C25.2441 15.1776 24.7446 15.0805 24.3327 14.8864C23.9255 14.6922 23.5917 14.4484 23.3312 14.1548C23.0708 13.8565 22.872 13.5559 22.7347 13.2528H22.6423V19.0909H19.6168ZM22.5784 9.54545C22.5784 10.1941 22.6684 10.7599 22.8483 11.2429C23.0282 11.7259 23.2886 12.1023 23.6295 12.3722C23.9705 12.6373 24.3848 12.7699 24.8724 12.7699C25.3649 12.7699 25.7815 12.6349 26.1224 12.3651C26.4634 12.0904 26.7214 11.7116 26.8966 11.2287C27.0765 10.741 27.1665 10.1799 27.1665 9.54545C27.1665 8.91572 27.0789 8.36174 26.9037 7.88352C26.7285 7.4053 26.4705 7.03125 26.1295 6.76136C25.7886 6.49148 25.3696 6.35653 24.8724 6.35653C24.38 6.35653 23.9634 6.48674 23.6224 6.74716C23.2863 7.00758 23.0282 7.37689 22.8483 7.85511C22.6684 8.33333 22.5784 8.89678 22.5784 9.54545ZM31.673 19.0909V4.09091H34.656V5.9233H34.7909C34.9235 5.62973 35.1152 5.33144 35.3662 5.02841C35.6219 4.72064 35.9533 4.46496 36.3605 4.26136C36.7724 4.05303 37.2838 3.94886 37.8946 3.94886C38.6901 3.94886 39.424 4.1572 40.0963 4.57386C40.7687 4.9858 41.3061 5.60843 41.7085 6.44176C42.111 7.27036 42.3122 8.30966 42.3122 9.55966C42.3122 10.7765 42.1157 11.804 41.7227 12.642C41.3345 13.4754 40.8042 14.1075 40.1318 14.5384C39.4642 14.9645 38.7161 15.1776 37.8875 15.1776C37.3004 15.1776 36.8009 15.0805 36.3889 14.8864C35.9817 14.6922 35.6479 14.4484 35.3875 14.1548C35.1271 13.8565 34.9282 13.5559 34.7909 13.2528H34.6986V19.0909H31.673ZM34.6347 9.54545C34.6347 10.1941 34.7246 10.7599 34.9045 11.2429C35.0845 11.7259 35.3449 12.1023 35.6858 12.3722C36.0267 12.6373 36.441 12.7699 36.9287 12.7699C37.4211 12.7699 37.8378 12.6349 38.1787 12.3651C38.5196 12.0904 38.7777 11.7116 38.9528 11.2287C39.1328 10.741 39.2227 10.1799 39.2227 9.54545C39.2227 8.91572 39.1351 8.36174 38.9599 7.88352C38.7848 7.4053 38.5267 7.03125 38.1858 6.76136C37.8449 6.49148 37.4259 6.35653 36.9287 6.35653C36.4363 6.35653 36.0196 6.48674 35.6787 6.74716C35.3425 7.00758 35.0845 7.37689 34.9045 7.85511C34.7246 8.33333 34.6347 8.89678 34.6347 9.54545ZM46.8401 15.206C46.144 15.206 45.5238 15.0852 44.9793 14.8438C44.4348 14.5975 44.0039 14.2353 43.6866 13.7571C43.3741 13.2741 43.2179 12.6728 43.2179 11.9531C43.2179 11.3471 43.3292 10.8381 43.5517 10.4261C43.7742 10.0142 44.0773 9.68277 44.4608 9.43182C44.8443 9.18087 45.2799 8.99148 45.7676 8.86364C46.26 8.7358 46.7761 8.64583 47.3159 8.59375C47.9504 8.52746 48.4617 8.46591 48.85 8.40909C49.2383 8.34754 49.52 8.25758 49.6952 8.1392C49.8704 8.02083 49.958 7.84564 49.958 7.61364V7.57102C49.958 7.12121 49.8159 6.7732 49.5318 6.52699C49.2525 6.28078 48.8547 6.15767 48.3386 6.15767C47.7941 6.15767 47.3609 6.27841 47.0389 6.51989C46.7169 6.75663 46.5039 7.05492 46.3997 7.41477L43.6014 7.1875C43.7435 6.52462 44.0228 5.9517 44.4395 5.46875C44.8562 4.98106 45.3936 4.60701 46.0517 4.34659C46.7146 4.08144 47.4816 3.94886 48.3528 3.94886C48.9589 3.94886 49.5389 4.01989 50.0929 4.16193C50.6516 4.30398 51.1464 4.52415 51.5773 4.82244C52.0129 5.12074 52.3562 5.50426 52.6071 5.97301C52.858 6.43703 52.9835 6.99337 52.9835 7.64205V15H50.1142V13.4872H50.029C49.8538 13.8281 49.6194 14.1288 49.3259 14.3892C49.0323 14.6449 48.6795 14.8461 48.2676 14.9929C47.8557 15.1349 47.3798 15.206 46.8401 15.206ZM47.7065 13.1179C48.1516 13.1179 48.5446 13.0303 48.8855 12.8551C49.2264 12.6752 49.4939 12.4337 49.6881 12.1307C49.8822 11.8277 49.9793 11.4844 49.9793 11.1009V9.94318C49.8846 10.0047 49.7544 10.0616 49.5886 10.1136C49.4277 10.161 49.2454 10.206 49.0418 10.2486C48.8382 10.2865 48.6346 10.322 48.431 10.3551C48.2274 10.3835 48.0427 10.4096 47.877 10.4332C47.5219 10.4853 47.2117 10.5682 46.9466 10.6818C46.6814 10.7955 46.4755 10.9493 46.3287 11.1435C46.1819 11.3329 46.1085 11.5696 46.1085 11.8537C46.1085 12.2656 46.2577 12.5805 46.556 12.7983C46.859 13.0114 47.2425 13.1179 47.7065 13.1179ZM57.7564 0.454545V15H54.7308V0.454545H57.7564ZM66.5758 10.3551V4.09091H69.6014V15H66.6965V13.0185H66.5829C66.3367 13.6577 65.9271 14.1714 65.3542 14.5597C64.786 14.9479 64.0924 15.142 63.2732 15.142C62.5441 15.142 61.9025 14.9763 61.3485 14.6449C60.7945 14.3134 60.3613 13.8423 60.0488 13.2315C59.741 12.6207 59.5848 11.8892 59.58 11.0369V4.09091H62.6056V10.4972C62.6103 11.1411 62.7832 11.6501 63.1241 12.0241C63.465 12.3982 63.9219 12.5852 64.4948 12.5852C64.8594 12.5852 65.2003 12.5024 65.5175 12.3366C65.8348 12.1662 66.0905 11.9152 66.2846 11.5838C66.4835 11.2524 66.5805 10.8428 66.5758 10.3551Z"
        fill={fill.length > 0 ? fill : "black"}
      />
    </svg>
  );
};

const Search = () => {
  return (
    <label className="input input-bordered flex items-center gap-2 input-sm">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
      <input type="text" className="grow" placeholder="Search" />
    </label>
  );
};
