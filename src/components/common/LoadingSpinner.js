import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  text = '',
  overlay = false,
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large',
    xlarge: 'spinner-xlarge'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    success: 'spinner-success',
    warning: 'spinner-warning',
    danger: 'spinner-danger',
    info: 'spinner-info',
    light: 'spinner-light',
    dark: 'spinner-dark'
  };

  const spinnerContent = (
    <div className={`loading-spinner ${className}`}>
      <div className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && (
        <div className="spinner-text">
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        {spinnerContent}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="spinner-overlay">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

// Inline spinner for small spaces
export const InlineSpinner = ({ size = 'small', color = 'primary' }) => (
  <div className="inline-spinner">
    <div className={`spinner-dot ${size === 'small' ? 'spinner-dot-sm' : 'spinner-dot-md'} ${color === 'primary' ? 'spinner-primary' : `spinner-${color}`}`}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  </div>
);

// Button spinner for loading states
export const ButtonSpinner = ({ size = 'small' }) => (
  <div className={`button-spinner ${size === 'small' ? 'button-spinner-sm' : 'button-spinner-md'}`}>
    <div className="spinner-circle"></div>
  </div>
);

export default LoadingSpinner;
