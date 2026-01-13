import { CheckCircle2, Home, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Success(){
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-emerald-100 border border-emerald-50 text-center relative overflow-hidden">
        
        {/* Animated Background Confetti-like shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-emerald-500"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full opacity-60"></div>
        
        <div className="relative z-10">
          {/* Success Icon with Pulse Effect */}
          <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-20"></div>
            <CheckCircle2 className="h-12 w-12 text-emerald-600 relative z-10" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
            Payment Success
          </h1>
          
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Thank you! Your payment was received successfully. Your digital bus pass is now being processed.
          </p>

          {/* Transaction Summary Card */}
          <div className="bg-emerald-50/50 rounded-2xl p-5 mb-8 border border-emerald-100/50 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black text-emerald-700/50 uppercase tracking-widest">Status</span>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">COMPLETED</span>
            </div>
            <p className="text-xs text-emerald-800/80 font-medium">
              A confirmation email has been sent to your registered address.
            </p>
          </div>

          <div className="space-y-3">
            <Link 
              to="/dashboard" 
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <Link 
              to="/" 
              className="block w-full py-3 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}