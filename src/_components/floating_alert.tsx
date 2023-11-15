import React from 'react';

interface FloatingAlertProps {
  message: string;
}

const FloatingAlert: React.FC<FloatingAlertProps> = ({ message }) => {
  return (
    <div className="floating-alert-w-anim w-fit floating-alert py-1 px-2 bg-fuchsia-200 text-fuchsia-900">
      <p>{message}</p>
    </div>
  );
};

export default FloatingAlert;
