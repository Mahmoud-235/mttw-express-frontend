import { useState, useEffect } from 'react';
import { getLatest, analyzeSector } from '../../api/sensors';
import SensorGauge from './SensorGauge';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { MdRefresh } from 'react-icons/md';
import { getStatusColor, timeAgo } from '../../utils/helpers';
import toast from 'react-hot-toast';
import styles from './SensorLatestCard.module.css';

export default function SensorLatestCard({ sectorId, sectorName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getLatest(sectorId);
      setData(res.data.data);
    } catch (_) {}
    finally { setLoading(false); }
  };

  const analyze = async () => {
    try {
      setAnalyzing(true);
      await analyzeSector(sectorId);
      toast.success('AI analysis updated!');
      await load();
    } catch(e) { toast.error('Analysis failed'); }
    finally { setAnalyzing(false); }
  };

  useEffect(() => { if (sectorId) load(); }, [sectorId]);

  if (loading) return <div className={styles.card}><div className={styles.loading}>Loading sensors...</div></div>;
  if (!data) return <div className={styles.card}><div className={styles.noData}>No sensor data available</div></div>;

  const statusColor = getStatusColor(data.analysis?.status);
  const statusVariant = ['Safe','Healthy'].includes(data.analysis?.status) ? 'success'
    : ['Warning','High Stress'].includes(data.analysis?.status) ? 'warning' : 'danger';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <div className={styles.sectorName}>{sectorName || 'Sensor Reading'}</div>
          <div className={styles.time}>{data.createdAt ? timeAgo(data.createdAt) : '—'}</div>
        </div>
        <div className={styles.headerRight}>
          <Badge variant={statusVariant}>{data.analysis?.status || 'Unknown'}</Badge>
          <Button size="sm" variant="ghost" icon={<MdRefresh/>} loading={analyzing} onClick={analyze}>
            Analyze
          </Button>
        </div>
      </div>

      <div className={styles.gauges}>
        <SensorGauge label="Temperature" value={data.air?.temperature} unit="°C" max={60} color="var(--amber)" icon="🌡"/>
        <SensorGauge label="Humidity" value={data.air?.humidity} unit="%" max={100} color="var(--blue-data)" icon="💧"/>
        <SensorGauge label="Soil" value={data.soil?.moisture} unit="%" max={100} color="var(--green-neon)" icon="🌱"/>
      </div>

      <div className={styles.recommendation}>
        <span className={styles.recLabel}>AI Recommendation</span>
        <p className={styles.recText}>{data.analysis?.recommendation || 'No recommendation yet'}</p>
      </div>
    </div>
  );
}
