import React from 'react';
import './Input.css';

export default function Input({ label, error, icon:Icon, className='', ...props }) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrap">
        {Icon && <span className="input-icon"><Icon size={16}/></span>}
        <input className={`input-field ${Icon?'input-field--icon':''} ${error?'input-field--error':''}`} {...props}/>
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}

export function Select({ label, error, className='', children, ...props }) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <select className={`input-field select-field ${error?'input-field--error':''}`} {...props}>
        {children}
      </select>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
