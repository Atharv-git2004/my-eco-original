import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Google OAuth Provider Import
import { GoogleOAuthProvider } from "@react-oauth/google";

// Project Modules
import UserModule from "./views/auth/user/UserModule";
import AdminModule from "./views/admin/AdminModule";
import SellerModule from "./views/seller/SellerModule";

// Auth Pages
import Authentication from "./views/auth/Authentication";

/**
 * 🔒 ProtectedRoute
 * Grants access only to logged-in users.
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = sessionStorage.getItem("token");
  let user = null;

  try {
    const userData = sessionStorage.getItem("user");
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data", error);
  }

  // 1. If no token or user data, redirect to login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check role (must match backend role exactly)
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * 🔓 PublicRoute
 * Prevents logged-in users from accessing login/register pages.
 */
const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  // നിങ്ങളുടെ Google Cloud Console-ൽ നിന്നുള്ള Client ID ഇവിടെ നൽകുക
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <div className="App">
          {/* Toast Notifications - display app messages */}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            theme="colored"
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <Routes>
            {/* Public Routes - logged-in users should not access */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Authentication register={false} />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Authentication register={true} />
                </PublicRoute>
              }
            />

            {/* Admin Routes - only accessible by Admin */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRole="Admin">
                  <AdminModule />
                </ProtectedRoute>
              }
            />

            {/* Seller Routes - only accessible by Seller */}
            <Route
              path="/seller/*"
              element={
                <ProtectedRoute allowedRole="Seller">
                  <SellerModule />
                </ProtectedRoute>
              }
            />

            {/* User / General Routes - homepage, products, etc. */}
            <Route path="/*" element={<UserModule />} />

            {/* Fallback - redirect invalid URLs to homepage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
