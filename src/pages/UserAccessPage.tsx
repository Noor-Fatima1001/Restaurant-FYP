
import { useNavigate } from 'react-router-dom';
import diningIcon from "../assets/SVG/Elementos_Ilustracion 1.svg"
const UserAccessPage = () => {
  const navigate=useNavigate();
  return (
    <div className="user-access-page">
      <img
        src={diningIcon}
        style={{maxWidth:"250px",height:'250px'}}
        alt="Dining Illustration"
        className="header-image"
      />
      <h1 className="welcome-title">Welcome to Rowley's</h1>
      <p className="welcome-subtitle">
        Offering exceptional atmosphere, premium steaks, and unforgettable
        dining experiences.
      </p>
      <div className="divider"></div>
      <div className='button-container-user-access-page' >
      <button className="user-access-create-account-btn"  onClick={()=>navigate("/signup")} >Create Account</button>
      </div>
    </div>
  );
};

export default UserAccessPage;
