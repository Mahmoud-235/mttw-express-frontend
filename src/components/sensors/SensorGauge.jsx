import styles from './SensorGauge.module.css';

function Ring({ value, max=100, color, size=80, stroke=7 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const fill = Math.min(value / max, 1) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:'rotate(-90deg)'}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ - fill} strokeLinecap="round"
        style={{transition:'stroke-dashoffset 1s ease', filter:`drop-shadow(0 0 6px ${color}80)`}}/>
    </svg>
  );
}

export default function SensorGauge({ label, value, unit, max, color, icon }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className={styles.gauge}>
      <div className={styles.ring}>
        <Ring value={value ?? 0} max={max} color={color} size={90} stroke={7}/>
        <div className={styles.inner} style={{color}}>
          <span className={styles.icon}>{icon}</span>
          <span className={styles.val}>{value != null ? value.toFixed(1) : '—'}</span>
          <span className={styles.unit}>{unit}</span>
        </div>
      </div>
      <div className={styles.label}>{label}</div>
      <div className={styles.pct} style={{color}}>{pct}%</div>
    </div>
  );
}
