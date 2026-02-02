import { motion } from 'framer-motion';
import { 
  Target, 
  ShieldCheck, 
  Eye, 
  Cog, 
  Search, 
  Globe, 
  Shield, 
  Bug,
  Layers
} from 'lucide-react';
import type { ToolCategory } from '@/types/tool';
import { categoryLabels } from '@/types/tool';

interface CategoryFilterProps {
  selectedCategory: ToolCategory | null;
  onCategoryChange: (category: ToolCategory | null) => void;
}

const categoryIcons: Record<ToolCategory, React.ComponentType<{ className?: string }>> = {
  pentesting: Target,
  blue_team: ShieldCheck,
  osint: Eye,
  automation: Cog,
  forensics: Search,
  network: Globe,
  web_security: Shield,
  malware_analysis: Bug,
  other: Layers,
};

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories: (ToolCategory | null)[] = [
    null,
    'pentesting',
    'blue_team',
    'osint',
    'automation',
    'forensics',
    'network',
    'web_security',
    'malware_analysis',
  ];

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          const Icon = category ? categoryIcons[category] : Layers;
          
          return (
            <motion.button
              key={category || 'all'}
              onClick={() => onCategoryChange(category)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                transition-all duration-200 border
                ${isSelected
                  ? 'bg-primary/20 border-primary text-primary shadow-neon'
                  : 'bg-secondary/30 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {category ? categoryLabels[category] : 'All'}
              
              {isSelected && (
                <motion.div
                  layoutId="categoryIndicator"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
