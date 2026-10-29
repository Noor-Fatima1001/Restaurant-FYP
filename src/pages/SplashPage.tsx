
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import "../styles/SplashPage.css"
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';
import { fetchProfile } from '../redux/ProfileSlice';
const SplashPage = () => {
    const buttonTitle = 'Enter World';
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading } = useAppSelector((state) => state.profile);
    useEffect(() => {
        dispatch(fetchProfile());
    }, [])
    return (
        <div>
            {
                loading ?
                    <div style={{ minHeight: '100dvh', display: 'flex', justifyContent: 'center',alignItems:'center' }} ><img
                        src="/images/loader.svg"
                        alt="Loading..."
                        style={{ width: "50px", height: "50px" }}
                    /></div>
            :
            <div className="splash-screen ">
                <div className="background">
                    <div className='d-flex flex-column justify-content-between' style={{ flex: '1' }}  >
                        <div style={{ display: 'flex', flex: '1', justifyContent: 'center', alignItems: 'center' }} >
                            <Logo size={200} />
                        </div>
                        <div style={{ flex: '1.5', textAlign: 'center', color: '#ffffff' }}>
                            <div className="splas-heading text-center">Hi Carlos!</div>
                            <div style={{ fontSize: '0.8rem' }}>Welcome to Rowley's</div>
                            <button className='splash-button' onClick={() => { navigate("/welcome") }} >{buttonTitle}</button>
                        </div>
                    </div>
                </div>
            </div>
            }
        </div>
    );
};

export default SplashPage;
