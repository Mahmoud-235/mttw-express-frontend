import styles from './Button.module.css';

export default function Button({ children, variant='primary', size='md', loading=false, icon, fullWidth=false, ...props }) {
  return (
    <button
      className={[styles.btn, styles[variant], styles[size], fullWidth?styles.full:'', loading?styles.loading:''].join(' ')}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className={styles.spinner}/> : icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}
