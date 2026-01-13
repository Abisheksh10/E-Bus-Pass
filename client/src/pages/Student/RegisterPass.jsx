import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarRange, MapPin, CreditCard, FileSignature, Phone, User, GraduationCap, BusFront } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { LOCATIONS, calculateFareINR } from '../../utils/locations'

const YEARS = ['I','II','III','IV']
const BRANCHES = ['CSE','IT','ECE','EEE','MECH','CIVIL','AIML','AIDS','CSBS']

export default function RegisterPass(){
  const { user } = useAuth()
  const nav = useNavigate()

  // Basic student/application fields
  const [form, setForm] = useState({
    fname: '', lname: '', year: '', branch: '',
    busno: '', phno: '', address: '',
    rollno: '', startDate: '', // e.g. MMYYYY
    source: '', destination: '',
    passType: 'monthly',
  })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  function set(k,v){ setForm(p => ({...p, [k]: v})) }

  // Compute price based on src/dst + pass type
  const fare = useMemo(() => {
    if (!form.source || !form.destination || form.source === form.destination) {
      return { km: 0, priceINR: 0, zoneMonthly: 0 }
    }
    return calculateFareINR(form.source, form.destination, form.passType)
  }, [form.source, form.destination, form.passType])

  useEffect(() => {
    // If user not logged in, guard (safety net; also use ProtectedRoute in routes)
    if (!user) {
      nav('/login', { replace: true })
    }
  }, [user, nav])
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}
function calcValidTill(startDate, passType){
  if (!startDate) return ''
  const d = new Date(startDate + "T00:00:00") // avoid timezone shift
  const days = passType === "weekly" ? 7 : passType === "yearly" ? 365 : 30
  d.setDate(d.getDate() + days)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2,'0')
  const dd = String(d.getDate()).padStart(2,'0')
  return `${yyyy}-${mm}-${dd}`
}


async function submit(e){
  e.preventDefault()
  setErr('')
  if(!form.startDate){
    setErr('Please select a valid start date.')
    return
  }
  if (!fare.priceINR || !form.source || !form.destination || form.source === form.destination) {
    setErr('Please choose a valid source & destination.')
    return
  }

  setBusy(true)
  try {
    // 1) Create pass (no datevalid sent now)
    const payload = {
      ...form,
      route: `${form.source} → ${form.destination}`,
      priceINR: fare.priceINR,
      distanceKm: fare.km,
      isAvailable: false,
    }
    delete payload.datevalid // ensure removed

    const { data } = await api.post('/passes', payload)

    const passId = data?._id
    if (!passId) {
      setErr('Pass created but no _id returned from server.')
      return
    }

    // 2) Create Razorpay order using OLD endpoint name
    const amountPaise = fare.priceINR * 100
    const checkoutRes = await api.post('/payments/create-checkout', {
      amountPaise,
      passId,
      passType: form.passType,
      route: payload.route
    })

    const checkout = checkoutRes?.data
    if (!checkout?.key || !checkout?.orderId) {
      setErr('Could not start checkout.')
      return
    }

    // 3) Open Razorpay popup
    const ok = await loadRazorpayScript()
    if (!ok) {
      setErr('Razorpay SDK failed to load. Check your internet.')
      return
    }

    const options = {
      key: checkout.key,
      amount: checkout.amount,
      currency: checkout.currency || "INR",
      name: "E-Bus Pass",
      description: payload.route,
      order_id: checkout.orderId,

      handler: async function (response) {
        // 4) Verify signature using OLD-friendly endpoint name
        await api.post('/payments/verify-payment', {
          passId,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        })
        window.location.href = "/payment/success"
      },

      modal: {
        ondismiss: function () {
          window.location.href = "/payment/checkout"
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (e) {
    setErr(e?.response?.data?.message || 'Registration failed')
  } finally {
    setBusy(false)
  }
}return (
  <div className="max-w-4xl mx-auto pb-12 px-4">
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-100 border border-slate-100 relative overflow-hidden">
      
      {/* Header Decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          <BusFront className="h-4 w-4" />
          Transportation Services
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          New Bus Pass Application
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Fill the form below to apply. Please ensure your details match your college ID.</p>
        
        {err && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            {err}
          </div>
        )}

        <form onSubmit={submit} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section: Personal Details */}
          <div className="md:col-span-2 border-b border-slate-100 pb-2 mb-2">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Personal Information</h2>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <User className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300" 
                placeholder="First name"
                value={form.fname} 
                onChange={e=>set('fname', e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <User className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300" 
                placeholder="Last name"
                value={form.lname} 
                onChange={e=>set('lname', e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <GraduationCap className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all appearance-none" 
                value={form.year}
                onChange={e=>set('year', e.target.value)} 
                required
              >
                <option value="">Select Year</option>
                {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <GraduationCap className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all appearance-none" 
                value={form.branch}
                onChange={e=>set('branch', e.target.value)} 
                required
              >
                <option value="">Select Branch</option>
                {BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {/* Section: Contact & College ID */}
          <div className="md:col-span-2 border-b border-slate-100 pb-2 mb-2 mt-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Identification</h2>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <Phone className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300" 
                placeholder="Phone"
                value={form.phno} 
                onChange={e=>set('phno', e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <FileSignature className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300" 
                placeholder="College Roll Number"
                value={form.rollno} 
                onChange={e=>set('rollno', e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="relative md:col-span-2 group">
            <FileSignature className="h-4 w-4 text-slate-400 absolute left-4 top-4" />
            <textarea 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300 h-24" 
              placeholder="Full Residential Address"
              value={form.address} 
              onChange={e=>set('address', e.target.value)} 
              required 
            />
          </div>

          {/* Section: Pass & Route */}
          <div className="md:col-span-2 border-b border-slate-100 pb-2 mb-2 mt-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Route & Pass Details</h2>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
            <div className="relative group">
              <CalendarRange className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all"
                value={form.startDate}
                onChange={e=>set('startDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Expiration (Auto)</label>
            <div className="relative group">
              <CalendarRange className="h-4 w-4 text-slate-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                className="w-full bg-slate-100 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-bold text-slate-500 outline-none cursor-not-allowed"
                value={calcValidTill(form.startDate, form.passType)}
                readOnly
                placeholder="Valid till (auto)"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <MapPin className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all appearance-none" 
                value={form.source}
                onChange={e=>set('source', e.target.value)} 
                required
              >
                <option value="">Source (Chennai)</option>
                {LOCATIONS.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <MapPin className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all appearance-none" 
                value={form.destination}
                onChange={e=>set('destination', e.target.value)} 
                required
              >
                <option value="">Destination (Chennai)</option>
                {LOCATIONS.map(l => <option key={l.name} value={l.name}>{l.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <CreditCard className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <select 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all appearance-none" 
                value={form.passType}
                onChange={e=>set('passType', e.target.value)} 
                required
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <BusFront className="h-4 w-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-11 text-sm font-semibold outline-none focus:border-blue-500 transition-all placeholder:text-slate-300" 
                placeholder="Bus Number (optional)"
                value={form.busno} 
                onChange={e=>set('busno', e.target.value)} 
              />
            </div>
          </div>

          {/* Fare Summary Box */}
          <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-100 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
              <div className="space-y-1">
                <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Route Distance</div>
                <div className="text-2xl font-black">{fare.km} <span className="text-sm font-normal">km</span></div>
              </div>
              <div className="h-10 w-px bg-white/20 hidden md:block"></div>
              <div className="space-y-1">
                <div className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Plan Selected</div>
                <div className="text-xl font-bold capitalize">{form.passType} Pass</div>
              </div>
              <div className="h-10 w-px bg-white/20 hidden md:block"></div>
              <div className="bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/20">
                <div className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Total Price</div>
                <div className="text-3xl font-black text-white">₹ {fare.priceINR}</div>
              </div>
            </div>
          </div>

          <button
            disabled={busy || !fare.priceINR}
            className="md:col-span-2 mt-4 bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            {busy ? 'Redirecting to Secure Gateway...' : 'Proceed to Secure Payment'}
            <CreditCard className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}
