import React from 'react';
import Modal from 'react-modal';
import './styles.css'
import { ReactComponent as Cross } from '../../assets/images/cross.svg';

export const ReactModal = ({children, onClose}) => {
  return (
    <Modal
      isOpen
      contentLabel="Example Modal"
      onClose={onClose}
    >
      <div className="close-wrap">
        <button className="close-btn" type="button" onClick={onClose}>
          <Cross />
        </button>
      </div>
      {children}
    </Modal>
  )
}