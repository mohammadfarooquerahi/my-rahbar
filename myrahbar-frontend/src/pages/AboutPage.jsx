import { Helmet } from "react-helmet-async";
import { BookOpen, Target, Users, Sparkles, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | Rahbars</title>
        <meta name="description" content="Learn about Rahbars's mission to guide students towards their perfect university and career." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-slate-900 py-24 text-center px-4 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-teal-500 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "Sora" }}>
            Empowering Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Educational Journey</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 leading-relaxed font-light">
            Rahbars is Pakistan's premier platform for university admissions, career guidance, and student resources. We leverage technology to simplify your academic future.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6" style={{ fontFamily: "Sora" }}>Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">
              Every student deserves access to accurate, up-to-date, and personalized information regarding their higher education options. Our mission is to bridge the gap between aspiring students and educational institutions by providing a centralized, intelligent, and user-friendly platform.
            </p>
            <p className="text-slate-600 leading-relaxed text-lg">
              We strive to eliminate the confusion and stress associated with university admissions in Pakistan, making the process seamless, transparent, and accessible to everyone.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-xl" />
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <BookOpen size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Centralized Data</h3>
                <p className="text-sm text-slate-500">All universities, courses, and fee structures in one place.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">AI Guidance</h3>
                <p className="text-sm text-slate-500">Smart tools to recommend the best career paths for you.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <Target size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Accurate Merit</h3>
                <p className="text-sm text-slate-500">Calculators to predict your chances of admission accurately.</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                  <Users size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Expert Counseling</h3>
                <p className="text-sm text-slate-500">One-on-one sessions with industry and academic experts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-20 px-4 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <GraduationCap size={48} className="mx-auto mb-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-slate-800 mb-6" style={{ fontFamily: "Sora" }}>Ready to find your dream university?</h2>
          <p className="text-slate-600 mb-8 text-lg">Join thousands of students who have already found their path with Rahbars.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/search" className="bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              Explore Universities
            </Link>
            <Link to="/contact" className="bg-white text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}