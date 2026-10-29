
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate=useNavigate();
    const {profileData}=useAppSelector(state=>state.profile);
    const navigator=(path:string)=>{
        navigate(path);
        toggleSidebar();
    }
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="close-btn" onClick={toggleSidebar}>X</button>
            <div className="sidebar-header">
                <h1>{profileData.username ? profileData.username:'Login' } </h1>
                <p>Upgrade to Family Member</p>
            </div>
            <ul className="sidebar-menu">
                <li>
                    <div onClick={()=>navigator("/profile")}  >
                        <span className="menu-icon">👤</span>
                        <div >My Profile</div>
                        <span className="menu-arrow">→</span>
                    </div>
                </li>=
                <li>
                    <div>
                    <span className="menu-icon">ℹ️</span>
                    <div>About</div>
                    <span className="menu-arrow">→</span>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
