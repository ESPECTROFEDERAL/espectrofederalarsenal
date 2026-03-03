import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolCard } from '@/components/ToolCard';
import { useTools } from '@/hooks/useTools';

export function FeaturedTools() {
  const { data: tools, isLoading } = useTools();
  const featuredTools = tools?.slice(0, 6) || [];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured <span className="text-primary">Tools</span>
            </h2>
            <p className="text-muted-foreground">
              Hand-picked tools trusted by security professionals
            </p>
          </div>
          <Link to="/tools">
            <Button variant="cyberOutline" className="group">
              View All Tools
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : featuredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-dashed border-border rounded-lg"
          >
            <p className="text-muted-foreground mb-4">
              No tools available yet. Check back soon!
            </p>
            <p className="text-sm text-muted-foreground">
              Admin can add tools via the admin dashboard.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
