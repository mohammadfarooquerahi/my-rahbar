import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us | MyRahbar</title>
        <meta name="description" content="Get in touch with the MyRahbar team for any queries regarding university admissions or career counseling." />
      </Helmet>

      <div className="bg-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4" style={{ fontFamily: "Sora" }}>
            Get in Touch
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Have questions about university admissions, our AI tools, or need technical support? We're here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-8" style={{ fontFamily: "Sora" }}>Contact Information</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Email Us</h3>
                  <p className="text-slate-600 mb-2">Our friendly team is here to help.</p>
                  <a href="mailto:support@myrahbar.com" className="text-blue-600 font-medium hover:underline">
                    support@myrahbar.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Call Us</h3>
                  <p className="text-slate-600 mb-2">Mon-Fri from 9am to 5pm.</p>
                  <a href="tel:+923001234567" className="text-blue-600 font-medium hover:underline">
                    +92 300 1234567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Office</h3>
                  <p className="text-slate-600 mb-2">Come say hello at our office HQ.</p>
                  <p className="text-slate-800 font-medium">
                    123 Innovation Drive<br />
                    Tech Park, Islamabad<br />
                    Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50">
            <h2 className="text-2xl font-bold text-slate-800 mb-6" style={{ fontFamily: "Sora" }}>Send us a message</h2>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Thanks for your message! We will get back to you soon."); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                  <input type="text" required placeholder="John" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                  <input type="text" required placeholder="Doe" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input type="email" required placeholder="john@example.com" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                <textarea required rows={4} placeholder="How can we help you?" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}