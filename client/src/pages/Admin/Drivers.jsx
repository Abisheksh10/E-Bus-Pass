// import { useEffect, useState } from 'react'
// import api from '../../services/api'
// import { Plus, Pencil, Trash2, RefreshCcw, Phone, MapPin } from 'lucide-react'

// export default function Drivers(){
//   const [list, setList] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [err, setErr] = useState('')

//   const [form, setForm] = useState({ id:'', name:'', phone:'', busno:'', route:'', photo:'' })
//   const [editingId, setEditingId] = useState(null)
//   const [busy, setBusy] = useState(false)

//   function set(k,v){ setForm(p=>({...p,[k]:v})) }

//   async function load(){
//     setErr('')
//     setLoading(true)
//     try {
//       const { data } = await api.get('/drivers') // GET /api/drivers
//       setList(data || [])
//     } catch (e) {
//       setErr(e?.response?.data?.message || 'Could not load drivers')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(()=>{ load() }, [])

//   async function upsert(e){
//     e.preventDefault()
//     setErr('')
//     setBusy(true)
//     try {
//       if (editingId) {
//         await api.put(`/drivers/${editingId}`, form) // PUT /api/drivers/:id
//       } else {
//         await api.post('/drivers', form) // POST /api/drivers
//       }
//       setForm({ id:'', name:'', phone:'', busno:'', route:'', photo:'' })
//       setEditingId(null)
//       await load()
//     } catch (e) {
//       setErr(e?.response?.data?.message || 'Save failed')
//     } finally {
//       setBusy(false)
//     }
//   }

//   async function del(id){
//     setErr('')
//     try {
//       await api.delete(`/drivers/${id}`) // DELETE /api/drivers/:id
//       await load()
//     } catch (e) {
//       setErr(e?.response?.data?.message || 'Delete failed')
//     }
//   }

//   function edit(d){
//     setForm({ id:d.id || '', name:d.name || '', phone:d.phone || '', busno:d.busno || '', route:d.route || '', photo:d.photo || '' })
//     setEditingId(d._id)
//   }

//   function cancel(){
//     setForm({ id:'', name:'', phone:'', busno:'', route:'', photo:'' })
//     setEditingId(null)
//   }

//   return (
//     <div className="space-y-6">
//       <div className="app-surface p-6 md:p-8 bg-gradient-to-br from-slate-50 to-white">
//         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
//           <BusFront className="h-4 w-4" />
//           Manage Drivers
//         </div>
//         <h1 className="app-title mt-3">Driver Management</h1>
//         <p className="app-subtitle mt-2">
//           Create, update or delete drivers. Students can view them on the Drivers page.
//         </p>
//       </div>

//       {err && <div className="error-box">{err}</div>}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Form */}
//         <div className="app-surface p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <div className="text-lg font-semibold text-slate-900">{headerTitle}</div>
//               <div className="text-sm text-slate-600">Fill all required fields.</div>
//             </div>
//             <button onClick={load} className="btn-outline">
//               <RefreshCcw className="h-4 w-4" /> Refresh
//             </button>
//           </div>

//           <form onSubmit={upsert} className="space-y-3">
//             <div className="space-y-1">
//               <label className="text-sm text-slate-600">Driver ID (unique)</label>
//               <div className="relative">
//                 <User className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
//                 <input className="input pl-9" value={form.id} onChange={e=>set('id', e.target.value)} required />
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm text-slate-600">Name</label>
//               <input className="input" value={form.name} onChange={e=>set('name', e.target.value)} required />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div className="space-y-1">
//                 <label className="text-sm text-slate-600">Phone</label>
//                 <div className="relative">
//                   <Phone className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
//                   <input className="input pl-9" value={form.phone} onChange={e=>set('phone', e.target.value)} required />
//                 </div>
//               </div>

//               <div className="space-y-1">
//                 <label className="text-sm text-slate-600">Bus Number</label>
//                 <input className="input" value={form.busno} onChange={e=>set('busno', e.target.value)} required />
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm text-slate-600">Route</label>
//               <div className="relative">
//                 <MapPin className="h-4 w-4 text-slate-500 absolute left-3 top-3" />
//                 <input className="input pl-9" value={form.route} onChange={e=>set('route', e.target.value)} required />
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-sm text-slate-600">Photo URL</label>
//               <input className="input" value={form.photo} onChange={e=>set('photo', e.target.value)} />
//             </div>

//             <div className="flex flex-wrap gap-2 pt-2">
//               <button disabled={busy} className="btn-primary">
//                 {editingId ? <><Pencil className="h-4 w-4" /> Update</> : <><Plus className="h-4 w-4" /> Create</>}
//               </button>

//               {editingId && (
//                 <button type="button" onClick={cancel} className="btn-outline">
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>

//         {/* List */}
//         <div className="app-surface p-6">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <div className="text-lg font-semibold text-slate-900">Driver List</div>
//               <div className="text-sm text-slate-600">
//                 Total: <b>{sorted.length}</b>
//               </div>
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-slate-600 text-sm">Loading…</div>
//           ) : (
//             <div className="space-y-3">
//               {sorted.length === 0 && (
//                 <div className="muted-box">No drivers found.</div>
//               )}

//               {sorted.map(d => (
//                 <div key={d._id} className="card p-4">
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="min-w-0">
//                       <div className="font-semibold text-slate-900 truncate">{d.name}</div>
//                       <div className="text-sm text-slate-600 mt-1 truncate">
//                         Bus <b>{d.busno}</b> • {d.route}
//                       </div>
//                       <div className="text-sm text-slate-600 mt-1 truncate">
//                         Phone: <b>{d.phone}</b> • ID: <b>{d.id}</b>
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap gap-2">
//                       <button className="btn-outline" onClick={()=>edit(d)}>
//                         <Pencil className="h-4 w-4" /> Edit
//                       </button>
//                       <button
//                         className="btn text-red-700 border border-red-200 bg-white hover:bg-red-50 focus:ring-red-300"
//                         onClick={()=>del(d._id)}
//                       >
//                         <Trash2 className="h-4 w-4" /> Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//       </div>
//     </div>
//   )
// }






import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Plus, Pencil, Trash2, RefreshCcw, Phone, MapPin, BusFront, User, AlertCircle } from 'lucide-react'

export default function Drivers(){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const [form, setForm] = useState({ id:'', name:'', phone:'', busno:'', route:'', photo:'' })
  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)

  // Computed value for the form header
  const headerTitle = editingId ? "Edit Driver" : "Register New Driver"
  // Simple sort logic to keep list stable
  const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name))

  function set(k,v){ setForm(p=>({...p,[k]:v})) }

  async function load(){
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.get('/drivers') 
      setList(data || [])
    } catch (e) {
      setErr(e?.response?.data?.message || 'Could not load drivers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  async function upsert(e){
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      if (editingId) {
        await api.put(`/drivers/${editingId}`, form)
      } else {
        await api.post('/drivers', form)
      }
      setForm({ id:'', name:'', phone:'', busno:'', route:'', photo:'' })
      setEditingId(null)
      await load()
    } catch (e) {
      setErr(e?.response?.data?.message || 'Save failed')
    } finally {
      setBusy(false)
    }
  }

  async function del(id){
    if(!window.confirm("Are you sure you want to delete this driver?")) return
    setErr('')
    try {
      await api.delete(`/drivers/${id}`)
      await load()
    } catch (e) {
      setErr(e?.response?.data?.message || 'Delete failed')
    }
  }

  function edit(d){
    setForm({ id:d.id || '', name:d.name || '', phone:d.phone || '', busno:d.busno || '', route:d.route || '', photo:d.photo || '' })
    setEditingId(d._id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancel(){
    setForm({ id:'', name:'', phone:'', busno:'', route:'', photo:'' })
    setEditingId(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-100 shadow-sm bg-gradient-to-br from-blue-50/50 to-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          <BusFront className="h-4 w-4" />
          Fleet Management
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Driver Management</h1>
        <p className="text-slate-500 mt-2 font-medium max-w-2xl">
          Create, update or delete drivers. Students can view them on the Drivers page.
        </p>
      </div>

      {err && (
        <div className="mx-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {err}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 px-4">
        {/* Form Column - Sticky for easy access */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xl font-black text-slate-900">{headerTitle}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Logistics Entry</div>
              </div>
              <button 
                onClick={load} 
                className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors border border-slate-100"
              >
                <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <form onSubmit={upsert} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Driver ID (Unique)</label>
                <div className="relative">
                  <User className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                    value={form.id} 
                    onChange={e=>set('id', e.target.value)} 
                    placeholder="e.g. DRV-001"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                  value={form.name} 
                  onChange={e=>set('name', e.target.value)} 
                  placeholder="John Doe"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Phone</label>
                  <div className="relative">
                    <Phone className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                      value={form.phone} 
                      onChange={e=>set('phone', e.target.value)} 
                      placeholder="9876543210"
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Bus Number</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                    value={form.busno} 
                    onChange={e=>set('busno', e.target.value)} 
                    placeholder="Bus 12"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Route</label>
                <div className="relative">
                  <MapPin className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                    value={form.route} 
                    onChange={e=>set('route', e.target.value)} 
                    placeholder="Downtown to Campus"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Photo URL (Optional)</label>
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                  value={form.photo} 
                  onChange={e=>set('photo', e.target.value)} 
                  placeholder="https://image-link.com"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  disabled={busy} 
                  className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {editingId ? <><Pencil className="h-4 w-4" /> Update</> : <><Plus className="h-4 w-4" /> Create</>}
                </button>

                {editingId && (
                  <button 
                    type="button" 
                    onClick={cancel} 
                    className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Roster</h2>
            <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              Total: {sorted.length}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-bold text-slate-400">Loading Database...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-medium italic">No drivers registered yet.</p>
                </div>
              )}

              {sorted.map(d => (
                <div key={d._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-50">
                        {d.photo ? (
                          <img src={d.photo} className="h-full w-full object-cover" alt={d.name} />
                        ) : (
                          <User className="h-6 w-6 text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{d.name}</div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-1">
                           <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-black">BUS {d.busno}</span>
                           <span>•</span>
                           <span className="truncate">{d.route}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <button 
                        className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100" 
                        onClick={()=>edit(d)}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                        onClick={()=>del(d._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-4">
                     <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Phone className="h-3 w-3" /> {d.phone}
                     </div>
                     <div className="text-xs text-slate-300">|</div>
                     <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <span className="text-[10px] font-black uppercase text-slate-300 tracking-tighter">System ID:</span> {d.id}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}