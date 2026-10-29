import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { usePopup } from "./CustomPopup/PopupContext";

const GoogleSignUpButton = () => {
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const { setToken } = useAuth();
  const {showPopup}=usePopup();
  const handleLoginSuccess = async (credentialResponse) => {
    try {
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
      navigate("/welcome");
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setShowGoogleLogin(false);
      const popUpText="Sign Successful with google"
      showPopup(popUpText);
    }
  };

  useEffect(() => {
    if (showGoogleLogin && buttonRef.current) {
      const googleButton = buttonRef.current.querySelector('div[role="button"]');
      if (googleButton) {
        googleButton.click();
      }
      // Reset the state after a short delay if no response
      setTimeout(() => setShowGoogleLogin(false), 1000);
    }
  }, [showGoogleLogin]);

  return (
    <div className="signup-button-container relative">
      <button
        className="signup-button"
        onClick={() => setShowGoogleLogin(true)}
        type="button"
      >
        SignUp with Google
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

export default GoogleSignUpButton;