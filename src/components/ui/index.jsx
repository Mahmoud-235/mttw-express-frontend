import React from 'react';

/* ══════════════════════════════════
   CARD
══════════════════════════════════ */
export function Card({ children, className = '', glow = false, style }) {
  return (
    <div
      className={`eco-card ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${glow ? 'var(--border-bright)' : 'var(--border)'}`,
        borderRadius: 'var(--r-lg)',
        boxShadow: glow
          ? 'var(--shadow-card), var(--shadow-green)'
          : 'var(--shadow-card)',
        padding: '20px 24px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════
   STAT CARD
══════════════════════════════════ */
export function StatCard({ label, value, unit, icon, trend, color = 'green', size = 'md' }) {
  const colors = {
    green: { bg: 'rgba(34,197,94,0.1)',  text: 'var(--green-400)',  border: 'rgba(34,197,94,0.2)' },
    teal:  { bg: 'rgba(20,184,166,0.1)', text: 'var(--teal-400)',  border: 'rgba(20,184,166,0.2)' },
    amber: { bg: 'rgba(245,158,11,0.1)', text: 'var(--amber-400)', border: 'rgba(245,158,11,0.2)' },
    red:   { bg: 'rgba(239,68,68,0.1)',  text: 'var(--red-400)',   border: 'rgba(239,68,68,0.2)' },
    blue:  { bg: 'rgba(59,130,246,0.1)', text: 'var(--blue-400)',  border: 'rgba(59,130,246,0.2)' },
  };
  const c = colors[color] || colors.green;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid var(--border)`,
      borderRadius: 'var(--r-lg)',
      padding: size === 'lg' ? '24px' : '18px 20px',
      boxShadow: 'var(--shadow-card)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'border-color 0.2s, transform 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          {label}
        </span>
        {icon && (
          <div style={{
            width: 34, height: 34,
            background: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: 'var(--r-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
          }}>{icon}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{
          fontFamily: 'var(--font-data)',
          fontSize: size === 'lg' ? '2.2rem' : '1.75rem',
          fontWeight: 700,
          color: c.text,
          lineHeight: 1,
        }}>{value ?? '—'}</span>
        {unit && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{unit}</span>}
      </div>
      {trend !== undefined && (
        <div style={{ fontSize: '0.75rem', color: trend >= 0 ? 'var(--green-400)' : 'var(--red-400)', fontFamily: 'var(--font-data)' }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% vs yesterday
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════
   BUTTON
══════════════════════════════════ */
export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, loading, type = 'button', style }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: disabled || loading ? 'not-allowed' : 'pointer',
    border: 'none', borderRadius: 'var(--r-md)', transition: 'all 0.15s',
    opacity: disabled || loading ? 0.6 : 1,
    whiteSpace: 'nowrap',
  };
  const sizes = {
    sm: { padding: '6px 12px', fontSize: '0.78rem' },
    md: { padding: '9px 18px', fontSize: '0.875rem' },
    lg: { padding: '12px 24px', fontSize: '1rem' },
  };
  const variants = {
    primary: { background: 'var(--green-500)', color: '#030a06' },
    secondary: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
    danger: { background: 'rgba(239,68,68,0.15)', color: 'var(--red-400)', border: '1px solid rgba(239,68,68,0.3)' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    teal: { background: 'var(--teal-500)', color: 'white' },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.filter = 'brightness(1.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = 'none'; }}
    >
      {loading ? <Spinner size={14} /> : null}
      {children}
    </button>
  );
}

/* ══════════════════════════════════
   BADGE
══════════════════════════════════ */
export function Badge({ children, color = 'green' }) {
  const c = {
    green:  { bg: 'rgba(34,197,94,0.12)',  text: 'var(--green-400)' },
    red:    { bg: 'rgba(239,68,68,0.12)',  text: 'var(--red-400)' },
    amber:  { bg: 'rgba(245,158,11,0.12)', text: 'var(--amber-400)' },
    blue:   { bg: 'rgba(59,130,246,0.12)', text: 'var(--blue-400)' },
    teal:   { bg: 'rgba(20,184,166,0.12)', text: 'var(--teal-400)' },
    gray:   { bg: 'rgba(255,255,255,0.06)', text: 'var(--text-muted)' },
  };
  const col = c[color] || c.green;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 9px', borderRadius: 'var(--r-full)',
      background: col.bg, color: col.text,
      fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

/* ══════════════════════════════════
   INPUT
══════════════════════════════════ */
export function Input({ label, error, prefix, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {prefix && (
          <span style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', fontSize: '0.85rem', pointerEvents: 'none',
          }}>{prefix}</span>
        )}
        <input
          {...props}
          style={{
            width: '100%',
            padding: prefix ? '10px 12px 10px 32px' : '10px 14px',
            background: 'var(--bg-input)',
            border: `1px solid ${error ? 'var(--red-500)' : 'var(--border)'}`,
            borderRadius: 'var(--r-md)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = error ? 'var(--red-500)' : 'var(--green-500)'; e.target.style.boxShadow = error ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(34,197,94,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = error ? 'var(--red-500)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
        />
      </div>
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--red-400)' }}>{error}</span>}
    </div>
  );
}

/* ══════════════════════════════════
   SELECT
══════════════════════════════════ */
export function Select({ label, error, options = [], ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</label>}
      <select
        {...props}
        style={{
          width: '100%', padding: '10px 14px',
          background: 'var(--bg-input)', border: `1px solid ${error ? 'var(--red-500)' : 'var(--border)'}`,
          borderRadius: 'var(--r-md)', color: 'var(--text-primary)',
          fontFamily: 'var(--font-ui)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--green-500)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

/* ══════════════════════════════════
   MODAL
══════════════════════════════════ */
export function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-bright)',
        borderRadius: 'var(--r-xl)',
        width: '100%', maxWidth: width,
        boxShadow: 'var(--shadow-lg), var(--shadow-green)',
        animation: 'pageIn 0.25s var(--ease) forwards',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>{title}</h4>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: '4px' }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   PAGE HEADER
══════════════════════════════════ */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', gap: '16px' }}>
      <div>
        <h2 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{subtitle}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

/* ══════════════════════════════════
   SPINNER
══════════════════════════════════ */
export function Spinner({ size = 20, color = 'var(--green-500)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.7s linear infinite', flexShrink: 0 }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" strokeOpacity="0.25"/>
      <path d="M12 3a9 9 0 0 1 9 9" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

/* ══════════════════════════════════
   EMPTY STATE
══════════════════════════════════ */
export function EmptyState({ icon = '◈', title, desc, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.4 }}>{icon}</div>
      <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>{title}</p>
      {desc && <p style={{ fontSize: '0.85rem', marginBottom: '20px' }}>{desc}</p>}
      {action}
    </div>
  );
}

/* ══════════════════════════════════
   STATUS BADGE (AI status)
══════════════════════════════════ */
export function StatusBadge({ status }) {
  const map = {
    Safe:        { color: 'green', label: 'Safe' },
    Healthy:     { color: 'green', label: 'Healthy' },
    Normal:      { color: 'green', label: 'Normal' },
    Warning:     { color: 'amber', label: 'Warning' },
    'High Stress':{ color: 'amber', label: 'High Stress' },
    Danger:      { color: 'red',   label: 'Danger' },
    Critical:    { color: 'red',   label: 'Critical' },
    Infected:    { color: 'red',   label: 'Infected' },
    Unknown:     { color: 'gray',  label: 'Unknown' },
  };
  const m = map[status] || { color: 'gray', label: status || 'Unknown' };
  return <Badge color={m.color}><span className="pulse-dot" style={{ width: 6, height: 6 }} />{m.label}</Badge>;
}

/* ══════════════════════════════════
   TABLE
══════════════════════════════════ */
export function Table({ columns, data, keyField = '_id' }) {
  return (
    <div style={{ overflow: 'auto', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
            {columns.map(col => (
              <th key={col.key} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row[keyField] || i} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: '12px 16px', color: 'var(--text-primary)', verticalAlign: 'middle' }}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
