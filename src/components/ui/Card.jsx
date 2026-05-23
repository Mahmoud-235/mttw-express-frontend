import React from 'react';
import './Card.css';

export default function Card({ children, className='', glass=false, glow=false, style, onClick }) {
  return (
    <div
      className={`card ${glass?'card--glass':''} ${glow?'card--glow':''} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, unit='', icon: Icon, color='accent', delta, loading }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        {Icon && <div className="stat-card__icon"><Icon size={18}/></div>}
      </div>
      {loading
        ? <div className="skeleton" style={{height:36,marginTop:8,width:'60%'}}/>
        : <div className="stat-card__value">{value}<span className="stat-card__unit">{unit}</span></div>
      }
      {delta !== undefined && (
        <div className={`stat-card__delta ${delta >= 0 ? 'stat-card__delta--up' : 'stat-card__delta--down'}`}>
          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}%
        </div>
      )}
    </div>
  );
}
