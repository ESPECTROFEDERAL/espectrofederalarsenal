import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tool, ToolCategory, ToolStatus } from '@/types/tool';

export function useTools(category?: ToolCategory, searchQuery?: string) {
  return useQuery({
    queryKey: ['tools', category, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('tools')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Tool[];
    },
  });
}

export function useTool(id: string) {
  return useQuery({
    queryKey: ['tool', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Tool | null;
    },
    enabled: !!id,
  });
}

export function useAdminTools() {
  return useQuery({
    queryKey: ['admin-tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Tool[];
    },
  });
}

interface CreateToolData {
  name: string;
  category: ToolCategory;
  short_description: string;
  full_description?: string;
  version?: string;
  supported_os: string[];
  price: number;
  payfast_link?: string;
  image_url?: string;
  status: ToolStatus;
  features?: string[];
}

export function useCreateTool() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tool: CreateToolData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('tools')
        .insert({
          ...tool,
          created_by: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Tool;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['admin-tools'] });
    },
  });
}

export function useUpdateTool() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Tool> & { id: string }) => {
      const { data, error } = await supabase
        .from('tools')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Tool;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['admin-tools'] });
      queryClient.invalidateQueries({ queryKey: ['tool', data.id] });
    },
  });
}

export function useDeleteTool() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
      queryClient.invalidateQueries({ queryKey: ['admin-tools'] });
    },
  });
}
