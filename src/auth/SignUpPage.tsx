import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Signup.css';
import EyeShow from '../assets/eyeshow.svg';
import EyeHide from '../assets/eyehide.svg';
import Logo from '../components/Logo';
import { Errors, SignUpPageProps } from '../types/interface';
import GoogleSignUpButton from '../components/GoogleSignUpButton';
import GoBackButton from '../components/GoBackButton';
import { useAppDispatch } from '../redux/hooks';
import { hideLoader, showLoader } from '../redux/loaderSlice';

const SignUpPage: React.FC<SignUpPageProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });
  const [errors, setErrors] = useState<Errors>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const param=useParams();
  const mode=param.mode;
  const dispatch=useAppDispatch();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    setErrors(prev => ({ ...prev, [name]: '', general: '' }));
  };

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validate = (): boolean => {
    const newErrors: Errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: ''
    };

    if (mode !== 'guest') {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required.';
      }
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
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSignUp = async () => {
    if (validate()) {
      setIsLoading(true);

      const url = mode === 'guest'
        ? '/signup/guest'
        : mode === 'premium'
          ? '/signup/premiumWeb'
          : '/signup/normal';

      const body = mode === 'guest'
        ? { username: formData.name }
        : {
          username: formData.name,
          email: formData.email,
          password: formData.password
        };

      try {
        dispatch(showLoader());
        const response = await fetch(`${baseUrl}${url}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const responseData = await response.json();

        if (!response.ok) {
          if (responseData.details) {
            setErrors(prev => ({
              ...prev,
              ...(responseData.details.email && { email: responseData.details.email }),
              ...(responseData.details.username && { name: responseData.details.username }),
              general: responseData.error || 'Sign up failed'
            }));
          } else {
            setErrors({ ...errors, general: responseData.message || 'Sign up failed' });
          }
          return;
        }

        navigate(`/login/${mode}`, { state: { mode } });
      } catch (error) {
        dispatch(hideLoader());
        console.error('Signup error:', error);
        setErrors(prev => ({ ...prev, general: 'An unexpected error occurred' }));
      } finally {
        dispatch(hideLoader());
        setIsLoading(false);
      }
    }
  };

  const buttonTitle = mode === 'guest'
    ? 'Sign Up as Guest'
    : mode === 'premium'
      ? 'Sign Up as Premium User'
      : 'Sign Up';

  return (
    <div className="signup-container">
        <GoBackButton/>
      <div className="signUp-header">
        <Logo size={200} />
      </div>
      <div className="body-section">
        <div className="intro-section">
          <div className='intro-section-title' >
            <div>
              Hi there!
            </div>
            <div>
              <img height={60} width={60} src="/images/handshake.png" alt="" />
            </div>
          </div>
          <div className='intro-section-subtitle' >Sign up and enjoy the world of Rowley's</div>
        </div>

        <div className="form-section">
          {mode !== 'guest' && (
            <>
              <div className="form-group">
                <div className='signup-email-container'>
                  <input
                    name="name"
                    className="signup-page-input"
                    type="text"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && <div className="error-text">{errors.name}</div>}
                </div>
              </div>
              <div className="form-group">
                <div className='signup-email-container'>
                  <input
                    name="email"
                    className="signup-page-input"
                    type="email"
                    placeholder="Enter Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <div className="error-text">{errors.email}</div>}
                </div>
              </div>
              <div className="form-group signup-password-container">
                <input
                  name="password"
                  className="signup-page-input"
                  type={showPassword.password ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('password')}
                >
                  <img
                    src={showPassword.password ? EyeHide : EyeShow}
                    alt={showPassword.password ? 'Hide Password' : 'Show Password'}
                  />
                </button>
              </div>
              {errors.password && <div className="error-text">{errors.password}</div>}
              <div className="form-group signup-password-container">
                <input
                  name="confirmPassword"
                  className="signup-page-input"
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  <img
                    src={showPassword.confirmPassword ? EyeHide : EyeShow}
                    alt={showPassword.confirmPassword ? 'Hide Password' : 'Show Password'}
                  />
                </button>
              </div>
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
            </>
          )}
          <div>
            {errors.general && <div className="error-text">{errors.general}</div>}
          </div>

          <button
            className="signup-button"
            onClick={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ?'Loading...' : buttonTitle}
          </button>
        <div className={ mode==="normal" ?`google-signup-show`:`google-signup-hide`}> 
          <GoogleSignUpButton />
        </div>
        </div>

        <div className="login-section">
          <p>
            Already have an account?{' '}
            <span
              onClick={() => navigate(`/login/${mode}`)}
              className="login-link"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;