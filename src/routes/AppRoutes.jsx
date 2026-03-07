import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/Landing/LandingPage";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import OtpVerification from "../pages/Auth/OtpVerification";
import ResetPassword from "../pages/Auth/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";
import tester from "../pages/tester";

import DashboardHome from "../pages/Dashboard/pages/DashboardHome";
import Inventory from "../pages/Dashboard/pages/Inventory";
import MisplacedProducts from "../pages/Dashboard/pages/MisplacedProducts";
import ProductQualityCheck from "../pages/Dashboard/pages/ProductQualityCheck";
import Orders from "../pages/Dashboard/pages/Orders";
import Shipping from "../pages/Dashboard/pages/Shipping";
import Reports from "../pages/Dashboard/pages/Reports";
import Settings from "../pages/Dashboard/pages/Settings";
import Help from "../pages/Dashboard/pages/Help";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/tester" element={<tester />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/reset-password" element={<ResetPassword />} />
       <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="misplaced" element={<MisplacedProducts />} />
        <Route path="product-quality" element={<ProductQualityCheck />} />
        <Route path="orders" element={<Orders />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>
    </Routes>
  );
}
