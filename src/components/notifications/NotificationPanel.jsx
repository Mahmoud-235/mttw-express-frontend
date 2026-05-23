import { useEffect, useRef } from 'react';
import { MdClose, MdNotifications, MdDone, MdDelete } from 'react-icons/md';
import useNotificationStore from '../../store/notificationStore';
import { markAsRead, deleteNotification } from '../../api/notifications';
import { timeAgo } from '../../utils/helpers';
import styles from './NotificationPanel.module.css';

const typeIcon = { warning: '⚠️', disease: '🦠', info: 'ℹ️' };

export default function NotificationPanel({ onClose }) {
  const { notifications, markRead, removeNotification } = useNotificationStore();
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleRead = async (id) => {
    try { await markAsRead(id); markRead(id); } catch(_) {}
  };

  const handleDelete = async (id) => {
    try { await deleteNotification(id); removeNotification(id); } catch(_) {}
  };

  return (
    <div className={styles.panel} ref={ref}>
      <div className={styles.header}>
        <span className={styles.title}><MdNotifications size={18}/> Alerts & Notifications</span>
        <button className={styles.closeBtn} onClick={onClose}><MdClose size={18}/></button>
      </div>
      <div className={styles.list}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔔</div>
            <span>No notifications yet</span>
          </div>
        ) : notifications.map((n) => (
          <div key={n._id} className={[styles.item, !n.isRead ? styles.unread : ''].join(' ')}>
            <div className={styles.itemIcon}>{typeIcon[n.type] || '📢'}</div>
            <div className={styles.itemContent}>
              <div className={styles.itemTitle}>{n.title}</div>
              <div className={styles.itemMsg}>{n.message}</div>
              <div className={styles.itemTime}>{timeAgo(n.createdAt)}</div>
            </div>
            <div className={styles.itemActions}>
              {!n.isRead && <button className={styles.actionBtn} onClick={() => handleRead(n._id)} title="Mark read"><MdDone size={14}/></button>}
              <button className={styles.actionBtn} onClick={() => handleDelete(n._id)} title="Delete"><MdDelete size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
