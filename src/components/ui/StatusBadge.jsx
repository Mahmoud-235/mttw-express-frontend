import React from 'react';
import './StatusBadge.css';

const MAP = {
  'Safe':       'green',
  'Healthy':    'green',
  'online':     'green',
  'Warning':    'yellow',
  'High Stress':'orange',
  'Danger':     'red',
  'Critical':   'red',
  'Infected':   'red',
  'offline':    'gray',
  'owner':      'cyan',
  'worker':     'blue',
};

export default function StatusBadge({ status, dot=false }) {
  const color = MAP[status] || 'gray';
  return (
    <span className={`status-badge status-badge--${color}`}>
      {dot && <span className="status-badge__dot"/>}
      {status}
    </span>
  );
}
