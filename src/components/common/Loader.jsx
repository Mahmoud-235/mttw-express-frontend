import styles from './Loader.module.css';
export default function Loader({ size=40, text='' }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.ring} style={{width:size,height:size}}/>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
}
