import { useEffect, useState } from 'react';
import '../styles/ProfilePage.css';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchProfile, UpdateProfile } from '../redux/ProfileSlice';
import { usePopup } from '../components/CustomPopup/PopupContext';
import { updateProfileForm } from '../types/interface';
import { clearCart } from '../redux/cartSlice';
import { hideLoader, showLoader } from '../redux/loaderSlice';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const dispatch = useAppDispatch();
  const { profileData, loading, error } = useAppSelector((state) => state.profile);

  const [username, setUsername] = useState(profileData.username || '');
  const [email, setEmail] = useState(profileData.email || '');
  const [userType, setUserType] = useState(profileData.userType || '');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [updateProfile, setUpdateProfile] = useState(false);

  // Validation States
  const [errors, setErrors] = useState<{ username?: string; email?: string; newPassword?: string; currentPassword?: string }>({});

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profileData) {
      setUsername(profileData.username || '');
      setEmail(profileData.email || '');
      setUserType(profileData.userType || '');
    }
  }, [profileData]);

  const validateForm = () => {
    let valid = true;
    const newErrors: typeof errors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
      valid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = 'Invalid email format.';
      valid = false;
    }

    if (newPassword && newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters.';
      valid = false;
    }
    if (newPassword && !currentPassword) {
      newErrors.currentPassword = 'Current password is required to change password.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogout = () => {
    try {
      dispatch(showLoader());
      showPopup("Logged out successfully");
      localStorage.removeItem('token');
      dispatch(clearCart());
      localStorage.removeItem('tableId');
      localStorage.removeItem('sessionId');
      navigate("/");
    } catch (err) {
      dispatch(hideLoader());
    } finally {
      dispatch(hideLoader());
    }
  };

  if (loading) {
    dispatch(showLoader());
    return <div></div>;
  }

  if (error) {
    dispatch(hideLoader());
    return (
      <div className="profile-center">
        <div className="profile-error-text">{error}</div>
      </div>
    );
  }

  if (!loading) {
    dispatch(hideLoader());
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData: updateProfileForm = {
      username,
      email,
      ...(currentPassword && { currentPassword }),
      ...(newPassword && { newPassword }),
    };

    try {
      dispatch(showLoader());
      const resultAction = await dispatch(UpdateProfile(formData));

      if (UpdateProfile.rejected.match(resultAction)) {
        setUpdateProfile(false);
        const errorMessage = resultAction.payload as string;
        showPopup(errorMessage);
      } else {
        setUpdateProfile(false);
        showPopup("Profile updated successfully!");
      }
    } catch (error) {
      dispatch(hideLoader());
      showPopup(error as string);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Logo size={200} />
      </div>
      {profileData.userType !== 'Guest' && (
        <div style={{ display: 'flex', justifyContent: 'end', paddingRight: '10px' }}>
          <button className='profile-update-button' onClick={() => setUpdateProfile(!updateProfile)}>
            {updateProfile ? 'Cancel' : 'Update'}
          </button>
        </div>
      )}
      <div className="profile-section">
        <div className='avatar'>
          <img src="/images/user.png" alt="" />
        </div>
        <div className="profile-name">
          <input 
            type="text" 
            className='profile-input' 
            disabled={!updateProfile} 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          {errors.username && <div className="error-text">{errors.username}</div>}
        </div>
        <div className="profile-email">
          {email ? (
            <>
              <input 
                type="text" 
                className='profile-input' 
                disabled={!updateProfile} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              <div>
              {errors.email && <div className="error-text">{errors.email}</div>}
              </div>
            </>
          ) : (
            <div>{profileData.email || 'No Email'}</div>
          )}
        </div>
        {updateProfile && (
          <>
            <div className="profile-email">
              <input 
                placeholder='Current Password' 
                type="password" 
                className='profile-input' 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
              />
              {errors.currentPassword && <div className="error-text">{errors.currentPassword}</div>}
            </div>
            <div className="profile-email">
              <input 
                type="password" 
                placeholder='Enter New Password' 
                className='profile-input' 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
              {errors.newPassword && <div className="error-text">{errors.newPassword}</div>}
            </div>
          </>
        )}
        <div className="profile-email">{userType || 'No User Type'}</div>
      </div>
      <div className="profile-menu">
        {updateProfile ? (
          <button className="profile-button" onClick={handleSubmit}>Save</button>
        ) : (
          <button className="profile-button" onClick={handleLogout}>Log Out</button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
