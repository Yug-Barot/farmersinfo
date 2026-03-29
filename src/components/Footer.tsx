import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Youtube } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="bg-foreground text-background py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 font-display text-xl font-bold mb-4">
            <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center">
              <Leaf className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="text-secondary">Agri</span>Smart
          </div>
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
            {["Live Weather", "Market Prices", "Crop Database", "AI Farm Assistant", "Community Hub"].map((l) => (
              <li key={l}>
                <a href="#" className="hover:text-secondary transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-secondary mb-4">Resources</h4>
          <ul className="space-y-2.5 text-sm text-background/50">
            {["Government Schemes", "Learning Hub", "Crop Finder", "Soil Analysis", "Profit Calculator"].map((s) => (
              <li key={s}>
                <a href="#" className="hover:text-secondary transition-colors">{s}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-secondary mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-background/50">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
              AgriSmart HQ, Krishi Bhawan, New Delhi - 110001, India
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-secondary" /> 1800-180-1551
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-secondary" /> support@agrismart.in
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-background/30">
          © {new Date().getFullYear()} AgriSmart. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-background/30">
          <a href="#" className="hover:text-background/60 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-background/60 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-background/60 transition-colors">Support</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
