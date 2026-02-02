export type ToolCategory = 
  | 'pentesting'
  | 'blue_team'
  | 'osint'
  | 'automation'
  | 'forensics'
  | 'network'
  | 'web_security'
  | 'malware_analysis'
  | 'other';

export type ToolStatus = 'available' | 'out_of_stock' | 'coming_soon';

export interface Tool {
  id: string;
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
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const categoryLabels: Record<ToolCategory, string> = {
  pentesting: 'Pentesting',
  blue_team: 'Blue Team',
  osint: 'OSINT',
  automation: 'Automation',
  forensics: 'Forensics',
  network: 'Network',
  web_security: 'Web Security',
  malware_analysis: 'Malware Analysis',
  other: 'Other',
};

export const categoryColors: Record<ToolCategory, string> = {
  pentesting: 'bg-red-500/20 text-red-400 border-red-500/30',
  blue_team: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  osint: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  automation: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  forensics: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  network: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  web_security: 'bg-green-500/20 text-green-400 border-green-500/30',
  malware_analysis: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};
