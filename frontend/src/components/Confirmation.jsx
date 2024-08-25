import React from 'react';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        <p>{message}</p>
        <div>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const dialogStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '5px',
  textAlign: 'center',
};

export default ConfirmationDialog;
