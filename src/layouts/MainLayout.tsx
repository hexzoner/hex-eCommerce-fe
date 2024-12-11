import { Outlet } from "react-router-dom";
import { Navbar, Footer, Toast } from "../components/components";
import { AuthContextProvider } from "../context";
import { ShopContextProvider } from "../context";

const MainLayout = () => {
  return (
    <>
      <div className="font-nunito font-medium bg-[#f5f6fa]">
        <AuthContextProvider>
          <ShopContextProvider>
            <Navbar />
            <Outlet />
          </ShopContextProvider>
        </AuthContextProvider>
        <Footer />
        <Toast />
      </div>
    </>
  );
};

export default MainLayout;
