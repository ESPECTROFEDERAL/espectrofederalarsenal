import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { data: isAdmin } = useIsAdmin();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/tools', label: 'Tools' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary transition-all group-hover:text-glow" />
              <div className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-mono font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              <span className="animate-pulse text-primary drop-shadow-[0_0_8px_hsl(0,85%,50%)]">ESPECTRO</span>
              <span className="animate-pulse text-accent drop-shadow-[0_0_8px_hsl(120,100%,40%)]"> FEDERAL</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors hover:text-accent flex items-center gap-1 ${
                  location.pathname.startsWith('/admin')
                    ? 'text-accent'
                    : 'text-muted-foreground'
                }`}
              >
                <Lock className="h-3 w-3" />
                Admin
              </Link>
            )}

            {user ? (
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            ) : (
              <Link to="/admin/login">
                <Button variant="cyberOutline" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-accent flex items-center gap-1"
                >
                  <Lock className="h-3 w-3" />
                  Admin
                </Link>
              )}

              {user ? (
                <Button variant="ghost" size="sm" onClick={signOut} className="w-fit">
                  Sign Out
                </Button>
              ) : (
                <Link to="/admin/login" onClick={() => setIsOpen(false)}>
                  <Button variant="cyberOutline" size="sm">
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
