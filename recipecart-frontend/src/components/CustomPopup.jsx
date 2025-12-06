import { createContext, useContext, useState } from 'react';
import '../assets/styles/CustomPopup.css';

const PopupContext = createContext(null);

export const PopupProvider = ({ children }) => {
  const [popups, setPopups] = useState([]);

  const showPopup = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newPopup = { id, message, type, duration };
    
    setPopups(prev => [...prev, newPopup]);

    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, duration);
  };

  const removePopup = (id) => {
    setPopups(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      <PopupContainer popups={popups} removePopup={removePopup} />
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within PopupProvider');
  }
  return context;
};

const PopupContainer = ({ popups, removePopup }) => {
  return (
    <div className="popup-container">
      {popups.map(popup => (
        <Popup
          key={popup.id}
          message={popup.message}
          type={popup.type}
          onClose={() => removePopup(popup.id)}
        />
      ))}
    </div>
  );
};

const Popup = ({ message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`popup popup-${type} ${isExiting ? 'popup-exit' : ''}`}>
      <div className="popup-icon">{getIcon()}</div>
      <div className="popup-message">{message}</div>
      <button className="popup-close" onClick={handleClose}>×</button>
    </div>
  );
};