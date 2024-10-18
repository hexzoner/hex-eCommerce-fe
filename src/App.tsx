import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import "./css/App.css";
import { MainLayout, ProtectedLayout, Authorize, TaxonomyLayout, DashboardLayout } from "./layouts/layouts";
import {
  Home,
  About,
  NotFound,
  Login,
  Signup,
  ProductDetails,
  Cart,
  Profile,
  ForgotPassword,
  Unauthorized,
  Wishlist,
  ProductBrowser,
  RugSizes,
  RugTypes,
  Sales,
} from "./components/components";
import {
  Dashboard,
  Categories,
  Orders,
  Users,
  Products,
  OrderDetails,
  Colors,
  Sizes,
  Reviews,
  HomeArrivals,
  Producers,
} from "./components/admin-area/admin-components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="products" element={<ProductBrowser />} />
      <Route path="rug-sizes" element={<RugSizes />} />
      <Route path="rug-types" element={<RugTypes />} />
      <Route path="sales" element={<Sales />} />
      <Route path="product/:id" element={<ProductDetails />} />

      <Route element={<ProtectedLayout />}>
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile />} />
        <Route path="wishlist" element={<Wishlist />} />

        <Route path="/admin" element={<Authorize roles={["admin"]} />}>
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="categories" element={<Categories />} />
          <Route path="colors" element={<Colors />} />
          <Route path="sizes" element={<Sizes />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="order-details" element={<OrderDetails />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="taxonomy" element={<TaxonomyLayout />}>
            <Route index element={<Categories />} path="categories" />
            <Route path="colors" element={<Colors />} />
            <Route path="sizes" element={<Sizes />} />
            <Route path="producers" element={<Producers />} />
          </Route>

          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="home-latest" element={<HomeArrivals />} />
          </Route>
        </Route>
      </Route>

      <Route path="unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
