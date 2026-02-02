-- Create enum for tool categories
CREATE TYPE public.tool_category AS ENUM (
  'pentesting',
  'blue_team',
  'osint',
  'automation',
  'forensics',
  'network',
  'web_security',
  'malware_analysis',
  'other'
);

-- Create enum for tool status
CREATE TYPE public.tool_status AS ENUM (
  'available',
  'out_of_stock',
  'coming_soon'
);

-- Create enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'superadmin');

-- Create user_roles table for admin role management (separate from profile)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create tools table
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category tool_category NOT NULL DEFAULT 'other',
  short_description TEXT NOT NULL,
  full_description TEXT,
  version TEXT,
  supported_os TEXT[] DEFAULT ARRAY['Windows', 'Linux', 'macOS'],
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  payfast_link TEXT,
  image_url TEXT,
  status tool_status NOT NULL DEFAULT 'available',
  features TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'superadmin')
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Superadmins can manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'));

-- RLS policies for tools - public can view available tools
CREATE POLICY "Anyone can view available tools"
  ON public.tools
  FOR SELECT
  TO anon, authenticated
  USING (status = 'available');

CREATE POLICY "Admins can view all tools"
  ON public.tools
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can create tools"
  ON public.tools
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update tools"
  ON public.tools
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete tools"
  ON public.tools
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Create storage bucket for tool images
INSERT INTO storage.buckets (id, name, public)
VALUES ('tool-images', 'tool-images', true);

-- Storage policies for tool images
CREATE POLICY "Anyone can view tool images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'tool-images');

CREATE POLICY "Admins can upload tool images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'tool-images' AND public.is_admin());

CREATE POLICY "Admins can update tool images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'tool-images' AND public.is_admin());

CREATE POLICY "Admins can delete tool images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'tool-images' AND public.is_admin());

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON public.tools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();