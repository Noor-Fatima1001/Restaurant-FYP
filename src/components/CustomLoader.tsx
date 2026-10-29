import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const CustomLoader: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);

  if (!isLoading) return null;

  return (
    <div className="popup-overlay open">
      <div style={{ minHeight: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src="/images/loader.svg" alt="Loading..." style={{ width: '50px', height: '50px' }} />
      </div>
    </div>
  );
};

export default CustomLoader;
