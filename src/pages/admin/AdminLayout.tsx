import { useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Package, Plus, LogOut, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useIsAdmin } from '@/hooks/useAuth';

export default function AdminLayout() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin(user?.id);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoading = authLoading || adminLoading;

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Tools', icon: Package, exact: true },
    { href: '/admin/add', label: 'Add Tool', icon: Plus, exact: false },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 p-6 hidden md:flex flex-col">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-mono font-bold text-foreground">
            Admin<span className="text-primary">Panel</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="space-y-2">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              Back to Site
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-mono font-bold text-sm">Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button variant="ghost" size="icon">
                  <item.icon className="h-4 w-4" />
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 overflow-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
