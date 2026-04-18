import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { Layout } from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import DevicesPage from "./pages/DevicesPage";
import BookingPage from "./pages/BookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import AdminPage from "./pages/AdminPage";
import DynamicSEOPage from "./pages/DynamicSEOPage";
import AccessoriesPage from "./pages/AccessoriesPage";
import MailInPage from "./pages/MailInPage";
import NotFoundPage from "./pages/NotFoundPage";

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const PL = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/" element={<PL><HomePage /></PL>} />
          <Route path="/services" element={<PL><ServicesPage /></PL>} />
          <Route path="/services/:slug" element={<PL><ServicesPage /></PL>} />
          <Route path="/devices" element={<PL><DevicesPage /></PL>} />
          <Route path="/devices/:brand" element={<PL><DevicesPage /></PL>} />
          <Route path="/book" element={<PL><BookingPage /></PL>} />
          <Route path="/mail-in" element={<PL><MailInPage /></PL>} />
          <Route path="/booking/success" element={<PL><BookingSuccessPage /></PL>} />
          <Route path="/contact" element={<PL><ContactPage /></PL>} />
          <Route path="/about" element={<PL><AboutPage /></PL>} />
          <Route path="/blog" element={<PL><BlogPage /></PL>} />
          <Route path="/blog/:slug" element={<PL><BlogPage /></PL>} />
          <Route path="/accessories" element={<PL><AccessoriesPage /></PL>} />
          <Route path="/:slug" element={<PL><DynamicSEOPage /></PL>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
