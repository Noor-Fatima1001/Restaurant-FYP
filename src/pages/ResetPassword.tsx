import  {  useState } from 'react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import {  ResetPasswordErrors } from '../types/interface';
import { usePopup } from '../components/CustomPopup/PopupContext';
import GoBackButton from '../components/GoBackButton';
import { useAppDispatch } from '../redux/hooks';
import { hideLoader, showLoader } from '../redux/loaderSlice';

const RecoverEmail: React.FC = () => {
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_URL;
    const email = sessionStorage.getItem("forgotPass");
    const [otp, setOtp] = useState('');;
    const { showPopup } = usePopup();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch=useAppDispatch();
    const [errors, setErrors] = useState<ResetPasswordErrors>({
        otp: '',
        newPassword: '',
        confirmPassword: '',
        email: ''
    });

    const validateInputs = () => {
        const newErrors: ResetPasswordErrors = {
            otp: '',
            newPassword: '',
            confirmPassword: '',
            email: ''
        };
        if (!email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!otp.trim()) {
            newErrors.otp = 'OTP is required.';
        }
        if (!newPassword.trim()) {
            newErrors.newPassword = 'New password is required.';
        } else if (newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters.';
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).filter(key => newErrors[key as keyof ResetPasswordErrors] !== '').length === 0;
    };

    const handleSubmit = async () => {
        if (validateInputs()) {
            try{
                dispatch(showLoader());
                await fetch(`${baseUrl}/user/forgot-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        email: email,
                        otp: otp,
                        newPassword: newPassword,
                        confirmPassword: confirmPassword,
                    })
                });
            }catch(err){
                console.error(err)
                dispatch(hideLoader());
            }finally{
                dispatch(hideLoader());
                showPopup(`Password reset successfully`);
                navigate('/');
            }
        }
    };

    return (
        <div className="">
        <GoBackButton/>
            <div className="recovery-header">
                <Logo size={200} />
            </div>
            <div className="recory-input-section">
                <div className="recovery-container">
                    <input
                        type="text"
                        placeholder="Enter Email"
                        value={email}
                        readOnly
                    />
                    {errors.email && <div className="error-text">{errors.email}</div>}
                </div>
                <div className="recovery-container">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    {errors.otp && <div className="error-text">{errors.otp}</div>}
                </div>
                <div className="recovery-container">
                    <input
                        type="password"
                        placeholder="Enter New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {errors.newPassword && <div className="error-text">{errors.newPassword}</div>}
                </div>
                <div className="recovery-container">
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
                </div>
            </div>
            <div className="recovery-menu">
                <button className="recovery-button" onClick={handleSubmit}>
                    Reset Password
                </button>
            </div>
        </div>
    );
};

export default RecoverEmail;
