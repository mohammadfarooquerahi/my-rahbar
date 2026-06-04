import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AIChatWidget from "./components/common/AIChatWidget";

// Lazy load every page so one broken page can't crash others
const HomePage = lazy(() => import("./pages/HomePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const UniversityDetailPage = lazy(() => import("./pages/UniversityDetailPage"));
const FindUniversity = lazy(() => import("./pages/FindUniversityPage"));
const MeritCalculator = lazy(() => import("./pages/MeritCalculatorPage"));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const DocumentTools = lazy(() => import("./pages/DocumentToolsPage"));
const CounselingPage = lazy(() => import("./pages/CounselingPage"));
const CareerMatchPage = lazy(() => import("./pages/CareerMatchPage"));
const WatchlistPage = lazy(() => import("./pages/WatchlistPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const PastPapersPage = lazy(() => import("./pages/PastPapersPage"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const hideFooter = location.pathname === "/career-match";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route
              path="/university/:slug"
              element={<UniversityDetailPage />}
            />
            <Route path="/find-university" element={<FindUniversity />} />
            <Route path="/merit-calculator" element={<MeritCalculator />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/document-tools" element={<DocumentTools />} />
            <Route path="/counseling" element={<CounselingPage />} />
            <Route path="/career-match" element={<CareerMatchPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/past-papers" element={<PastPapersPage />} />
          </Routes>
        </Suspense>
      </main>
      {!hideFooter && <Footer />}
      <AIChatWidget />
    </div>
  );
}

