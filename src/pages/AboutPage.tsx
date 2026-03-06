import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';
import { Shield, Target, Eye, Terminal, Wifi, Lock, Bug, Globe } from 'lucide-react';

const expertise = [
  { icon: Target, label: 'Penetration Testing' },
  { icon: Eye, label: 'OSINT & Reconnaissance' },
  { icon: Wifi, label: 'Network Security' },
  { icon: Bug, label: 'Vulnerability Research' },
  { icon: Lock, label: 'Cryptography' },
  { icon: Globe, label: 'Web Application Security' },
  { icon: Terminal, label: 'Exploit Development' },
  { icon: Shield, label: 'Blue Team Defense' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="About"
        description="Learn about ESPECTRO FEDERAL — professional ethical hacker specializing in penetration testing, OSINT, network security, and exploit development."
        canonical="https://espectrofederal.lovable.app/about"
      />
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-mono text-primary">About</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">ESPECTRO FEDERAL</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto font-mono">
              Ethical Hacker · Security Researcher · Digital Ghost
            </p>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-20"
          >
            <div className="p-8 rounded-xl border border-border bg-card/50 backdrop-blur-sm space-y-5">
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-primary font-semibold">ESPECTRO FEDERAL</span> is a seasoned ethical hacker and cybersecurity professional with deep expertise spanning every domain of offensive and defensive security. From penetration testing corporate infrastructures to uncovering zero-day vulnerabilities, ESPECTRO operates at the cutting edge of the cyber landscape.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With years of hands-on experience in red team operations, OSINT investigations, network exploitation, web application security, reverse engineering, and malware analysis, ESPECTRO FEDERAL has built a reputation as a relentless problem-solver who thinks like an attacker to build stronger defenses.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Driven by the belief that knowledge should empower — not exploit — ESPECTRO FEDERAL creates and curates elite cybersecurity tools designed for professionals who demand precision, reliability, and results. Every tool in this arsenal has been battle-tested in real-world scenarios.
              </p>
              <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary pl-4">
                "In the digital shadows, knowledge is the ultimate weapon. I build tools so others can see clearly in the dark."
              </p>
            </div>
          </motion.div>

          {/* Expertise Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Areas of <span className="text-primary">Expertise</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {expertise.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="group p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all text-center"
                >
                  <item.icon className="h-6 w-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
