import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Youtube, Send } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold mb-4">
              <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center">
                <Leaf className="w-5 h-5 text-secondary-foreground" />
              </div>
              <span className="text-secondary">Crop</span>Wise
            </Link>
            <p className="text-background/50 text-sm leading-relaxed mb-4">
              Empowering Indian farmers with AI-powered insights, live weather data, and market intelligence for smarter farming decisions.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors">
                  <Icon className="w-4 h-4 text-background/60" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-secondary mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-background/50">
              {[
                { label: "Live Weather", to: "/weather" },
                { label: "Market Prices", to: "/market-prices" },
                { label: "Crop Database", to: "/crops" },
                { label: "AI Farm Assistant", to: "/ai-assistant" },
                { label: "Community Hub", to: "/community" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-secondary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-secondary mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm text-background/50">
              {[
                { label: "Government Schemes", to: "/schemes" },
                { label: "Learning Hub", to: "/learning" },
                { label: "Crop Finder", to: "/crops" },
                { label: "AI Assistant", to: "/ai-assistant" },
                { label: "Community", to: "/community" },
              ].map((s) => (
                <li key={s.label}>
                  <Link to={s.to} className="hover:text-secondary transition-colors">{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-secondary mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-background/50 mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                Ganpat University
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-secondary" /> 9558053175
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" /> dhruvatishpandya@gmail.com
              </li>
            </ul>

            <h4 className="font-display font-semibold text-secondary mb-3">Newsletter</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 bg-background/10 border border-background/20 rounded-lg px-3 py-2 text-sm text-background placeholder:text-background/40 focus:outline-none focus:border-secondary transition-colors"
              />
              <button
                type="submit"
                className="bg-secondary text-secondary-foreground px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-secondary text-xs mt-2">✓ Subscribed successfully!</p>
            )}
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/30">
            © {new Date().getFullYear()} Crop Wise. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-background/30">
            <a href="#" className="hover:text-background/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background/60 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-background/60 transition-colors">About</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
