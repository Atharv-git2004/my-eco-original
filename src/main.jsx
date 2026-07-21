import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ Google OAuth Provider
import { GoogleOAuthProvider } from "@react-oauth/google";

// ✅ Global styles
import "./css/custom.css";


const GOOGLE_CLIENT_ID = "30671830914-3vlfie9c5robgotp1s9rd31t98or96al.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);