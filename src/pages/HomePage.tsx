import { useEffect } from 'react';
import Logo from '../components/Logo';
import '../styles/HomePage.css';
import { useNavigate } from 'react-router-dom';
import { useTableIdManagement } from '../hooks/useTableIdManagement';
import { useAuth } from '../context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '../redux/hooks';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { usePopup } from '../components/CustomPopup/PopupContext';

const HomePage = () => {
  const {showPopup}=usePopup();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const { getTableId } = useTableIdManagement();
  const { checkAuth, setToken } = useAuth();
  const dispatch=useAppDispatch();
  const getOrCreateSessionId = () => {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  useEffect(() => {
    const tableId = getTableId();
    if (!tableId) {
      console.warn("tableId not found");
    }
    getOrCreateSessionId();
  }, [getTableId]);

  const withoutLogin = () => {
    const sessionId = getOrCreateSessionId();
    dispatch(showLoader());
      fetch(`${baseUrl}/signup/guest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: sessionId }),
      })
      .then((response) => {
        dispatch(hideLoader());
        if (!response.ok) {
          throw new Error('Failed to proceed without login');
        }
        return response.json();
      })
      .then((data) => {
        setToken(data.token);
        checkAuth();
        navigate('/welcome');
        const popUpText="Welcome to rowleys"
        showPopup(popUpText);
      })
      .catch((error) => {
        dispatch(hideLoader());
        console.error('Error:', error);
      });
  };

  return (
    <div className="home-container">
      <div className="logo-container">
        <Logo size={200} />
      </div>
      <div className="button-container">
        <button className="home-page-buttons" onClick={() => navigate('/login/premium')}>
          Premium Login
        </button>
        <button className="home-page-buttons" onClick={() => navigate('/login/normal')}>
          Login
        </button>
        <button className="home-page-buttons" onClick={withoutLogin}>
          Without Login
        </button>
      </div>
    </div>
  );
};

export default HomePage;
