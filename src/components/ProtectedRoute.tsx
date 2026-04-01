import type { ReactNode } from "react";

import axios from "axios";
import { Navigate } from "react-router";
import { useState, useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE;

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // week2 - 檢查登入狀態api(包含檢查token自動登入)

    const token = document.cookie
      .split(";")
      .find((txt) => txt.startsWith("someCookieName="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }
    const checkLogin = async () => {
      try {
        const url = `${API_BASE_URL}/v2/api/user/check`;
        const response = await axios.post(url);
        if (response.data.success) {
          setIsAuth(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response?.data.message);
        }
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) return <RotatingLines />;
  if (!isAuth) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
