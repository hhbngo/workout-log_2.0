import React, { useEffect } from 'react';
import classes from './Modal.module.css';

interface ModalProps {
  show: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  return (
    <div className={`${classes.backdrop} ${show ? classes.show : ''}`}>
      <div className={classes.clickBox} onClick={onClose}></div>
      {children}
    </div>
  );
};

export default Modal;
