import { useEffect, useState } from 'react'
import api from '../../services/api'
import { Loader2,User,Download, BadgeCheck, Clock, BusFront, MapPin, CalendarRange } from 'lucide-react'

export default function ViewPass(){
  const [pass, setPass] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(true)

  useEffect(() => {
    let ok = true
    ;(async () => {
      setErr('')
      setBusy(true)
      try {
        const { data } = await api.get('/passes/my')
        if (!ok) return
        setPass(data?.pass || null)
      } catch (e) {
        setErr(e?.response?.data?.message || 'Could not load your pass')
      } finally {
        if (ok) setBusy(false)
      }
    })()
    return () => { ok = false }
  }, [])

 async function download(){
  if (!pass?._id) return
  try {
    const res = await api.get(`/passes/${pass._id}/pdf`, { responseType: 'blob' })

    console.log("PDF status:", res.status)
    console.log("Content-Type:", res.headers['content-type'])
    console.log("Blob size:", res.data.size)

    // If server returned JSON error, show it instead of saving
    const ct = res.headers['content-type'] || ''
    if (ct.includes('application/json')) {
      const text = await res.data.text()
      console.log("Server JSON:", text)
      throw new Error("Server returned JSON, not PDF. Check backend.")
    }

    const url = window.URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url
    a.download = `BusPass_${pass.rollno || 'pass'}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)

  } catch (e) {
    setErr(e?.message || 'Download failed')
  }
}



  const approved = pass?.isAvailable === true

  return (
  <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 px-4">
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest">
            <BusFront className="h-3.5 w-3.5" />
            Student Identity
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">My Digital Pass</h1>
          <p className="text-slate-500 font-medium">Verified transit credentials for the current academic session.</p>
        </div>

        {pass && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-black text-xs uppercase tracking-tighter ${
            approved
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50'
              : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
          }`}>
            <span className={`h-2 w-2 rounded-full ${approved ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            {approved ? 'System Approved' : 'Pending Verification'}
          </div>
        )}
      </div>

      {err && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
          {err}
        </div>
      )}

      {busy && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Syncing Pass Data...</p>
        </div>
      )}

      {!busy && !pass && !err && (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100 p-12 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <BusFront className="h-10 w-10 text-slate-200" />
          </div>
          <h2 className="text-xl font-black text-slate-900">No Credentials Found</h2>
          <p className="text-slate-500 mt-2 font-medium max-w-sm mx-auto">
            You haven’t applied for a bus pass yet. Head over to the registration section to begin.
          </p>
        </div>
      )}

      {!busy && pass && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main ID Card Visual */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative group">
              {/* Card Design Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
              
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Mock Profile Picture Area */}
                  <div className="w-24 h-24 bg-slate-100 rounded-3xl shrink-0 flex items-center justify-center border-4 border-white shadow-md">
                    <User className="h-12 w-12 text-slate-300" />
                  </div>

                  <div className="flex-grow space-y-4">
                    <div>
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Full Name</div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
                        {pass.fname} {pass.lname}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Roll Number</div>
                        <div className="font-bold text-slate-700">{pass.rollno}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Year / Branch</div>
                        <div className="font-bold text-slate-700">{pass.year} / {pass.branch}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Route</div>
                      <div className="font-black text-slate-900 uppercase">
                        {pass.source} <span className="text-blue-300 mx-1">→</span> {pass.destination}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-white rounded-xl border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pass Type</div>
                    <div className="font-black text-blue-700 text-sm uppercase italic">{pass.passType}</div>
                  </div>
                </div>
              </div>

              {/* Security Footer Bar */}
              <div className={`p-4 text-center text-[10px] font-black uppercase tracking-[0.3em] ${approved ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {approved ? '✓ Verified Digital Document' : 'Pending Administrative Review'}
              </div>
            </div>
          </div>

          {/* Validity & Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Validity Period</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <CalendarRange className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Effective From</div>
                    <div className="font-bold text-slate-800">{pass.validFrom || '—'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <CalendarRange className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expires On</div>
                    <div className="font-bold text-slate-800">{pass.validTill || '—'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-3">
                {approved ? (
                  <>
                    <button
                      onClick={download}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </button>
                    <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 text-[10px] font-black uppercase tracking-tighter">
                      <BadgeCheck className="h-4 w-4" /> Ready for Inspection
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 text-center">
                    <Clock className="h-8 w-8 text-amber-500 mb-1 animate-spin-slow" />
                    <div>
                      <div className="text-xs font-black text-amber-800 uppercase tracking-widest">Awaiting Review</div>
                      <p className="text-[10px] text-amber-700/70 font-bold mt-1">Our team is currently verifying your application.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)
}
