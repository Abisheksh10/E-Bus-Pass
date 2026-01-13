import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login(){
  const { login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  function set(k,v){ setForm(p=>({...p,[k]:v})) }

  async function submit(e){
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const res = await login(form)
      // If backend sets role in /auth/me, refreshMe covers it; we simply go home or profile
      if (res?.role === 'admin') {
        nav('/admin')
      } else {
        nav('/')
      }
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

return (
  <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 md:p-8 overflow-hidden relative">
    {/* Decorative Background Blobs for extra color */}
    <div className="absolute top-0 -left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

    <div className="max-w-5xl w-full mx-auto overflow-hidden bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 border border-white relative z-10">
      <div className="grid lg:grid-cols-2 items-stretch min-h-[650px]">
        
        {/* Left panel: Vibrant Transit Theme */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-orange-500 p-12 text-white">
          {/* Abstract Pass Shape Decor */}
          <div className="absolute -right-10 top-20 w-40 h-56 bg-white/10 rounded-3xl rotate-12 backdrop-blur-sm border border-white/20"></div>
          <div className="absolute -right-5 top-24 w-40 h-56 bg-white/10 rounded-3xl rotate-6 backdrop-blur-sm border border-white/20"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-400/20 backdrop-blur-md border border-orange-300/30 text-orange-50 text-xs font-black uppercase tracking-[0.2em]">
                Smart Commute
              </div>
              <h2 className="text-5xl font-black mt-10 leading-none tracking-tight">
                Your City. <br/>
                <span className="text-orange-300">Your Pass.</span> <br/>
                Your Way.
              </h2>
              <p className="text-indigo-50/80 mt-8 text-lg font-medium max-w-sm leading-relaxed">
                Join 50,000+ students commuting smarter every day with digital-first transit.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-1 w-12 rounded-full bg-orange-400"></div>
                <div className="h-1 w-4 rounded-full bg-white/40"></div>
                <div className="h-1 w-4 rounded-full bg-white/40"></div>
              </div>
              <p className="text-sm font-semibold text-indigo-100 italic">
                "The easiest way to renew my monthly pass!" — Metro Student Review
              </p>
            </div>
          </div>
        </div>

        {/* Right form: Colorful Accents */}
        <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-8">
                <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl mb-4 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <LogIn className="text-white w-6 h-6" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Login</h1>
                <p className="text-slate-500 mt-2 font-medium">Access your dashboard to manage passes.</p>
            </div>

            {err && (
              <div className="mt-4 p-4 rounded-2xl bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm font-bold flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                {err}
              </div>
            )}

            <form onSubmit={submit} className="space-y-5 mt-6">
              <div>
                <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1 mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="h-5 w-5 text-indigo-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm rounded-2xl focus:ring-0 focus:border-indigo-500 block w-full pl-12 p-4 transition-all outline-none placeholder:text-slate-400 font-medium"
                    placeholder=""
                    value={form.email}
                    onChange={e=>set('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1 mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="h-5 w-5 text-indigo-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm rounded-2xl focus:ring-0 focus:border-indigo-500 block w-full pl-12 pr-20 p-4 transition-all outline-none placeholder:text-slate-400 font-medium"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e=>set('password', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={()=>setShowPwd(s=>!s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-black tracking-tighter bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl shadow-sm transition-all"
                  >
                    {showPwd ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <button 
                className="group relative w-full overflow-hidden rounded-2xl p-[2px] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 mt-4"
              >
                
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-indigo-600 group-hover:bg-indigo-700 px-8 py-4 text-white font-bold transition-all gap-2">
                 
                   <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </form>

            <div className="mt-8 space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Help & Access</span></div>
                </div>
                
                <div className="flex flex-col gap-3">
                    <a href="/signup" className="flex items-center justify-between p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-100 transition-colors group">
                        <span className="text-sm font-bold text-orange-700">New Student? Sign Up</span>
                        <span className="text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                    
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)


}
