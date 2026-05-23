import { useState } from 'react'
import { Plus, Pencil, Trash2, Layers, MapPin, Wheat, User } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { sectorsAPI, usersAPI } from '../services/api'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/Skeleton'
import toast from 'react-hot-toast'

const CROP_TYPES = ['Corn','Tomato','Pepper','Mint','Other']

function SectorForm({ initial = {}, workers = [], onSubmit, loading }) {
  const [f, setF] = useState({
    name: initial.name || '',
    cropType: initial.cropType || 'Corn',
    area: initial.area || '',
    location: initial.location || '',
    assignedWorker: initial.assignedWorker?._id || initial.assignedWorker || '',
  })
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Sector Name</label>
          <input className="input" placeholder="e.g. North Greenhouse" value={f.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="label">Crop Type</label>
          <select className="input" value={f.cropType} onChange={set('cropType')}>
            {CROP_TYPES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Area (m²)</label>
          <input type="number" className="input" placeholder="500" value={f.area} onChange={set('area')} />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="input" placeholder="Block A, North Field" value={f.location} onChange={set('location')} />
        </div>
      </div>
      <div>
        <label className="label">Assign Worker</label>
        <select className="input" value={f.assignedWorker} onChange={set('assignedWorker')}>
          <option value="">— Unassigned —</option>
          {workers.map(w => (
            <option key={w._id} value={w._id}>{w.firstName} {w.lastName}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button className="btn-primary flex-1 justify-center" disabled={loading || !f.name}
                onClick={() => onSubmit(f)}>
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Save Sector'}
        </button>
      </div>
    </div>
  )
}

export default function Sectors() {
  const { data, loading, refetch } = useFetch(sectorsAPI.getAll)
  const { data: wData } = useFetch(usersAPI.getWorkers)
  const sectors = data?.data || []
  const workers = wData?.data || []

  const [modal,   setModal]   = useState(null) // null | 'create' | 'edit'
  const [editing, setEditing] = useState(null)
  const [delId,   setDelId]   = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [deleting,setDeleting]= useState(false)

  const handleSave = async (form) => {
    setSaving(true)
    try {
      if (editing) await sectorsAPI.update(editing._id, form)
      else         await sectorsAPI.create(form)
      toast.success(editing ? 'Sector updated!' : 'Sector created!')
      refetch(); setModal(null); setEditing(null)
    } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await sectorsAPI.delete(delId)
      toast.success('Sector deleted')
      refetch(); setDelId(null)
    } catch (e) { toast.error(e.response?.data?.message || 'Failed') }
    finally { setDeleting(false) }
  }

  const cropColors = { Corn:'bg-amber-100 text-amber-700', Tomato:'bg-red-100 text-red-700', Pepper:'bg-orange-100 text-orange-700', Mint:'bg-forest-100 text-forest-700', Other:'bg-sage-100 text-sage-600' }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Farm Sectors</h2>
          <p className="text-sm text-sage-500 mt-1">{sectors.length} sector{sectors.length !== 1 ? 's' : ''} registered</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditing(null); setModal('create') }}>
          <Plus size={15}/> New Sector
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_,i) => <CardSkeleton key={i}/>)}
        </div>
      ) : sectors.length === 0 ? (
        <div className="card">
          <EmptyState icon={Layers} title="No sectors yet"
            description="Create your first farm sector to start monitoring crops."
            action={<button className="btn-primary" onClick={() => setModal('create')}><Plus size={14}/>Add Sector</button>} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.map(s => (
            <div key={s._id} className="card card-hover group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-forest-50 border border-forest-100 rounded-xl flex items-center justify-center">
                  <Layers size={17} className="text-forest-600"/>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(s); setModal('edit') }}
                          className="p-1.5 rounded-lg hover:bg-forest-50 text-sage-400 hover:text-forest-700 transition-colors">
                    <Pencil size={13}/>
                  </button>
                  <button onClick={() => setDelId(s._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-sage-400 hover:text-red-600 transition-colors">
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-sage-900">{s.name}</h3>

              <div className="flex flex-wrap gap-2 mt-2.5">
                <span className={`badge text-xs ${cropColors[s.cropType] || cropColors.Other}`}>
                  <Wheat size={11}/>{s.cropType}
                </span>
                {s.area && <span className="badge badge-gray">{s.area} m²</span>}
              </div>

              <div className="mt-4 space-y-2 border-t border-forest-50 pt-4">
                {s.location && (
                  <div className="flex items-center gap-2 text-xs text-sage-500">
                    <MapPin size={12} className="text-sage-400 flex-shrink-0"/>
                    <span className="truncate">{s.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <User size={12} className="text-sage-400 flex-shrink-0"/>
                  {s.assignedWorker ? (
                    <span className="text-forest-700 font-medium">
                      {s.assignedWorker.firstName} {s.assignedWorker.lastName}
                    </span>
                  ) : (
                    <span className="text-sage-400">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!modal} onClose={() => { setModal(null); setEditing(null) }}
             title={editing ? 'Edit Sector' : 'Create New Sector'}>
        <SectorForm initial={editing || {}} workers={workers} onSubmit={handleSave} loading={saving}/>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={handleDelete}
        title="Delete Sector" loading={deleting}
        message="This will permanently delete the sector and all related data. This action cannot be undone." />
    </div>
  )
}
