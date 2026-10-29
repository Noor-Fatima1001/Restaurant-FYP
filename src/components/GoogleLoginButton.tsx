import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch } from "../redux/hooks";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { usePopup } from "./CustomPopup/PopupContext";

const GoogleLoginButton = () => {
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const {showPopup}=usePopup();
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const { setToken } = useAuth();
  const dispatch=useAppDispatch();
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      dispatch(showLoader());
      const response = await fetch(`${baseUrl}/google-login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      const popUpText="Login Successful with google Login"
      showPopup(popUpText);
      navigate("/welcome");
    } catch (error) {
      dispatch(hideLoader())
      console.error('Login error:', error);
    } finally {
      dispatch(hideLoader())
      setShowGoogleLogin(false);
    }
  };

  useEffect(() => {
    if (showGoogleLogin && buttonRef.current) {
      const googleButton = buttonRef.current.querySelector('div[role="button"]');
      if (googleButton) {
        googleButton.click();
      }
      setTimeout(() => setShowGoogleLogin(false), 1000);
    }
  }, [showGoogleLogin]);

  return (
    <div className="login-button-container relative">
      <button
        className="login-button"
        onClick={() => setShowGoogleLogin(true)}
        type="button"
      >
        Login with Google
      </button>
      
      {showGoogleLogin && (
        <div 
          ref={buttonRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            useOneTap={false}
            type="standard"
            theme="outline"
            shape="rectangular"
            width="100%"
          />
        </div>
      )}
    </div>
  );
};

export default GoogleLoginButton;