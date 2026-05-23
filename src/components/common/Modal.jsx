import { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import styles from './Modal.module.css';

export default function Modal({ open, onClose, title, children, size='md' }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={[styles.modal, styles[size]].join(' ')} onClick={e=>e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.close} onClick={onClose}><MdClose size={20}/></button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
