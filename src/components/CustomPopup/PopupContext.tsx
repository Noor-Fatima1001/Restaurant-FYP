import React, { createContext, useContext, useState, ReactNode } from 'react';
interface PopupContextType {
  isOpen: boolean;
  message: ReactNode;
  showPopup: (text: ReactNode,showOkbtn?:boolean) => void;
  hidePopup: () => void;
  isOk:boolean;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

interface PopupProviderProps {
  children: ReactNode;
}
export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOk,setIsOk]=useState(true);
  const [message, setMessage] = useState< ReactNode>(null);

  const showPopup = (text: ReactNode,showOkbtn=true) => {
    setMessage(text);
    setIsOpen(true);
    setIsOk(showOkbtn);
  };

  const hidePopup = () => {
    setIsOpen(false);
    setMessage('');
  };

  return (
    <PopupContext.Provider value={{ isOpen, message, showPopup, hidePopup,isOk }}>
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};