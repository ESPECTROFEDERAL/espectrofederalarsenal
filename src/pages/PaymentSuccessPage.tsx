import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, Download, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-6">
              <CheckCircle2 className="h-10 w-10 text-accent" />
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              Payment Successful!
            </h1>

            <p className="text-muted-foreground mb-8">
              Thank you for your purchase. Your order has been confirmed and you 
              should receive an email with download instructions shortly.
            </p>

            {/* Instructions */}
            <div className="bg-card border border-border rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Next Steps
              </h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-mono text-primary">1.</span>
                  Check your email for the download link
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-primary">2.</span>
                  Download your tool using the secure link
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-primary">3.</span>
                  Follow the installation guide included
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono text-primary">4.</span>
                  Contact support if you need help
                </li>
              </ol>
            </div>

            {/* Contact Info */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
              <Mail className="h-4 w-4" />
              <span>Need help? Contact support@cyberninjatools.com</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/tools">
                <Button variant="cyber" className="group">
                  Browse More Tools
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
