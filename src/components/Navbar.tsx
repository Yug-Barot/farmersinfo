import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Weather", to: "/weather" },
  { label: "Market Prices", to: "/market-prices" },
  { label: "Crops", to: "/crops" },
  { label: "AI Assistant", to: "/ai-assistant" },
  { label: "Community", to: "/community" },
  { label: "Learning", to: "/learning" },
  { label: "Schemes", to: "/schemes" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-primary-dark">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground font-display text-xl font-bold">
          <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center">
            <Leaf className="w-5 h-5 text-secondary-foreground" />
          </div>
          <span className="text-secondary">Crop</span>Wise
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-secondary"
                  : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <span className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors cursor-pointer">
            Sign in
          </span>
          <Link
            to="/ai-assistant"
            className="bg-secondary text-secondary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>

        <button className="lg:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-primary-dark overflow-hidden"
          >
            <div className="flex flex-col gap-3 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`font-medium text-sm ${
                    location.pathname === link.to ? "text-secondary" : "text-primary-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/ai-assistant" className="btn-white text-sm mt-2 justify-center" onClick={() => setOpen(false)}>
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
