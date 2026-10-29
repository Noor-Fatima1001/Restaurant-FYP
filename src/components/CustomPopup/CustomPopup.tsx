import React from 'react';
import { usePopup } from './PopupContext';
import '../../styles/CustomPopup.css';
import { IoCloseSharp } from 'react-icons/io5';

const CustomPopup: React.FC = () => {
  const { isOpen, message, hidePopup,isOk } = usePopup();

  return (
    <div className={`popup-overlay ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <div className='custom-popup-close-button-container' >
        <div className='custom-popup-close-button' onClick={hidePopup} ><IoCloseSharp /></div>
        </div>
        <p>{message}</p>
        <div className='custom-popup-Ok-button-container'  style={{ display: isOk ? "flex" : "none" }} >
        <button className='custom-popup-Ok-button' onClick={hidePopup} >Ok</button>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
