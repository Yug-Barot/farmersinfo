import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Weather", href: "#weather" },
  { label: "Market Prices", href: "#market" },
  { label: "Crops", href: "#crops" },
  { label: "AI Assistant", href: "#ai" },
  { label: "Community", href: "#community" },
  { label: "Learning", href: "#learning" },
  { label: "Schemes", href: "#schemes" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-primary-dark">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <a href="#home" className="flex items-center gap-2 text-primary-foreground font-display text-xl font-bold">
          <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center">
            <Leaf className="w-5 h-5 text-secondary-foreground" />
          </div>
          <span className="text-secondary">Agri</span>Smart
        </a>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a href="#contact" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            Sign in
          </a>
          <a
            href="#contact"
            className="bg-secondary text-secondary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </a>
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
                <a
                  key={link.label}
                  href={link.href}
                  className="text-primary-foreground font-medium text-sm"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a href="#contact" className="btn-white text-sm mt-2 justify-center">
                Get Started <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
