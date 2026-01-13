import { useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import { CalendarRange, Info, CreditCard, ArrowRight, MapPin ,Loader2} from 'lucide-react'
import { calculateFareINR } from '../../utils/locations'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function RenewPass(){
  const [info, setInfo] = useState(null)
  const [pass, setPass] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(true)
  const [paying, setPaying] = useState(false)

  // Load "my pass" + renewal preview automatically
  useEffect(() => {
    let ok = true
    ;(async () => {
      setErr('')
      setBusy(true)
      try {
        const my = await api.get('/passes/my')
        const p = my?.data?.pass || null
        if (!ok) return
        setPass(p)

        if (!p?._id) {
          setInfo(null)
          return
        }

        // Call renew preview without rollno (my renewal mode)
        const r = await api.post('/passes/renew', {})
        if (!ok) return
        setInfo(r.data)
        setStartDate(r.data?.suggestedStartDate || '')
      } catch (e) {
        if (!ok) return
        setErr(e?.response?.data?.message || 'Could not load renewal info')
      } finally {
        if (ok) setBusy(false)
      }
    })()
    return () => { ok = false }
  }, [])

  const daysToAdd = useMemo(() => {
    const pt = (pass?.passType || 'monthly').toLowerCase()
    if (pt === 'weekly') return 7
    if (pt === 'yearly') return 365
    return 30
  }, [pass?.passType])

  const nextTillLocal = useMemo(() => {
    if (!startDate) return ''
    return addDays(startDate, daysToAdd)
  }, [startDate, daysToAdd])

  const amountINR = useMemo(() => {
    if (pass?.priceINR) return pass.priceINR
    if (pass?.source && pass?.destination && pass?.passType) {
      return calculateFareINR(pass.source, pass.destination, pass.passType)?.priceINR || 0
    }
    return 0
  }, [pass])

  async function renewNow(){
    setErr('')
    if (!pass?._id) {
      setErr('No pass found to renew.')
      return
    }
    if (!startDate) {
      setErr('Please choose a start date.')
      return
    }
    if (!amountINR || amountINR <= 0) {
      setErr('Could not calculate renewal amount.')
      return
    }

    setPaying(true)
    try {
      const ok = await loadRazorpayScript()
      if (!ok) {
        setErr('Razorpay SDK failed to load.')
        return
      }

      const amountPaise = amountINR * 100

      // Same endpoint name
      const { data } = await api.post('/payments/create-checkout', {
        amountPaise,
        passId: pass._id,
        purpose: 'renewal',
        startDate
      })

      if (!data?.key || !data?.orderId) {
        setErr('Could not start renewal payment.')
        return
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'E-Bus Pass',
        description: 'Renewal payment',
        order_id: data.orderId,

        handler: async function (response) {
          // verify + backend applies renewal validity
          await api.post('/payments/verify-payment', {
            passId: pass._id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          })

          // Refresh pass + preview
          const my = await api.get('/passes/my')
          setPass(my?.data?.pass || null)

          const r = await api.post('/passes/renew', {})
          setInfo(r.data)
          setStartDate(r.data?.suggestedStartDate || '')
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (e) {
      setErr(e?.response?.data?.message || 'Renewal payment failed')
    } finally {
      setPaying(false)
    }
  }

return (
  <div className="min-h-[calc(100vh-120px)] bg-gradient-to-b from-slate-50 via-white to-white py-12 px-4">
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-100/50 p-8 md:p-12 relative overflow-hidden">
        
        {/* Top Highlight Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-3">
              <CalendarRange className="h-3.5 w-3.5" /> Fast Renewal
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Renew My Pass</h1>
            <p className="text-slate-500 mt-1 font-medium">
              Your latest pass is loaded automatically for a seamless extension.
            </p>
          </div>
        </div>

        {err && (
          <div className="mb-8 flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold animate-in slide-in-from-top-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
            {err}
          </div>
        )}

        {busy && (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Retrieving Pass Data...</p>
          </div>
        )}

        {!busy && !pass && (
          <div className="rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/50 p-10 text-center">
            <div className="bg-white w-16 h-16 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4">
              <Info className="h-8 w-8 text-slate-300" />
            </div>
            <div className="text-slate-900 font-black text-lg">No active pass found</div>
            <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
              Please create a pass from the <b className="text-blue-600">Register</b> section before attempting a renewal.
            </p>
          </div>
        )}

        {!busy && pass && (
          <div className="space-y-6">
            {/* Pass Preview Card */}
            <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Pass Identity</div>
              <div className="font-black text-xl text-slate-900 tracking-tight">
                {pass.fname} {pass.lname} <span className="text-blue-600 mx-2">/</span> <span className="text-slate-400">{pass.rollno}</span>
              </div>
              
              <div className="mt-4 flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 w-fit">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="font-bold text-slate-700 text-sm">
                  {pass.source} <span className="text-slate-300 mx-2">→</span> {pass.destination}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 border-t border-slate-100 pt-6">
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Pass Type</span>
                  <span className="font-bold text-slate-700 capitalize">{pass.passType}</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">Renewal Fee</span>
                  <span className="font-bold text-emerald-600">₹ {amountINR}</span>
                </div>
              </div>
            </div>

            {/* Renewal Form */}
            <div className="rounded-3xl border border-blue-50 bg-blue-50/30 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-blue-100 hidden md:block">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                
                <div className="w-full space-y-6">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Current Expiry</span>
                    <div className="text-lg font-black text-slate-900 underline decoration-blue-200 underline-offset-4 decoration-2">
                      {info?.current || pass.validTill || '—'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Renewal Start Date</label>
                      <input
                        type="date"
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all shadow-sm"
                        value={startDate || ''}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Next Valid Till (auto)</label>
                      <input
                        className="w-full bg-slate-100 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-400 outline-none cursor-not-allowed shadow-inner"
                        value={nextTillLocal || info?.nextValidTill || ''}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={renewNow}
                      disabled={paying}
                      type="button"
                      className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-xl shadow-emerald-100 active:scale-95 uppercase tracking-widest"
                    >
                      {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                      {paying ? 'Processing...' : 'Secure Renewal Payment'}
                    </button>
                  </div>

                  <div className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 bg-white/50 w-fit px-3 py-1.5 rounded-lg border border-blue-50">
                    <ArrowRight className="h-3 w-3 text-blue-500" />
                    Payment updates your validity automatically
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)
}
