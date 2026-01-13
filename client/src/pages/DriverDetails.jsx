import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import { Search, Phone, BusFront, MapPin, User, Loader2} from 'lucide-react'

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'D'
  const a = parts[0][0] || 'D'
  const b = parts.length > 1 ? (parts[parts.length - 1][0] || '') : ''
  return (a + b).toUpperCase()
}

export default function DriverDetails(){
  const [list, setList] = useState([])
  const [q, setQ] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  async function load(){
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.get('/drivers') // GET /api/drivers
      setList(Array.isArray(data) ? data : [])
    } catch (e) {
      setErr(e?.response?.data?.message || 'Could not load drivers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return list
    return list.filter(d => {
      const a = (d?.name || '').toLowerCase()
      const b = (d?.route || '').toLowerCase()
      const c = String(d?.busno || '').toLowerCase()
      const p = String(d?.phone || '').toLowerCase()
      return a.includes(t) || b.includes(t) || c.includes(t) || p.includes(t)
    })
  }, [q, list])

  return (
  <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-slate-50 via-white to-slate-50 py-10">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      
      {/* Header & Search Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-100/50 p-8 md:p-10 mb-8 relative overflow-hidden">
        {/* Abstract Background Detail */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-4">
              <BusFront className="h-3.5 w-3.5" />
              Fleet Directory
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bus Drivers & Routes</h1>
            <p className="text-slate-500 mt-2 font-medium">
              Access real-time information for bus numbers, designated routes, and direct driver contact details.
            </p>
          </div>

          <div className="w-full lg:w-[420px] relative group">
            <Search className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
            <input
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 text-sm font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-400"
              placeholder="Search name, route, or phone..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>
      </div>

      {err && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <span className="h-2 w-2 rounded-full bg-rose-500"></span>
          {err}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Updating Directory...</p>
        </div>
      ) : (
        <div className="relative">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-16 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-slate-200" />
              </div>
              <h2 className="text-xl font-black text-slate-900">No records found</h2>
              <p className="text-slate-500 mt-2 font-medium max-w-sm mx-auto">
                No drivers match your current search. Try checking for different keywords or contact admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(d => (
                <div key={d._id} className="group bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                  <div className="flex items-start gap-5 relative z-10">
                    {/* Driver Avatar */}
                    {d.photo ? (
                      <img
                        src={d.photo}
                        alt={d.name}
                        className="h-16 w-16 rounded-2xl object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xl font-black shadow-lg">
                        {initials(d.name)}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="font-black text-slate-900 text-lg truncate tracking-tight">
                        {d.name || 'Unregistered Driver'}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                          ID: {d.id || 'N/A'}
                        </span>
                      </div>

                      <div className="mt-5 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                            <BusFront className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                          </div>
                          <span className="text-sm font-bold text-slate-600">
                            <span className="text-slate-400 font-medium">Bus:</span> {d.busno || '—'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                            <MapPin className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                          </div>
                          <span className="text-sm font-bold text-slate-600 truncate">
                            <span className="text-slate-400 font-medium">Route:</span> {d.route || '—'}
                          </span>
                        </div>
                      </div>

                      {d.phone && (
                        <a
                          href={`tel:${d.phone}`}
                          className="mt-6 flex items-center justify-center w-full gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-[0.97] shadow-lg shadow-slate-100"
                        >
                          <Phone className="h-4 w-4" />
                          Call Driver
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Decorative background element for the card */}
                  <div className="absolute bottom-0 right-0 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-1/4">
                    <BusFront size={120} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)
}
