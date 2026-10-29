import  { useState } from 'react'
import  Logo  from '../components/Logo'
import { useNavigate } from 'react-router-dom';
import GoBackButton from '../components/GoBackButton';
import { useAppDispatch } from '../redux/hooks';
import { hideLoader, showLoader } from '../redux/loaderSlice';

const RecoverEmail = () => {
    const navigate=useNavigate();
    const baseUrl=import.meta.env.VITE_API_URL;
    const [email, setEmail] = useState('');
    const [errors, setError] = useState("");
    const dispatch=useAppDispatch();
    const sendOTP = async() => {
        if (!email.trim()) {
            setError('Email is required.');
            return
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        try{
            dispatch(showLoader());
            const response=await fetch(`${baseUrl}/user/forgot-password`,{
                method:'POST', 
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${localStorage.getItem('token')}`
                },
                body:JSON.stringify({
                    email:email
                })
            });

            if(!response.ok){
                throw new Error("Update Failed"); 
             }
        }catch(err){
            console.error(err);
            dispatch(hideLoader());
        }finally{
            dispatch(hideLoader());
            sessionStorage.setItem('forgotPass',email);
            navigate(`/resetPassword/`)
        }
    }
    return (
        <div className="" >
            <GoBackButton/>
            <div className="recovert-email-header"   >
                <Logo size={200} />
            </div>
            <div className='recory-input-section'  >
                <div className="recovery-container">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);

                        }}
                    />
                    <div className='recory-error' >
                    {errors && <div className="error-text">{errors}</div>}
                    </div>
                </div>
            </div>
            <div className="recovery-menu">
                <button className="recovery-button" onClick={sendOTP} >
                    Send OTP
                </button>
            </div>
        </div>
    )
}

export default RecoverEmail
