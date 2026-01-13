export default function About(){
  return (
    <div className="relative">
      {/* subtle grid background via CSS only */}
      <div
        className="absolute inset-0 pointer-events-none [background:radial-gradient(circle,rgba(2,132,199,0.06)_1px,transparent_1px)] [background-size:18px_18px]"
        aria-hidden
      />
      <div className="relative bg-white/90 rounded-xl p-6 shadow-sm border">
        <h1 className="text-2xl font-semibold mb-3">About E-Bus Pass</h1>
        <p className="text-gray-700 leading-relaxed">
          The E-Bus Pass system digitizes student transportation passes. Students can register,
          pay online and instantly retrieve their digital pass. Administrators get a dashboard
          to review registrations, approve or reject, and manage driver/route details.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          This React (Vite) + Tailwind frontend is designed to be fast, accessible and responsive,
          while the backend (Node/Express + MongoDB) provides secure APIs for authentication,
          registrations, approvals, driver management and payments.
        </p>
      </div>
    </div>
  )
}
