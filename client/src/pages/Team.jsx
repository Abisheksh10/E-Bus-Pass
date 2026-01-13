import { UserRound, Code, Shield, Layout } from 'lucide-react'

const members = [
  {name:'Developer One', role:'Full-stack Engineer', icon: Code},
  {name:'Developer Two', role:'Frontend Engineer', icon: Layout},
  {name:'Developer Three', role:'Backend Engineer', icon: Shield},
]

export default function Team(){
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Our Team</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m,idx)=>(
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition">
            <div className="w-full h-44 rounded-lg bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-sky-500/10 flex items-center justify-center">
              <m.icon className="h-14 w-14 text-blue-700" />
            </div>
            <div className="mt-4">
              <div className="font-semibold flex items-center gap-2">
                <UserRound className="h-4 w-4 text-gray-500" /> {m.name}
              </div>
              <div className="text-gray-600 text-sm">{m.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
