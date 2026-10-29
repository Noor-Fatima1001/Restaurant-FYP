import foxIcon from "../assets/SVG/Elementos_Fox 1.svg"
import { useNavigate } from 'react-router-dom';
const UserInfoPage = () => {
    const navigate=useNavigate();
  return (
    <div className="user-info-container">
      <img src={foxIcon} style={{maxHeight:'250px',maxWidth:'250px'}} alt="" />
      
      <h1 className="user-info-title">Hey, who are you?</h1>
      <p className="user-info-subtitle">Please tell us your name</p>
      
      <div className="user-info-form">
        <input type="text" placeholder="First Name"/>
        <input type="text" placeholder="Last Name"/>
        <button className="continue-btn"  onClick={()=>{navigate("/welcome")}}  >Continue</button>
      </div>
      
      <button className="user-info-skip-link"  onClick={()=>{navigate("/welcome")}} >I want to do this later</button>
    </div>
  );
};

export default UserInfoPage;