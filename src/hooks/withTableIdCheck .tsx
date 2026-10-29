import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTableIdManagement } from './useTableIdManagement';

export const withTableIdCheck = (WrappedComponent) => {
  return function WithTableIdCheckComponent(props) {
    const { getTableId } = useTableIdManagement();
    const navigate = useNavigate();

    useEffect(() => {
      const tableId = getTableId();
      if (!tableId) {
        navigate('/table', { 
          replace: true,
          state: { from: window.location.pathname }
        });
      }
    }, [navigate, getTableId]);

    return <WrappedComponent {...props} />;
  };
};