import { useEffect, useState } from 'react'
import api from '../../services/api'
import { CheckCircle2, XCircle, RefreshCcw } from 'lucide-react'

export default function ViewRegistrations(){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  async function load(){
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.get('/passes') // GET /api/passes
      setList(data || [])
    } catch (e) {
      setErr(e?.response?.data?.message || 'Could not load registrations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  async function accept(id){
    setErr('')
    try {
      await api.post(`/passes/${id}/accept`) // POST /api/passes/:id/accept
      await load()
    } catch (e) {
      setErr(e?.response?.data?.message || 'Accept failed')
    }
  }

  async function reject(id){
    setErr('')
    try {
      await api.delete(`/passes/${id}`) // DELETE /api/passes/:id
      await load()
    } catch (e) {
      setErr(e?.response?.data?.message || 'Reject failed')
    }
  }

  return (
  <div className="max-w-6xl mx-auto space-y-6 pb-12">
    {/* Header Section */}
    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm bg-gradient-to-br from-indigo-50/30 via-white to-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Registrations</h1>
          <p className="text-slate-500 mt-1 font-medium">Approve or reject student bus pass applications.</p>
        </div>

        <button 
          onClick={load} 
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 shadow-sm"
        >
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 
          Refresh List
        </button>
      </div>
    </div>

    {err && (
      <div className="mx-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
        {err}
      </div>
    )}

    {loading ? (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Fetching Records...</p>
      </div>
    ) : (
      <div className="space-y-4 px-2">
        {list.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-medium italic">No registration requests found.</p>
          </div>
        )}

        {list.map(p => (
          <div key={p._id} className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              
              {/* Left info: Student Identity & Route */}
              <div className="min-w-0 flex-grow">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {p.fname} {p.lname}
                  </div>

                  <span className="text-[10px] font-black px-2 py-1 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wider border border-slate-200">
                    {p.rollno}
                  </span>

                  {p.isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-widest animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                      Pending
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 mt-4">
                  <div className="text-sm text-slate-500 font-medium">
                    Academic: <b className="text-slate-700">{p.year} • {p.branch}</b>
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    Assigned: <b className="text-indigo-600">Route {p.route}</b> <span className="text-slate-300 mx-1">|</span> <b className="text-slate-700">Bus {p.busno || '—'}</b>
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    Valid Until: <b className="text-slate-700 underline decoration-indigo-200 underline-offset-4">{p.datevalid}</b>
                  </div>
                </div>

                {typeof p.priceINR === 'number' && (
                  <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 inline-flex flex-wrap items-center gap-x-4 gap-y-1">
                    <div className="text-sm font-bold text-slate-700">
                      Fare: <span className="text-emerald-600">₹{p.priceINR}</span>
                    </div>
                    {p.passType && (
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        Type: {p.passType}
                      </div>
                    )}
                    {p.distanceKm && (
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                        Dist: {p.distanceKm} km
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Section */}
              <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                {!p.isAvailable && (
                  <button
                    onClick={() => accept(p._id)}
                    className="flex-grow lg:w-32 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Accept
                  </button>
                )}

                <button
                  onClick={() => reject(p._id)}
                  className="flex-grow lg:w-32 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-100 bg-white text-red-500 font-bold text-sm hover:bg-red-50 transition-all active:scale-95"
                >
                  <XCircle className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)

}
