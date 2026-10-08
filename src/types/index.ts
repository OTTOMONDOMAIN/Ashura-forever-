export interface WebsiteSettings {
  siteTitle: string;
  studioTagline: string;
  heroEyebrow: string;
  heroDescription: string;
  accentColor: string;
  secondaryAccent: string;
  backgroundEffect: string;
  statusText: string;
  contactEmail: string;
  discordInviteUrl: string;
  twitterUrl: string;
  githubUrl: string;
  youtubeUrl: string;
  ctaHeading: string;
  ctaSubheading: string;
  isHireable: boolean;
}

export interface AboutSectionData {
  sectionNumber: string;
  title: string;
  leadText: string;
  paragraph1: string;
  paragraph2: string;
  philosophy: string;
  stats: Array<{ label: string; value: string }>;
  studioImage: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  icon: string;
  features: string[];
  featured: boolean;
  order: number;
}

export interface ProjectItem {
  id: string;
  number: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  longDescription: string;
  tags: string[];
  image: string;
  gallery: string[];
  projectUrl: string;
  technologies: string[];
  features: string[];
  status: string;
  featured: boolean;
  order: number;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
  order: number;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  category: string;
  size?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  discord: string;
  projectType: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface PublicWebsiteData {
  settings: WebsiteSettings;
  about: AboutSectionData;
  services: ServiceItem[];
  projects: ProjectItem[];
  navigation: NavItem[];
}

export interface AdminFullData {
  adminUser: {
    id: string;
    username: string;
    updatedAt: string;
  };
  settings: WebsiteSettings;
  about: AboutSectionData;
  services: ServiceItem[];
  projects: ProjectItem[];
  navigation: NavItem[];
  media: MediaAsset[];
  messages: ContactMessage[];
  stats: {
    totalProjects: number;
    totalServices: number;
    totalMessages: number;
    unreadMessages: number;
  };
}
