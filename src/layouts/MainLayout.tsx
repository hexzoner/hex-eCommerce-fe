import { Outlet } from "react-router-dom";
import { Navbar, Footer, Toast } from "../components/components";
import { AuthContextProvider } from "../context";

const MainLayout = () => {
  return (
    <>
      <div className="font-montserrat font-medium">
        <AuthContextProvider>
          <Navbar />
          <Outlet />
        </AuthContextProvider>
        <Footer />
        <Toast />
      </div>
    </>
  );
};

export default MainLayout;
