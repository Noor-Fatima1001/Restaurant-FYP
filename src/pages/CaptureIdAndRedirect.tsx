/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePopup } from "../components/CustomPopup/PopupContext";
import Cookies from "js-cookie";

const CaptureIdAndRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tableId = queryParams.get("tableId");
  const { showPopup } = usePopup();
  const baseUrl = import.meta.env.VITE_API_URL;

  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Token validation failed");

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const refreshToken = async (token: string) => {
    try {
      const response = await fetch(`${baseUrl}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Token refresh failed");

      const data = await response.json();
      localStorage.setItem("token", data.token);
      return true;
    } catch (error) {
      console.error(error)
      return false;
    }
  };

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (!tableId) {
        console.warn("No table ID found in query params.");
        showPopup("Scan the QR code to get started");
        return;
      }

      Cookies.set("tableId", tableId, { expires: 6 / 24, path: "/" });

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/", { replace: true });
        return;
      }

      const isTokenValid = await validateToken(token);
      if (isTokenValid) {
        navigate("/welcome", { replace: true });
        return;
      }

      const isRefreshed = await refreshToken(token);
      if (isRefreshed) {
        navigate("/welcome", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    };

    checkAuthAndRedirect();
    
  }, [navigate, location]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src="/images/rowleysLogo.png"
        style={{ maxWidth: "400px", height: "200px" }}
        alt=""
      />
    </div>
  );
};

export default CaptureIdAndRedirect;
