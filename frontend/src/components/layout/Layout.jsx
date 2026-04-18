import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from '../ui/sonner';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default Layout;
