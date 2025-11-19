import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import Home from "./pages/Home";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditPrroducts";
import EditCategory from "./pages/admin/EditCategory";
import "./index.css";
import Categories from "./pages/admin/categories";
import AddCategories from "./pages/admin/AddCategory";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetails";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/products-page" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/add-products" element={<AddProduct />} />
                <Route path="/products/edit/:id" element={<EditProduct />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/edit-category/:id" element={<EditCategory />} />
                <Route path="/add-category" element={<AddCategories />} />
              </Routes>
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
