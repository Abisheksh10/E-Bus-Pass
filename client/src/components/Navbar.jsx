import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BusFront, LogOut, User, ShieldCheck } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'admin'

  // Dynamic styling based on active state and user role
  const linkClass = ({ isActive }) => {
    const base = "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 "
    if (isActive) {
      return base + (isAdmin 
        ? "bg-purple-600 text-white shadow-lg shadow-purple-100 scale-105" 
        : "bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105")
    }
    return base + "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
  }

  return (
    <header className="sticky top-0 z-[100] border-b border-slate-100 bg-white/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        
        {/* Brand Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-[360deg] shadow-sm ${isAdmin ? 'bg-purple-600' : 'bg-blue-600'}`}>
            <BusFront className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 text-sm leading-none tracking-tighter uppercase">
              E-Bus <span className={isAdmin ? 'text-purple-600' : 'text-blue-600'}>Pass</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Transit System</span>
          </div>
        </NavLink>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-[1.25rem] border border-slate-100">
          <NavLink to="/" className={linkClass}>Home</NavLink>

          {/* Drivers only for guest + student */}
          {(!user || (user && !isAdmin)) && (
            <NavLink to="/driver" className={linkClass}>Drivers</NavLink>
          )}

          {/* Student Links */}
          {user && !isAdmin && (
            <>
              <NavLink to="/busregister" className={linkClass}>Register</NavLink>
              <NavLink to="/pass" className={linkClass}>My Pass</NavLink>
              <NavLink to="/renewal" className={linkClass}>Renew</NavLink>
            </>
          )}

          {/* Admin Links */}
          {user && isAdmin && (
            <>
              <NavLink to="/admin" className={linkClass}>Requests</NavLink>
              
            </>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className={`h-2 w-2 rounded-full animate-pulse ${isAdmin ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                {isAdmin ? 'Admin Mode' : 'Student'}
              </span>
            </div>
          )}

          {!user ? (
            <NavLink 
              to="/login" 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95"
            >
              <ShieldCheck className="h-4 w-4" />
              Login
            </NavLink>
          ) : (
            <button 
              onClick={logout} 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border-2 border-slate-100 text-slate-900 text-[11px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition-all active:scale-95"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}


