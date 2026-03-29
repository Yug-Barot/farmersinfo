import { motion } from "framer-motion";
import { Target, Heart, Globe } from "lucide-react";

const values = [
  { icon: Target, title: "Our Mission", text: "To empower every farmer with technology, knowledge, and market access so they can achieve sustainable growth and prosperity." },
  { icon: Heart, title: "Our Values", text: "We believe in community-driven agriculture, fair pricing, organic practices, and putting farmers at the center of everything." },
  { icon: Globe, title: "Our Vision", text: "A world where every farmer, regardless of land size, has access to smart tools and fair markets to feed the planet sustainably." },
];

const AboutSection = () => (
  <section id="about" className="py-20 bg-primary text-primary-foreground">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-secondary font-medium text-sm uppercase tracking-wider">About AgriSmart</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
          Growing Together with Farmers
        </h2>
        <p className="opacity-80 max-w-2xl mx-auto">
          AgriSmart is a comprehensive agriculture platform dedicated to modernizing farming through
          technology, education, and community support.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center p-8 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20"
          >
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-5">
              <v.icon className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold mb-3">{v.title}</h3>
            <p className="opacity-80 text-sm leading-relaxed">{v.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
