import { Outlet } from "react-router-dom";
import { Navbar, Footer, Toast } from "../components/components";
import { AuthContextProvider } from "../context";
import { ShopContextProvider } from "../context";

const MainLayout = () => {
  return (
    <>
      <div className="font-montserrat font-medium">
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
