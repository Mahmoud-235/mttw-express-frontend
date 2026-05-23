import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import styles from './StatsChart.module.css';

export default function StatsChart({ data = [], title }) {
  return (
    <div className={styles.wrap}>
      {title && <div className={styles.title}>{title}</div>}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false}/>
          <XAxis dataKey="_id" tick={{ fill: 'var(--text-dim)', fontSize: 11, fontFamily: 'Space Mono' }} tickLine={false} axisLine={false}/>
          <YAxis tick={{ fill: 'var(--text-dim)', fontSize: 11 }} tickLine={false} axisLine={false}/>
          <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)', borderRadius: 8, fontSize: 12 }}/>
          <Bar dataKey="avgTemp" name="Avg Temp" fill="var(--amber)" radius={[4,4,0,0]}>
            {data.map((_, i) => <Cell key={i} fillOpacity={0.85}/>)}
          </Bar>
          <Bar dataKey="totalDiseasesFound" name="Disease Alerts" fill="var(--red-alert)" radius={[4,4,0,0]} fillOpacity={0.7}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
