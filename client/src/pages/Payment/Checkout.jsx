import { useEffect } from "react"
import api from "../../services/api"
import { CreditCard } from "lucide-react"

function loadRazorpayScript() {
  return new Promise((resolve) => {
    // already loaded
    if (window.Razorpay) return resolve(true)

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Checkout() {
  useEffect(() => {
    // preload razorpay once for smoother UX
    loadRazorpayScript()
  }, [])

  async function go() {
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      alert("Razorpay SDK failed to load. Check your internet/network.")
      return
    }

    // Keep your existing API endpoint name
    // If your flow uses dynamic amount/passId, send them here.
    const { data } = await api.post("/payments/create-checkout", {
      amountPaise: 50000,
      passId: null
    })

    if (!data?.key || !data?.orderId) {
      alert("Failed to create payment order")
      return
    }

    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency || "INR",
      name: "E-Bus Pass",
      description: "Bus pass payment",
      order_id: data.orderId,

      handler: async function (response) {
        // Verify signature in backend
        await api.post("/payments/verify-payment", {
          passId: data.passId, // backend should return passId; if null, you must send it from frontend
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
  }

  return (
  <div className="min-h-[60vh] flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-100 border border-slate-100 text-center relative overflow-hidden">
      
      {/* Decorative background circle */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-50 rounded-full opacity-50"></div>
      
      <div className="relative z-10">
        {/* Payment Icon Visual */}
        <div className="mx-auto w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner border border-blue-100/50">
          <CreditCard className="h-10 w-10 text-blue-600" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
          Finalize Payment
        </h1>
        
        <p className="mb-8 text-slate-500 font-medium leading-relaxed">
          You are one step away! Proceed to the secure payment gateway to complete your bus pass purchase.
        </p>

        {/* Payment Details Mock (Optional Visual) */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-slate-400 uppercase tracking-widest text-[10px]">Service</span>
            <span className="text-slate-700">Digital Bus Pass</span>
          </div>
          <div className="h-px bg-slate-200 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Security</span>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">SSL ENCRYPTED</span>
          </div>
        </div>

        <button 
          onClick={go} 
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
        >
          Pay Now
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-8 flex items-center justify-center gap-4 opacity-40 grayscale">
          <div className="h-6 w-10 bg-slate-300 rounded-md"></div>
          <div className="h-6 w-10 bg-slate-300 rounded-md"></div>
          <div className="h-6 w-10 bg-slate-300 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
)
}
