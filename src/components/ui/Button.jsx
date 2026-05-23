import React from 'react';
import './Button.css';

export default function Button({ children, variant='primary', size='md', loading, disabled, icon:Icon, onClick, type='button', className='' }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${loading?'btn--loading':''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <span className="btn__spinner"/>}
      {!loading && Icon && <Icon size={size==='sm'?14:16}/>}
      {children}
    </button>
  );
}
