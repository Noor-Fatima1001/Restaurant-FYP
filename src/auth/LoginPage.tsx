import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/LoginPage.css';
import EyeShow from '/images/eyeshow.svg';
import EyeHide from '/images/eyehide.svg';
import Logo from '../components/Logo';
import { LoginPageErrors } from '../types/interface';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';
import GoBackButton from '../components/GoBackButton';
import { useAppDispatch } from '../redux/hooks';
import { hideLoader, showLoader } from '../redux/loaderSlice';
import { usePopup } from '../components/CustomPopup/PopupContext';

const LoginPage = () => {
    const { mode } = useParams();
    const navigate = useNavigate();
    const {setToken}=useAuth();
    const {showPopup}=usePopup();
    const dispatch=useAppDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<LoginPageErrors>({
        name: '',
        email: '',
        password: '',
        general: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '', general: '' }));
    };

    const validate = () => {
        const newErrors: LoginPageErrors = {
            name: '',
            email: '',
            password: '',
            general: ''
        };

        if (mode === 'guest') {
            if (!formData.name.trim()) {
                newErrors.name = 'Username is required.';
            }
        } else {
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required.';
            } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address.';
            }
            if (!formData.password) {
                newErrors.password = 'Password is required.';
            }else if (formData.password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters long.';
              }
            if (!formData.password) {
                newErrors.password = 'Password is required.';
            }
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const handleLogin = async () => {
        if (validate()) {
            setIsLoading(true);
            try {
                dispatch(showLoader());
                const url = 'https://restaurantbackend.dbitsdemo.com/user/login';
                const body = mode === 'guest'
                    ? { username: formData.name, mode: 'guest' }
                    : { email: formData.email, password: formData.password ,isWeb:true};
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Invalid credentials');
                }

                const data = await response.json();
                if (data?.token) {
                    setToken(data.token);
                    navigate('/welcome', { state: { isAuthenticated: true } });
                } else {
                    throw new Error('Unexpected error occurred');
                }
            } catch (error) {
                dispatch(hideLoader());
                setErrors({
                    name: '',
                    email: '',
                    password: '',
                    general: error.message
                });
            } finally {
                dispatch(hideLoader());
                setIsLoading(false);
                const popUpText=`Login Successful as ${mode} user `
                showPopup(popUpText);
            }
        }
    };

    const buttonTitle = mode === 'guest'
        ? 'Login as Guest'
        : mode === 'premium'
            ? 'Login as Premium User'
            : 'Login';

    return (
        <div className="login-container">
        <GoBackButton/>
            <div className="login-header">
                <Logo size={200} />
            </div>
            <div className='login-body'>
                <div className="welcome-text">
                    <div className='welcome-text-title' >Welcome to Rowley's!</div>
                    <div className='welcome-text-subtitle' >Sign in and enjoy the world of Rowley's</div>
                </div>

                {mode === 'guest' ? (
                    <div className="login-input-container">
                        <input
                            name="name"
                            type="text"
                            placeholder="Enter Username"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        {errors.name && <p className="error-text">{errors.name}</p>}
                    </div>
                ) : (
                    <>
                        <div className="login-input-container">
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            {errors.email && <p className="error-text">{errors.email}</p>}
                        </div>

                        <div className="login-input-container login-password-container">
                            <input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <img
                                    src={showPassword ? EyeHide : EyeShow}
                                    alt={showPassword ? 'Hide Password' : 'Show Password'}
                                />
                            </button>
                        </div>
                        {errors.password && <p className="error-text">{errors.password}</p>}
                    </>
                )}

                <small
                    className='forgot-password'
                    
                >
                    <span className='forgot-password-link' onClick={() => navigate("/recover")} >
                    Forgot Password?
                    </span>
                </small>

                {errors.general && <p className="error-text">{errors.general}</p>}

                <div className="login-button-container">
                    <button
                        onClick={handleLogin}
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : buttonTitle}
                    </button>
                    {
                        mode==="normal"?
                            <div className="login-button-container">
                                    <GoogleLoginButton/>
                            </div>
                        :null
                    }
                </div>

                <div className="footer-links">
                    <div
                        className="register-button"
                        >
                        <div className='register-link'onClick={() => navigate(`/signup/${mode}`)} >  Register here</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;