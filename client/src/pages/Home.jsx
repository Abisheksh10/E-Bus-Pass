import { Link } from 'react-router-dom'
import { BusFront, FileSignature, Search, CalendarRange, UserCog, MapPin, ShieldCheck, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Card({ icon, title, desc, to, color = "bg-blue-600" }) {
  return (
    <Link to={to} className="group block h-full">
      <div className="h-full border border-slate-100 rounded-[2rem] p-6 bg-white shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 group-hover:border-blue-200">
        <div className="flex flex-col gap-4">
          <div className={`h-14 w-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-700 transition tracking-tight">{title}</h3>
            <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{desc}</p>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 mt-5 group-hover:gap-3 transition-all">
              Launch Module <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function AdminDashboardHome({ user }) {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-50/50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Admin Hero Section */}
        <div className="rounded-[3rem] p-10 md:p-14 border border-purple-100 bg-white shadow-2xl shadow-purple-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <UserCog className="h-3.5 w-3.5" />
              Terminal Access
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
              Control Center
            </h1>
            <p className="text-slate-500 mt-4 text-lg font-medium max-w-xl">
              Centralized hub for managing fleet logistics, student pass verifications, and system-wide driver profiles.
            </p>

            <div className="mt-8 flex items-center gap-3 bg-purple-50 w-fit px-4 py-2 rounded-2xl border border-purple-100">
              <div className="h-2 w-2 rounded-full bg-purple-600 animate-pulse"></div>
              <span className="text-xs font-bold text-purple-900">Operator: <span className="font-black">{user?.email}</span></span>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Administrative Modules</h2>
              <p className="text-slate-500 font-medium">Restricted access tools</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              icon={<UserCog className="h-6 w-6" />}
              title="Pass Requests"
              desc="Review incoming student applications. Approve identity documents and issue valid passes."
              to="/admin/registrations"
              color="bg-purple-600"
            />

            <Card
              icon={<BusFront className="h-6 w-6" />}
              title="Manage Drivers"
              desc="Modify the fleet directory. Update contact info, routes, and assign bus numbers."
              to="/admin/drivers"
              color="bg-slate-900"
            />

            <Card
              icon={<MapPin className="h-6 w-6" />}
              title="Public Preview"
              desc="Audit the driver details page from the perspective of a student user."
              to="/driver"
              color="bg-orange-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StudentHome({ user }) {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Student Hero Section */}
        <div className="rounded-[3rem] p-10 md:p-14 border border-blue-100 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-200 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
            <BusFront size={400} />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md border border-white/20">
                <BusFront className="h-3.5 w-3.5" />
                Transit Smart Portal
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-[1.1]">
                Your Journey, <br />Digitally Verified.
              </h1>
              <p className="text-blue-100 mt-6 text-lg font-medium max-w-xl leading-relaxed">
                Experience seamless campus transit. Apply for your E-Pass, track approvals, and manage renewals in one click.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 shadow-2xl min-w-[300px]">
              <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Session Status</div>
              <div className="font-black text-white text-xl truncate">
                {user?.email || 'Guest User'}
              </div>
              
              <div className="mt-6">
                {!user ? (
                  <Link
                    to="/login"
                    className="w-full inline-flex justify-center items-center gap-3 px-6 py-4 rounded-2xl bg-white text-blue-700 font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Secure Login
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 py-3 px-4 bg-emerald-500/20 rounded-2xl border border-emerald-400/30">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-[10px] font-black text-emerald-100 uppercase tracking-widest">Authenticated</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Quick Actions</h2>
              <p className="text-slate-500 font-medium">Standard student services</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              icon={<FileSignature className="h-6 w-6" />}
              title="New Pass"
              desc="Initiate a fresh application for the new semester."
              to="/busregister"
              color="bg-blue-600"
            />

            <Card
              icon={<Search className="h-6 w-6" />}
              title="My Pass"
              desc="Access your digital ID and check approval status."
              to="/pass"
              color="bg-emerald-600"
            />

            <Card
              icon={<CalendarRange className="h-6 w-6" />}
              title="Renew Pass"
              desc="Extend your validity via secure Razorpay payment."
              to="/renewal"
              color="bg-indigo-600"
            />

            <Card
              icon={<MapPin className="h-6 w-6" />}
              title="Drivers"
              desc="Real-time contact info for your bus route."
              to="/driver"
              color="bg-orange-600"
            />
          </div>
        </div>

        <div className="mt-16 py-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Note: Pass becomes downloadable only after admin approval.
          </div>
          <div className="flex gap-6">
            <span className="text-xs font-black text-slate-300 uppercase tracking-tighter italic">2025 Transit E-System</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  if (isAdmin) return <AdminDashboardHome user={user} />
  return <StudentHome user={user} />
}