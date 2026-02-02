import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Monitor, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Tool } from '@/types/tool';
import { categoryLabels, categoryColors } from '@/types/tool';

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const getOsIcon = (os: string) => {
    if (os.toLowerCase().includes('windows')) return <Monitor className="h-3 w-3" />;
    if (os.toLowerCase().includes('mac')) return <Apple className="h-3 w-3" />;
    return <Monitor className="h-3 w-3" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-lg border border-border bg-card card-hover">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-secondary/30">
          {tool.image_url ? (
            <img
              src={tool.image_url}
              alt={tool.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <span className="font-mono text-4xl text-primary/50">{tool.name.charAt(0)}</span>
            </div>
          )}
          
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge 
              variant="outline" 
              className={`${categoryColors[tool.category]} border backdrop-blur-sm`}
            >
              {categoryLabels[tool.category]}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {tool.short_description}
          </p>

          {/* OS Support */}
          <div className="flex items-center gap-2 mb-4">
            {tool.supported_os.slice(0, 3).map((os, i) => (
              <span
                key={i}
                className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded"
              >
                {getOsIcon(os)}
                {os}
              </span>
            ))}
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(tool.price)}
              </span>
              {tool.version && (
                <span className="text-xs text-muted-foreground ml-2">v{tool.version}</span>
              )}
            </div>
            
            <Link to={`/tools/${tool.id}`}>
              <Button variant="cyber" size="sm" className="group/btn">
                View
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
