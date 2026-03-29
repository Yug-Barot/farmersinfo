import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => (
  <section className="gradient-cta py-20">
    <div className="container mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 font-display">
          Ready to Transform Your Farming?
        </h2>
        <p className="text-primary-foreground/75 max-w-xl mx-auto mb-8 text-lg">
          Join thousands of farmers already using AgriSmart to increase their yields and profits
        </p>
        <a href="#contact" className="btn-white text-lg">
          Start Your Free Account <ArrowRight className="w-5 h-5" />
        </a>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
