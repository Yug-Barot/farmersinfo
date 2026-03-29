import { Leaf, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="bg-foreground text-background py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 font-display text-xl font-bold mb-4">
            <Leaf className="w-6 h-6 text-secondary" />
            AgriSmart
          </div>
          <p className="text-background/60 text-sm leading-relaxed">
            Empowering farmers with smart technology, expert guidance, and fair market access for sustainable agriculture.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-background/60">
            {["Home", "Services", "Crops", "Tips", "About"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="hover:text-secondary transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-background/60">
            {["Crop Management", "Weather Updates", "Market Prices", "Pest Control", "Government Schemes"].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-background/60">
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-secondary" /> info@agrismart.com</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-secondary" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-secondary" /> New Delhi, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10 pt-6 text-center text-sm text-background/40">
        © {new Date().getFullYear()} AgriSmart. All rights reserved. Built for farmers, by farmers.
      </div>
    </div>
  </footer>
);

export default Footer;
