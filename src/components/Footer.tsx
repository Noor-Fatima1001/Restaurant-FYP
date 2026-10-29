
import { useNavigate } from 'react-router-dom';
import user from "../assets/SVG/Elementos_Profile.svg"
import homeImg from "../assets/SVG/Elementos_Home.svg"
import settingsIcon from "../assets/SVG/Elementos_Settings.svg"
const Footer = () => {

  const navigate = useNavigate();
  return (
    <div className="footer">
      <div className='footer-container' >
        <button className="footer-btn">
          <span className="footer-icon"><img src={settingsIcon} alt='' /></span>
        </button>
        <button className="footer-btn active">
          <span className="footer-icon" onClick={() => { navigate("/welcome") }} ><img src={homeImg} alt="" /></span>
        </button>
        <button className="footer-btn">
          <span className="footer-icon" onClick={() => navigate("/profile")} ><img src={user} alt="" /></span>
        </button>
      </div>
    </div>
  );
};

export default Footer;
