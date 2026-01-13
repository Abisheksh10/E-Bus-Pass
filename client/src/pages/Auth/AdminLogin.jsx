import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin(){
  const { adminLogin } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ mail:'', password:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  function set(k,v){ setForm(p=>({...p,[k]:v})) }

  async function submit(e){
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await adminLogin(form)
      nav('/admin')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#fcfaff] p-4 md:p-6">
    <div className="max-w-5xl w-full mx-auto overflow-hidden bg-white rounded-[2.5rem] shadow-2xl shadow-purple-100 border border-purple-50">
      <div className="grid lg:grid-cols-2 items-stretch min-h-[580px]">
        
        {/* Left panel: Dark Professional Admin Theme */}
        <div className="hidden lg:flex relative overflow-hidden bg-slate-900 p-12 text-white">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Security Glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 flex flex-col justify-between w-full">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-purple-300 text-xs font-black uppercase tracking-[0.2em]">
                System Authority
              </div>
              <h2 className="text-4xl font-extrabold mt-8 leading-tight tracking-tight">
                Review and approve <br/>
                <span className="text-purple-400 font-black">pass applications.</span>
              </h2>
              <p className="text-slate-400 mt-6 text-lg font-medium leading-relaxed max-w-sm">
                Access the administrative engine to manage registrations, verify student data, and coordinate fleet drivers.
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-500 font-bold border-t border-white/5 pt-8">
              <ShieldCheck className="h-5 w-5 text-purple-500" />
              <span>Restricted Terminal: Authorized Access Only</span>
            </div>
          </div>
        </div>

        {/* Right form: Clean, Serious Login */}
        <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-black uppercase tracking-wider border border-purple-100 mb-4">
                  <ShieldCheck className="h-4 w-4" /> Admin Portal
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Sign In</h1>
                <p className="text-slate-500 mt-2 font-medium">Please enter your administrative credentials.</p>
            </div>

            {err && (
              <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-3 animate-in shake-in">
                <AlertCircle className="h-5 w-5" />
                {err}
              </div>
            )}

            <form onSubmit={submit} className="space-y-5 mt-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-purple-600" />
                  <input
                    type="email"
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm rounded-2xl focus:ring-0 focus:border-purple-500 block w-full pl-12 p-4 transition-all outline-none font-semibold placeholder:text-slate-300"
                    placeholder="admin@transit.gov"
                    value={form.mail}
                    onChange={e=>set('mail', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-purple-600" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm rounded-2xl focus:ring-0 focus:border-purple-500 block w-full pl-12 pr-20 p-4 transition-all outline-none font-semibold placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e=>set('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={()=>setShowPwd(s=>!s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-black text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                  >
                    {showPwd ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <button 
                disabled={busy} 
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
              >
                {busy ? 'Authenticating...' : 'Login'}
                {!busy && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            
          </div>
        </div>
      </div>
    </div>
  </div>
)


}
