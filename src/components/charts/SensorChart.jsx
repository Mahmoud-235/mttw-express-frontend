import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { format } from 'date-fns';
import styles from './SensorChart.module.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipLabel}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className={styles.tooltipRow} style={{color: p.color}}>
          <span>{p.name}:</span>
          <span className={styles.tooltipVal}>{p.value?.toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
};

export default function SensorChart({ data = [], title }) {
  const formatted = data.map((d) => ({
    ...d,
    time: d.createdAt ? format(new Date(d.createdAt), 'HH:mm') : d._id,
  }));

  return (
    <div className={styles.wrap}>
      {title && <div className={styles.title}>{title}</div>}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
          <XAxis dataKey="time" tick={{ fill: 'var(--text-dim)', fontSize: 11, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false}/>
          <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 11 }} tickLine={false} axisLine={false}/>
          <Tooltip content={<CustomTooltip/>}/>
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Space Mono', color: 'var(--text-muted)' }}/>
          <Line type="monotone" dataKey="air.temperature" name="Temp °C" stroke="var(--amber)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--amber)' }}/>
          <Line type="monotone" dataKey="air.humidity" name="Humidity %" stroke="var(--blue-data)" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
          <Line type="monotone" dataKey="soil.moisture" name="Soil %" stroke="var(--green-neon)" strokeWidth={2} dot={false} activeDot={{ r: 4 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
