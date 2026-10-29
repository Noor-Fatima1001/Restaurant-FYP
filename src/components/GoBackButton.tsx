import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import rightIcon from "../assets/SVG/Elementos_Flecha 2.svg";

const GoBackButton :React.FC= () => {
  const navigate = useNavigate();
  const location=useLocation();
  return (
    <div className="go-back-container"  style={{display:location.pathname==="/welcome"?"none":"block"}} >
      <button className="go-back-btn" onClick={() => navigate(-1)}>
        <img src={rightIcon} className="go-back-icon" alt="Go Back" />
      </button>
    </div>
  );
};

export default GoBackButton;
