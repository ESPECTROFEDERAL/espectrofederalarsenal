import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, Package } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToolCard } from '@/components/ToolCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SearchBar } from '@/components/SearchBar';
import { SEOHead } from '@/components/SEOHead';
import { useTools } from '@/hooks/useTools';
import type { ToolCategory } from '@/types/tool';

export default function ToolsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ToolCategory | null;
  
  const [category, setCategory] = useState<ToolCategory | null>(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: tools, isLoading } = useTools(category || undefined, searchQuery || undefined);

  const handleCategoryChange = (newCategory: ToolCategory | null) => {
    setCategory(newCategory);
    if (newCategory) {
      setSearchParams({ category: newCategory });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Cybersecurity Tools"
        description="Browse premium ethical hacking and cybersecurity tools. Pentesting, OSINT, forensics, network security and more."
        canonical="https://espectrofederal.lovable.app/tools"
      />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Cyber <span className="text-primary">Arsenal</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our collection of professional-grade cybersecurity tools. 
              Each tool is verified and tested by security experts.
            </p>
          </motion.div>

          {/* Filters */}
          <div className="space-y-6 mb-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <div className="text-sm text-muted-foreground">
                {tools?.length || 0} tools found
              </div>
            </div>
            <CategoryFilter 
              selectedCategory={category} 
              onCategoryChange={handleCategoryChange} 
            />
          </div>

          {/* Tools Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tools && tools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No tools found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Check back soon for new tools'}
              </p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
