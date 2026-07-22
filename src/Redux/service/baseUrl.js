// src/Redux/service/baseUrl.js

// Live Render backend URL
const LIVE_URL = "https://my-eco-original-backend.onrender.com";

// Local development URL
const LOCAL_URL = "http://localhost:5000";

// Automatically detects whether the app is running in production (Vercel) or local development
export const BASE_URL = process.env.NODE_ENV === "production" ? LIVE_URL : LOCAL_URL;

// If you want to strictly force only the Live Render Backend everywhere, use this instead:
// export const BASE_URL = "https://my-eco-original-backend.onrender.com";
