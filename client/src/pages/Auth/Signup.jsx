import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Signup(){
  const { signup } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ username:'', email:'', password:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  function set(k,v){ setForm(p=>({...p,[k]:v})) }

  async function submit(e){
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await signup(form)
      nav('/login') // go to student login after successful signup
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
  <div className="min-h-[80vh] flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-blue-100 border border-slate-100 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      <div className="relative z-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
        <p className="text-slate-500 mt-2 font-medium">Sign up to request and manage your bus pass.</p>
        
        {err && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-2 animate-in fade-in zoom-in duration-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            {err}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4 mt-8">
          {/* Full Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
            <div className="relative group">
              <UserPlus className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 p-4 text-sm font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                placeholder="Enter your name"
                value={form.username}
                onChange={e=>set('username', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 p-4 text-sm font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                placeholder="name@university.edu"
                value={form.email}
                onChange={e=>set('email', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</label>
            <div className="relative group">
              <Lock className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input
                type={showPwd ? 'text' : 'password'}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-20 p-4 text-sm font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e=>set('password', e.target.value)}
                minLength={6}
                required
              />
              <button 
                type="button"
                onClick={()=>setShowPwd(s=>!s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-[10px] font-black text-slate-500 hover:text-blue-600 bg-white border border-slate-200 rounded-xl shadow-sm transition-all uppercase tracking-tighter"
              >
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={busy}
            className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100 disabled:opacity-50 disabled:active:scale-100"
          >
            {busy ? 'Creating Account...' : 'Create Account'}
            {!busy && <ArrowRight className="h-5 w-5" />}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-bold">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  </div>
)
}
