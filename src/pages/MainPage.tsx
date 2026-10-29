// import } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import CartPage from "./CartPage";
import ProductsPage from "./ProductsPage";
import ProfilePage from "./ProfilePage";
import ServicesDashboard from "./ServicesDashboard";
import SplashPage from "./SplashPage";
import UserAccessPage from "./UserAccessPage";
import UserInfoPage from "./UserInfoPage";
import WelcomePage from "./WelcomePage";
import CheckoutForm from "./CheckoutForm";
import GoBackButton from "../components/GoBackButton";
import OrderDetails from "./OrderDetails";
import SubscriptionsPage from "./Subscriptions";
import FreeProductsPage from "./FreeProductsPage";
import SubscriptionCartPage from "./SubscriptionCartPage";

const MainPage = () => {
  return (
    <div className="main-layout">
      <div >
      <GoBackButton/>
        <main className="main-content">

          <Routes>
            <Route path="/splash" element={
                <SplashPage />
            } />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/checkout" element={<CheckoutForm/>} />
            <Route path="/access-opt" element={<UserAccessPage />} />
            <Route path="/userInfo" element={<UserInfoPage />} />
            <Route path="/services" element={<ServicesDashboard />} />
            {/* <Route path="/cart" element={<CartPage />} /> */}
            <Route path="/cart" element={<SubscriptionCartPage />} />
            <Route path="/order-details" element={<OrderDetails/>} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/free-products" element={<FreeProductsPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Routes>
        </main>
      </div>
      <footer className="body-footer">
        <Footer />
      </footer>
    </div>
  );
};

export default MainPage;
