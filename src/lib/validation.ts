import { z } from 'zod';

// Tool form validation schema
export const toolFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Tool name is required')
    .max(100, 'Tool name must be under 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.()]+$/, 'Tool name contains invalid characters'),
  category: z.enum([
    'pentesting', 'blue_team', 'osint', 'automation',
    'forensics', 'network', 'web_security', 'malware_analysis', 'other',
  ]),
  short_description: z
    .string()
    .trim()
    .min(1, 'Short description is required')
    .max(200, 'Short description must be under 200 characters'),
  full_description: z
    .string()
    .trim()
    .max(5000, 'Full description must be under 5000 characters')
    .optional()
    .or(z.literal('')),
  version: z
    .string()
    .trim()
    .max(20, 'Version must be under 20 characters')
    .regex(/^[a-zA-Z0-9.\-]*$/, 'Version contains invalid characters')
    .optional()
    .or(z.literal('')),
  supported_os: z.array(z.enum(['Windows', 'Linux', 'macOS'])),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 'Price must be a valid positive number')
    .refine((val) => parseFloat(val) <= 1000000, 'Price exceeds maximum'),
  payfast_link: z
    .string()
    .trim()
    .url('Must be a valid URL')
    .refine((val) => val.startsWith('https://'), 'Payment link must use HTTPS')
    .optional()
    .or(z.literal('')),
  status: z.enum(['available', 'out_of_stock', 'coming_soon']),
  features: z.array(
    z.string().max(200, 'Feature must be under 200 characters')
  ),
});

export type ToolFormData = z.infer<typeof toolFormSchema>;

// Image upload validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF images are allowed' };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Image must be under 5MB' };
  }
  // Check for double extensions (e.g., malware.php.jpg)
  const parts = file.name.split('.');
  if (parts.length > 2) {
    return { valid: false, error: 'Invalid file name' };
  }
  return { valid: true };
}

export function sanitizeFileName(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || 'png';
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const safeExt = allowedExts.includes(ext) ? ext : 'png';
  // Use crypto-random name to prevent path traversal
  const randomName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  return `${randomName}.${safeExt}`;
}

// Search input sanitization
export function sanitizeSearchQuery(query: string): string {
  // Remove special characters that could be used for injection
  return query
    .replace(/[%_\\]/g, '') // Remove SQL wildcard chars
    .replace(/[<>'";&|]/g, '') // Remove HTML/script injection chars
    .trim()
    .substring(0, 100); // Limit length
}

// Rate limiter for login attempts
export class RateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(key: string): { limited: boolean; retryAfterMs?: number } {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, firstAttempt: now });
      return { limited: false };
    }

    // Reset if window has passed
    if (now - record.firstAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, firstAttempt: now });
      return { limited: false };
    }

    if (record.count >= this.maxAttempts) {
      const retryAfterMs = this.windowMs - (now - record.firstAttempt);
      return { limited: true, retryAfterMs };
    }

    record.count++;
    return { limited: false };
  }

  reset(key: string) {
    this.attempts.delete(key);
  }
}

// Singleton rate limiter for login
export const loginRateLimiter = new RateLimiter(5, 15 * 60 * 1000);
