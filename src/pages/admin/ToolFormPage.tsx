import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateTool, useUpdateTool, useTool } from '@/hooks/useTools';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ToolCategory, ToolStatus } from '@/types/tool';
import { categoryLabels } from '@/types/tool';
import { toolFormSchema, validateImageFile, sanitizeFileName } from '@/lib/validation';

const categories: ToolCategory[] = [
  'pentesting',
  'blue_team',
  'osint',
  'automation',
  'forensics',
  'network',
  'web_security',
  'malware_analysis',
  'other',
];

const statuses: ToolStatus[] = ['available', 'out_of_stock', 'coming_soon'];

const osList = ['Windows', 'Linux', 'macOS'];

export default function ToolFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: existingTool, isLoading: loadingTool } = useTool(id || '');
  const createTool = useCreateTool();
  const updateTool = useUpdateTool();

  const [formData, setFormData] = useState({
    name: '',
    category: 'other' as ToolCategory,
    short_description: '',
    full_description: '',
    version: '',
    supported_os: ['Windows', 'Linux', 'macOS'],
    price: '',
    payfast_link: '',
    status: 'available' as ToolStatus,
    features: [''],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (existingTool) {
      setFormData({
        name: existingTool.name,
        category: existingTool.category,
        short_description: existingTool.short_description,
        full_description: existingTool.full_description || '',
        version: existingTool.version || '',
        supported_os: existingTool.supported_os || [],
        price: existingTool.price.toString(),
        payfast_link: existingTool.payfast_link || '',
        status: existingTool.status,
        features: existingTool.features?.length ? existingTool.features : [''],
      });
      if (existingTool.image_url) {
        setImagePreview(existingTool.image_url);
      }
    }
  }, [existingTool]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({ title: 'Invalid image', description: validation.error, variant: 'destructive' });
        e.target.value = '';
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return existingTool?.image_url || null;

    const fileName = sanitizeFileName(imageFile.name);

    const { error: uploadError } = await supabase.storage
      .from('tool-images')
      .upload(fileName, imageFile, {
        contentType: imageFile.type,
        cacheControl: '3600',
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('tool-images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Validate form data with Zod
      const validation = toolFormSchema.safeParse(formData);
      if (!validation.success) {
        const firstError = validation.error.errors[0];
        toast({
          title: 'Validation Error',
          description: firstError.message,
          variant: 'destructive',
        });
        setUploading(false);
        return;
      }
      const imageUrl = await uploadImage();
      const filteredFeatures = formData.features.filter((f) => f.trim());

      const toolData = {
        name: formData.name.trim(),
        category: formData.category,
        short_description: formData.short_description.trim(),
        full_description: formData.full_description.trim() || undefined,
        version: formData.version.trim() || undefined,
        supported_os: formData.supported_os,
        price: parseFloat(formData.price),
        payfast_link: formData.payfast_link.trim() || undefined,
        status: formData.status,
        features: filteredFeatures.length > 0 ? filteredFeatures : undefined,
        image_url: imageUrl || undefined,
      };

      if (isEditing) {
        await updateTool.mutateAsync({ id, ...toolData });
        toast({
          title: 'Tool updated',
          description: 'Your changes have been saved.',
        });
      } else {
        await createTool.mutateAsync(toolData);
        toast({
          title: 'Tool created',
          description: 'The tool has been added to the marketplace.',
        });
      }

      navigate('/admin');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleOS = (os: string) => {
    setFormData((prev) => ({
      ...prev,
      supported_os: prev.supported_os.includes(os)
        ? prev.supported_os.filter((o) => o !== os)
        : [...prev.supported_os, os],
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  if (isEditing && loadingTool) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tools
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-8">
        {isEditing ? 'Edit Tool' : 'Add New Tool'}
      </h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Tool Image</Label>
          <div className="flex items-start gap-4">
            <div className="relative h-32 w-32 rounded-lg border border-dashed border-border bg-secondary/30 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="absolute top-1 right-1 p-1 rounded bg-destructive text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-auto"
              />
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Tool Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., NinjaScan Pro"
            required
            className="bg-secondary/30"
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(v) => setFormData({ ...formData, category: v as ToolCategory })}
            >
              <SelectTrigger className="bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v as ToolStatus })}
            >
              <SelectTrigger className="bg-secondary/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <Label htmlFor="short_description">Short Description *</Label>
          <Input
            id="short_description"
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            placeholder="Brief description for tool cards"
            required
            maxLength={150}
            className="bg-secondary/30"
          />
        </div>

        {/* Full Description */}
        <div className="space-y-2">
          <Label htmlFor="full_description">Full Description</Label>
          <Textarea
            id="full_description"
            value={formData.full_description}
            onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
            placeholder="Detailed description for tool detail page"
            rows={4}
            className="bg-secondary/30"
          />
        </div>

        {/* Version & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              placeholder="e.g., 2.1.0"
              className="bg-secondary/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (ZAR) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              required
              className="bg-secondary/30"
            />
          </div>
        </div>

        {/* PayFast Link */}
        <div className="space-y-2">
          <Label htmlFor="payfast_link">PayFast Payment Link *</Label>
          <Input
            id="payfast_link"
            type="url"
            value={formData.payfast_link}
            onChange={(e) => setFormData({ ...formData, payfast_link: e.target.value })}
            placeholder="https://www.payfast.co.za/..."
            className="bg-secondary/30"
          />
          <p className="text-xs text-muted-foreground">
            Users will be redirected here when they click "Buy Now"
          </p>
        </div>

        {/* Supported OS */}
        <div className="space-y-2">
          <Label>Supported Operating Systems</Label>
          <div className="flex flex-wrap gap-2">
            {osList.map((os) => (
              <button
                key={os}
                type="button"
                onClick={() => toggleOS(os)}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  formData.supported_os.includes(os)
                    ? 'bg-primary/20 border-primary text-primary'
                    : 'bg-secondary/30 border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {os}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <Label>Key Features</Label>
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Feature description"
                  className="bg-secondary/30"
                />
                {formData.features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
              <Plus className="h-4 w-4 mr-1" />
              Add Feature
            </Button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
          <Button type="submit" variant="cyber" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isEditing ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Save Changes' : 'Create Tool'
            )}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}
