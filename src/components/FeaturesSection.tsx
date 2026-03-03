import { motion } from 'framer-motion';
import { Zap, Shield, Clock, CreditCard, Headphones, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Verified & Secure',
    description: 'All tools are vetted by security professionals before listing.',
  },
  {
    icon: Zap,
    title: 'Instant Access',
    description: 'Get immediate download access after purchase completion.',
  },
  {
    icon: Clock,
    title: 'Lifetime Updates',
    description: 'Receive free updates and improvements for purchased tools.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'PayFast-secured transactions with multiple payment options.',
  },
  {
    icon: Headphones,
    title: 'Expert Support',
    description: '24/7 technical support from cybersecurity professionals.',
  },
  {
    icon: RefreshCw,
    title: 'Money-Back Guarantee',
    description: '30-day refund policy if tools don\'t meet your needs.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">ESPECTRO FEDERAL</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide the most trusted marketplace for cybersecurity professionals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
              className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
