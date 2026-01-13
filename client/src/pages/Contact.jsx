import { Mail, Phone, Clock, Send } from 'lucide-react'

export default function Contact(){
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h1 className="text-2xl font-semibold mb-3">Contact Us</h1>
        <p className="text-gray-700">Have questions about your pass or routes? Reach us anytime.</p>
        <ul className="mt-4 text-gray-700 space-y-2">
          <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-700"/> <b>Email:</b> support@ebuspass.local</li>
          <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-700"/> <b>Phone:</b> +91 90000 00000</li>
          <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-700"/> <b>Hours:</b> Mon–Sat, 9:00–18:00</li>
        </ul>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-3">Send a message</h2>
        <form className="grid grid-cols-1 gap-3">
          <input className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600/40" placeholder="Your name" />
          <input className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-600/40" placeholder="Email" />
          <textarea className="border p-2 rounded min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-600/40" placeholder="Your message" />
          <button type="button" className="justify-self-start px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2">
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </div>
    </div>
  )
}
