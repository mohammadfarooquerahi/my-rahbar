export const metadata = {
  title: "Contact Rahbars | Get Admission Support",
  description: "Have questions about universities in Pakistan? Get in touch with the Rahbars team.",
  alternates: { canonical: "https://www.rahbars.com/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-3" style={{ fontFamily: "Sora" }}>
          Contact <span className="text-blue-600">Us</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">Have questions about university admissions? We&#39;re here to help!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-lg text-slate-900 mb-4">Get in Touch</h2>
          <div className="space-y-4">
            <a href="mailto:farooqrahi828@gmail.com" className="flex items-center gap-3 text-slate-600 hover:text-blue-600">📧 farooqrahi828@gmail.com</a>
            <a href="https://wa.me/923190211218" className="flex items-center gap-3 text-slate-600 hover:text-blue-600">💬 +92 319 0211218</a>
            <p className="text-slate-500">📍 Hyderabad, Pakistan</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">Quick Support</h2>
          <p className="text-blue-100 mb-4">For fastest response, chat with us on WhatsApp. We typically reply within 1 hour.</p>
          <a href="https://wa.me/923190211218?text=Assalam-o-Alaikum%20Rahbars!%20I%20have%20a%20question." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50">💬 WhatsApp Us</a>
        </div>
      </div>
    </div>
  );
}
