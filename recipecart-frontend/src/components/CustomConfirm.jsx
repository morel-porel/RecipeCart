import { createContext, useContext, useState } from 'react';
import '../assets/styles/CustomConfirm.css';

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [confirmData, setConfirmData] = useState(null);

  const showConfirm = (message, title = 'Confirm') => {
    return new Promise((resolve) => {
      setConfirmData({
        message,
        title,
        onConfirm: () => {
          setConfirmData(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmData(null);
          resolve(false);
        }
      });
    });
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      {confirmData && <ConfirmDialog {...confirmData} />}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
};

const ConfirmDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <>
      <div className="confirm-overlay" onClick={onCancel}></div>
      <div className="confirm-dialog">
        <div className="confirm-header">
          <h3 className="confirm-title">{title}</h3>
          <button className="confirm-close" onClick={onCancel}>×</button>
        </div>
        <div className="confirm-body">
          <p className="confirm-message">{message}</p>
        </div>
        <div className="confirm-footer">
          <button className="confirm-btn confirm-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn confirm-btn-confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};