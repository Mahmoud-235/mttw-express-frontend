import { useState } from 'react'
import { Plus, Trash2, Users, Phone, MapPin, Shield } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { usersAPI, sectorsAPI } from '../services/api'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/Skeleton'
import toast from 'react-hot-toast'

const AVATARS = ['🌱','🌿','🍃','🌾','🌻','🌴','🍀','🌵']

export default function Workers() {
  const { data, loading, refetch } = useFetch(usersAPI.getWorkers)
  const { data: sData } = useFetch(sectorsAPI.getAll)
  const workers = data?.data || []
  const sectors = sData?.data || []

  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState({ firstName:'', lastName:'', email:'', password:'', phoneNumber:'', address:'', assignedSector:'' })
  const [delId,   setDelId]   = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [deleting,setDeleting]= useState(false)

  const set = k => e => setForm(p=>({...p,[k]:e.target.value}))

  const handleAdd = async () => {
    const required = ['firstName','lastName','email','password']
    if (required.some(k => !form[k])) return toast.error('Please fill all required fields')
    setSaving(true)
    try {
      await usersAPI.addWorker(form)
      toast.success('Worker added successfully!')
      refetch(); setModal(false)
      setForm({ firstName:'', lastName:'', email:'', password:'', phoneNumber:'', address:'', assignedSector:'' })
    } catch(e) { toast.error(e.response?.data?.message || 'Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await usersAPI.deleteWorker(delId)
      toast.success('Worker removed')
      refetch(); setDelId(null)
    } catch(e) { toast.error(e.response?.data?.message || 'Failed') }
    finally { setDeleting(false) }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Workers Management</h2>
          <p className="text-sm text-sage-500 mt-1">{workers.length} worker{workers.length !== 1?'s':''} on your farm</p>
        </div>
        <button className="btn-primary" onClick={() => setModal(true)}>
          <Plus size={15}/> Add Worker
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_,i) => <CardSkeleton key={i}/>)}
        </div>
      ) : workers.length === 0 ? (
        <div className="card">
          <EmptyState icon={Users} title="No workers yet"
            description="Add your first field worker to assign them to a sector."
            action={<button className="btn-primary" onClick={() => setModal(true)}><Plus size={14}/>Add Worker</button>}/>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((w, i) => (
            <div key={w._id} className="card card-hover group">
              <div className="flex items-start justify-between mb-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-forest-600 rounded-2xl flex items-center justify-center shadow-forest-sm">
                  <span className="text-xl">{AVATARS[i % AVATARS.length]}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setDelId(w._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-sage-400 hover:text-red-600 transition-colors">
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-sage-900">{w.firstName} {w.lastName}</h3>
              <p className="text-xs text-sage-500 mt-0.5">{w.email}</p>

              <div className="mt-4 space-y-2 border-t border-forest-50 pt-4">
                {w.phoneNumber && (
                  <div className="flex items-center gap-2 text-xs text-sage-600">
                    <Phone size={11} className="text-sage-400"/>{w.phoneNumber}
                  </div>
                )}
                {w.address && (
                  <div className="flex items-center gap-2 text-xs text-sage-600">
                    <MapPin size={11} className="text-sage-400"/>{w.address}
                  </div>
                )}
                {w.assignedSector && (
                  <div className="flex items-center gap-2 text-xs">
                    <Shield size={11} className="text-forest-500"/>
                    <span className="text-forest-700 font-medium">
                      {sectors.find(s => s._id === w.assignedSector)?.name || 'Assigned Sector'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <span className={`badge ${w.isVerified ? 'badge-green' : 'badge-amber'}`}>
                  {w.isVerified ? 'Active' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Add New Worker">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name *</label>
              <input className="input" placeholder="Ahmed" value={form.firstName} onChange={set('firstName')}/>
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input className="input" placeholder="Hassan" value={form.lastName} onChange={set('lastName')}/>
            </div>
          </div>
          <div>
            <label className="label">Email Address *</label>
            <input type="email" className="input" placeholder="worker@farm.com" value={form.email} onChange={set('email')}/>
          </div>
          <div>
            <label className="label">Password *</label>
            <input type="password" className="input" placeholder="Secure password" value={form.password} onChange={set('password')}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Phone</label>
              <input className="input" placeholder="+20..." value={form.phoneNumber} onChange={set('phoneNumber')}/>
            </div>
            <div>
              <label className="label">Address</label>
              <input className="input" placeholder="City..." value={form.address} onChange={set('address')}/>
            </div>
          </div>
          <div>
            <label className="label">Assign to Sector</label>
            <select className="input" value={form.assignedSector} onChange={set('assignedSector')}>
              <option value="">— No assignment yet —</option>
              {sectors.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <button className="btn-primary w-full justify-center" onClick={handleAdd} disabled={saving}>
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Add Worker'}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!delId} onClose={() => setDelId(null)} onConfirm={handleDelete} loading={deleting}
        title="Remove Worker" message="This worker will be removed and unassigned from all sectors. This cannot be undone."/>
    </div>
  )
}
