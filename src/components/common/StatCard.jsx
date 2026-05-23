import styles from './StatCard.module.css';
export default function StatCard({ icon, label, value, sub, color, trend }) {
  return (
    <div className={styles.card} style={{'--accent': color || 'var(--green-neon)'}}>
      <div className={styles.top}>
        <div className={styles.iconWrap}>{icon}</div>
        {trend !== undefined && (
          <span className={[styles.trend, trend >= 0 ? styles.up : styles.down].join(' ')}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className={styles.value}>{value ?? '—'}</div>
      <div className={styles.label}>{label}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}
