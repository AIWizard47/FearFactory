import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "@/App.css";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Experiences from "@/pages/Experiences";
import { Toaster } from "@/components/ui/sonner";

// API Configuration - Users can change this
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000",
  ENDPOINTS: {
    login: "/auth/api/token/",
    refreshToken: "/auth/api/token/refresh/",
    signup: "/auth/api/signup",
    checkAuth: "/auth/api/check-auth",
    profile: "/api/user/profile",
    projects: "/projects/project/",
    experiences: "/api/experiences",
    achievements: "/api/achievements"
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS[endpoint] || endpoint}`;
};

// Auth Helper Functions
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

export const setCookie = (name, value, days = 1) => {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

export const isAuthenticated = () => {
  return !!getCookie('access_token');
};

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      let accessToken = getCookie("access_token");
      const refreshToken = getCookie("refresh_token");

      if (!accessToken && !refreshToken) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        console.log("Checking authentication...");

        // 🟩 IMPORTANT FIX: never throw fetch errors
        let response;
        try {
          response = await fetch(getApiUrl("checkAuth"), {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } catch (error) {
          // Network or CORS errors — treat as unauthorized
          response = { ok: false, status: 401 };
        }

        // 🟨 Access token expired → refresh it
        if (response.status === 401) {
          console.log("Access token expired. Trying refresh...");

          let refreshResponse;
          try {
            refreshResponse = await fetch(getApiUrl("refreshToken"), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            });
          } catch (e) {
            refreshResponse = { ok: false };
          }

          if (refreshResponse.ok) {
            console.log("Refresh successful.");
            const data = await refreshResponse.json();
            const newAccessToken = data.access;

            setCookie("access_token", newAccessToken, 1);

            // retry checkAuth with new access token
            const retry = await fetch(getApiUrl("checkAuth"), {
              headers: { Authorization: `Bearer ${newAccessToken}` },
            });

            if (retry.ok) {
              setAuthenticated(true);
              setLoading(false);
              return;
            }
          }

          // 🟥 Refresh failed → logout completely
          console.log("Refresh failed → logging out");
          deleteCookie("access_token");
          deleteCookie("refresh_token");
          setAuthenticated(false);
          setLoading(false);
          window.location.href = "/login";
          return;
        }

        // 🟩 Access token still valid
        if (response.ok) {
          console.log("Access token valid");
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/projects" element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          } />
          <Route path="/experiences" element={
            <ProtectedRoute>
              <Experiences />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
