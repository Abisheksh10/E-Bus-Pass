// import { Link } from 'react-router-dom'
// import { ClipboardList, Users, BusFront, ArrowRight, ShieldCheck } from 'lucide-react'
// import { useAuth } from '../../context/AuthContext'

// function DashCard({ to, icon, title, desc, badge }) {
//   return (
//     <Link to={to} className="group block">
//       <div className="card p-6">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex items-start gap-4">
//             <div className="h-11 w-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
//               {icon}
//             </div>
//             <div className="min-w-0">
//               <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition">
//                 {title}
//               </div>
//               <div className="text-sm text-slate-600 mt-1">{desc}</div>
//             </div>
//           </div>

//           {badge && (
//             <span className="text-xs font-medium px-2 py-1 rounded-full border bg-slate-50 text-slate-700">
//               {badge}
//             </span>
//           )}
//         </div>

//         <div className="mt-4 text-sm text-blue-700 font-medium inline-flex items-center gap-2">
//           Open <ArrowRight className="h-4 w-4" />
//         </div>
//       </div>
//     </Link>
//   )
// }

// export default function Dashboard(){
//   const { user } = useAuth()

//   return (
//     <div className="space-y-6">
//       <div className="app-surface p-6 md:p-8 bg-gradient-to-br from-purple-50 to-white">
//         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
//           <ShieldCheck className="h-4 w-4" />
//           Admin Dashboard
//         </div>

//         <h1 className="app-title mt-3">Welcome, Admin</h1>
//         <p className="app-subtitle mt-2">
//           Manage pass approvals and driver information from here.
//         </p>

//         {user?.email && (
//           <div className="mt-4 text-sm text-slate-700">
//             Logged in as: <b>{user.email}</b>
//           </div>
//         )}
//       </div>

//       <div>
//         <h2 className="text-lg font-semibold text-slate-900">Admin Tools</h2>
//         <p className="text-sm text-slate-600 mt-1">Quick access to all admin pages.</p>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//           <DashCard
//             to="/admin/registrations"
//             icon={<ClipboardList className="h-5 w-5" />}
//             title="View Registrations"
//             desc="Approve or reject applications"
//             badge="Passes"
//           />

//           <DashCard
//             to="/admin/drivers"
//             icon={<BusFront className="h-5 w-5" />}
//             title="Manage Drivers"
//             desc="Add, edit, or remove drivers"
//             badge="Drivers"
//           />

//           <DashCard
//             to="/"
//             icon={<Users className="h-5 w-5" />}
//             title="Back to Site"
//             desc="Return to public pages"
//             badge="Home"
//           />
//         </div>
//       </div>
//     </div>
//   )
// }








import { Link } from 'react-router-dom'
import { ClipboardList, Users, BusFront, ArrowRight, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function DashCard({ to, icon, title, desc, badge }) {
  return (
    <Link to={to} className="group block h-full">
      <div className="h-full p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              {icon}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {title}
              </div>
              <div className="text-sm text-slate-500 mt-1 leading-snug">{desc}</div>
            </div>
          </div>

          {badge && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>

        <div className="mt-6 text-sm text-blue-700 font-bold inline-flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          Open Tools <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

export default function Dashboard(){
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Hero Section */}
      <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 shadow-sm relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 bg-purple-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wide">
            <ShieldCheck className="h-4 w-4" />
            Admin Dashboard
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 tracking-tight">
            Welcome, Admin
          </h1>
          <p className="text-slate-600 mt-2 text-lg max-w-2xl leading-relaxed">
            Manage pass approvals and driver information from here.
          </p>

          {user?.email && (
            <div className="mt-6 flex items-center gap-2 text-sm text-slate-500 bg-white/50 w-fit px-4 py-2 rounded-lg border border-slate-100">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Logged in as: <span className="font-bold text-slate-700">{user.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tools Section */}
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Admin Tools</h2>
          <p className="text-sm text-slate-500 mt-1">Quick access to all administrative modules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashCard
            to="/admin/registrations"
            icon={<ClipboardList className="h-6 w-6" />}
            title="View Registrations"
            desc="Approve or reject student applications"
            badge="Passes"
          />

          <DashCard
            to="/admin/drivers"
            icon={<BusFront className="h-6 w-6" />}
            title="Manage Drivers"
            desc="Add, edit, or remove fleet drivers"
            badge="Drivers"
          />

          <DashCard
            to="/"
            icon={<Users className="h-6 w-6" />}
            title="Back to Site"
            desc="Return to the student-facing pages"
            badge="Home"
          />
        </div>
      </section>
    </div>
  )
}
