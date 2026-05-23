import { useState } from 'react'
import { Download, BarChart3, ChevronDown, TrendingUp, Thermometer, Droplets, Bug } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { reportsAPI, sectorsAPI } from '../services/api'
import { EmptyState } from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/Skeleton'
import { downloadBlob } from '../utils/helpers'
import toast from 'react-hot-toast'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Area
} from 'recharts'

const DAYS_OPTIONS = [7, 14, 30]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-forest-100 rounded-xl shadow-card p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-sage-700 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }}/>
            {p.name}
          </span>
          <strong>{p.value ?? '—'}</strong>
        </div>
      ))}
    </div>
  )
}

export default function Reports() {
  const [sectorId, setSectorId] = useState('')
  const [days,     setDays]     = useState(7)
  const [exporting,setExporting]= useState(false)

  const { data: sData } = useFetch(sectorsAPI.getAll)
  const sectors = sData?.data || []

  const { data, loading } = useFetch(
    () => sectorId ? reportsAPI.getStats(sectorId, days) : Promise.resolve({ data: null }),
    [sectorId, days]
  )
  const report = data?.data || []

  const handleExport = async () => {
    if (!sectorId) return toast.error('Please select a sector first')
    setExporting(true)
    try {
      const res = await reportsAPI.exportCSV(sectorId)
      downloadBlob(res.data, `Sector-Report-${Date.now()}.csv`)
      toast.success('CSV downloaded!')
    } catch(e) { toast.error('Export failed') }
    finally { setExporting(false) }
  }

  // Derived stats
  const avgTemp    = report.length ? (report.reduce((a,r) => a + (r.avgTemp||0), 0) / report.length).toFixed(1) : '—'
  const maxTemp    = report.length ? Math.max(...report.map(r => r.maxTemp || 0)).toFixed(1) : '—'
  const totalDiseases = report.reduce((a,r) => a + (r.totalDiseasesFound||0), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="page-title">Analytics & Reports</h2>
          <p className="text-sm text-sage-500 mt-1">Historical trends and statistical insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="input pr-10 min-w-[180px]" value={sectorId} onChange={e => setSectorId(e.target.value)}>
              <option value="">— Select sector —</option>
              {sectors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 pointer-events-none"/>
          </div>
          <div className="flex bg-forest-50 border border-forest-200 rounded-xl p-1 gap-1">
            {DAYS_OPTIONS.map(d => (
              <button key={d} onClick={() => setDays(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${days===d ? 'bg-forest-600 text-white shadow-forest-sm' : 'text-sage-600 hover:text-forest-700'}`}>
                {d}d
              </button>
            ))}
          </div>
          <button className="btn-secondary" onClick={handleExport} disabled={exporting || !sectorId}>
            {exporting
              ? <span className="w-4 h-4 border-2 border-forest-300 border-t-forest-600 rounded-full animate-spin"/>
              : <><Download size={14}/> Export CSV</>}
          </button>
        </div>
      </div>

      {!sectorId ? (
        <div className="card">
          <EmptyState icon={BarChart3} title="Select a sector"
            description="Choose a sector from the dropdown to view its analytics report."/>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_,i) => <CardSkeleton key={i}/>)}</div>
          <CardSkeleton/>
        </div>
      ) : report.length === 0 ? (
        <div className="card">
          <EmptyState icon={BarChart3} title="No data for this period"
            description="No sensor readings found for the selected sector and time range."/>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:'Avg Temperature', value:`${avgTemp}°C`, icon:Thermometer, color:'bg-red-50 text-red-600 border-red-100' },
              { label:'Peak Temperature',value:`${maxTemp}°C`, icon:TrendingUp,  color:'bg-amber-50 text-amber-600 border-amber-100' },
              { label:'Avg Soil Moisture',value:`${report.length ? (report.reduce((a,r)=>a+(r.avgMoisture||0),0)/report.length).toFixed(1) : '—'}%`, icon:Droplets, color:'bg-blue-50 text-blue-600 border-blue-100' },
              { label:'Disease Incidents',value:totalDiseases, icon:Bug, color:totalDiseases>0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-forest-50 text-forest-600 border-forest-100' },
            ].map(({ label, value, icon:Icon, color }) => (
              <div key={label} className="card flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 ${color}`}>
                  <Icon size={18}/>
                </div>
                <div>
                  <p className="text-xl font-bold text-sage-900 tabular-nums">{value}</p>
                  <p className="text-xs text-sage-500 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main chart */}
          <div className="card">
            <h3 className="section-title mb-5">Temperature & Humidity — Last {days} Days</h3>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={report} margin={{ top:5, right:20, left:0, bottom:5 }}>
                <defs>
                  <linearGradient id="gAvgT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f0e8" vertical={false}/>
                <XAxis dataKey="_id" tick={{ fontSize:11, fill:'#78909c' }} tickLine={false} axisLine={false}/>
                <YAxis yAxisId="temp" tick={{ fontSize:11, fill:'#78909c' }} tickLine={false} axisLine={false}/>
                <YAxis yAxisId="moist" orientation="right" tick={{ fontSize:11, fill:'#78909c' }} tickLine={false} axisLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend wrapperStyle={{ fontSize:12, paddingTop:8 }}/>
                <Area yAxisId="temp" type="monotone" dataKey="avgTemp" name="Avg Temp (°C)" stroke="#ef4444" strokeWidth={2} fill="url(#gAvgT)" dot={false}/>
                <Line yAxisId="temp" type="monotone" dataKey="maxTemp" name="Max Temp (°C)" stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 2" dot={false}/>
                <Bar  yAxisId="moist" dataKey="avgMoisture" name="Soil Moisture (%)" fill="#1976d2" opacity={0.7} radius={[4,4,0,0]}/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Disease bar chart */}
          <div className="card">
            <h3 className="section-title mb-5">Disease Incidents per Day</h3>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={report} margin={{ top:5, right:20, left:0, bottom:5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8f0e8" vertical={false}/>
                <XAxis dataKey="_id" tick={{ fontSize:11, fill:'#78909c' }} tickLine={false} axisLine={false}/>
                <YAxis allowDecimals={false} tick={{ fontSize:11, fill:'#78909c' }} tickLine={false} axisLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="totalDiseasesFound" name="Diseases Found" fill="#dc2626" opacity={0.8} radius={[4,4,0,0]}/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Data table */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-forest-100">
              <h3 className="section-title">Daily Data Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-forest-100 bg-forest-50/50">
                    {['Date','Avg Temp','Max Temp','Min Temp','Avg Humidity','Avg Moisture','Diseases'].map(h => (
                      <th key={h} className="px-5 py-3 text-left table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-50">
                  {report.map(row => (
                    <tr key={row._id} className="table-row">
                      <td className="px-5 py-3 text-sm font-medium text-sage-800">{row._id}</td>
                      <td className="px-5 py-3 text-sm text-sage-700">{row.avgTemp}°C</td>
                      <td className="px-5 py-3 text-sm text-red-600 font-medium">{row.maxTemp}°C</td>
                      <td className="px-5 py-3 text-sm text-blue-600">{row.minTemp}°C</td>
                      <td className="px-5 py-3 text-sm text-sage-700">{row.avgHumidity}%</td>
                      <td className="px-5 py-3 text-sm text-sage-700">{row.avgMoisture}%</td>
                      <td className="px-5 py-3">
                        <span className={`badge ${row.totalDiseasesFound > 0 ? 'badge-red' : 'badge-green'}`}>
                          {row.totalDiseasesFound}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
