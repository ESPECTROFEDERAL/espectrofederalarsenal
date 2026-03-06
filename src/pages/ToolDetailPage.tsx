import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/SEOHead';
import { 
  ArrowLeft, 
  ExternalLink, 
  Monitor, 
  CheckCircle2, 
  Loader2,
  ShoppingCart
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTool } from '@/hooks/useTools';
import { categoryLabels, categoryColors } from '@/types/tool';

export default function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tool, isLoading, error } = useTool(id || '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };

  const handleBuyNow = () => {
    if (tool?.payfast_link) {
      window.open(tool.payfast_link, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-4">Tool Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The tool you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/tools">
              <Button variant="cyber">Browse All Tools</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={tool.name}
        description={tool.short_description}
        canonical={`https://espectrofederal.lovable.app/tools/${tool.id}`}
        type="product"
        image={tool.image_url || undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": tool.name,
          "description": tool.full_description || tool.short_description,
          "image": tool.image_url || "",
          "offers": {
            "@type": "Offer",
            "price": tool.price,
            "priceCurrency": "ZAR",
            "availability": tool.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        }}
      />
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="aspect-video rounded-lg overflow-hidden border border-border bg-card">
                {tool.image_url ? (
                  <img
                    src={tool.image_url}
                    alt={tool.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                    <span className="font-mono text-8xl text-primary/30">{tool.name.charAt(0)}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Category Badge */}
              <Badge 
                variant="outline" 
                className={`${categoryColors[tool.category]} border`}
              >
                {categoryLabels[tool.category]}
              </Badge>

              {/* Name & Version */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {tool.name}
                </h1>
                {tool.version && (
                  <span className="text-sm text-muted-foreground font-mono">
                    Version {tool.version}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {tool.full_description || tool.short_description}
              </p>

              {/* OS Support */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Supported Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {tool.supported_os.map((os, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-2 px-3 py-1.5 rounded bg-secondary/50 text-sm text-foreground"
                    >
                      <Monitor className="h-4 w-4 text-primary" />
                      {os}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              {tool.features && tool.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price & Buy */}
              <div className="pt-6 border-t border-border">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-sm text-muted-foreground">Price</span>
                    <div className="text-4xl font-bold text-primary">
                      {formatPrice(tool.price)}
                    </div>
                  </div>
                </div>

                <Button
                  variant="cyberGreen"
                  size="xl"
                  className="w-full"
                  onClick={handleBuyNow}
                  disabled={!tool.payfast_link}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Buy Now
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Button>

                {!tool.payfast_link && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Payment link not configured
                  </p>
                )}

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Secure payment via PayFast. Instant delivery after payment.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
