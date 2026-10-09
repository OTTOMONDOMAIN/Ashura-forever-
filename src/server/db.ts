import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface AdminUser {
  id: string;
  username: string;
  salt: string;
  passwordHash: string;
  updatedAt: string;
}

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

export interface AboutSection {
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

export interface DatabaseSchema {
  adminUser: AdminUser;
  sessions: Record<string, { username: string; expiresAt: number }>;
  settings: WebsiteSettings;
  about: AboutSection;
  services: ServiceItem[];
  projects: ProjectItem[];
  navigation: NavItem[];
  media: MediaAsset[];
  messages: ContactMessage[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'asura_db.json');

// Password hashing utility using PBKDF2 with SHA-512
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  const hash = hashPassword(password, salt);
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch {
    return false;
  }
}

// Initial default seed state
function getDefaultDatabase(): DatabaseSchema {
  const defaultSalt = generateSalt();
  const defaultHash = hashPassword('Kinetics#8392!xR', defaultSalt);

  return {
    adminUser: {
      id: 'admin_1',
      username: 'AK-Admin-9482',
      salt: defaultSalt,
      passwordHash: defaultHash,
      updatedAt: new Date().toISOString(),
    },
    sessions: {},
    settings: {
      siteTitle: 'Asura Kinetics',
      studioTagline: 'We build digital worlds that move.',
      heroEyebrow: 'Digital Development Studio',
      heroDescription:
        'We design and develop powerful digital experiences, Discord communities, Minecraft servers, and custom systems built around your vision.',
      accentColor: '#7042f8',
      secondaryAccent: '#38bdf8',
      backgroundEffect: 'particles_and_grid',
      statusText: 'Available for Custom Builds',
      contactEmail: 'contact@asurakinetics.com',
      discordInviteUrl: 'https://discord.gg/asurakinetics',
      twitterUrl: 'https://x.com/asurakinetics',
      githubUrl: 'https://github.com/asurakinetics',
      youtubeUrl: '',
      ctaHeading: "LET'S BUILD SOMETHING.",
      ctaSubheading: "Have an idea? Let's turn it into something real.",
      isHireable: true,
    },
    about: {
      sectionNumber: '01',
      title: 'About Asura Kinetics',
      leadText:
        'ASURA KINETICS is an independent digital development studio focused on creating custom online experiences.',
      paragraph1:
        'From community platforms to Minecraft ecosystems, we combine design, development, and technology to build experiences that stand out.',
      paragraph2:
        'We engineer systems that move—rejecting uninspired cookie-cutter templates. Every world, bot architecture, and multiplayer runtime we ship is tuned for immense performance, flawless aesthetics, and sticky player retention.',
      philosophy:
        'Kinetic digital architecture: Living, responsive environments that turn first-time visitors into dedicated communities.',
      stats: [
        { label: 'Active Players Immersed', value: '45,000+' },
        { label: 'Community Members', value: '110,000+' },
        { label: 'Custom Systems Deployed', value: '80+' },
        { label: 'Uptime Reliability', value: '99.98%' },
      ],
      studioImage: '/src/assets/images/asura_studio_abstract_1791476515128.jpg',
    },
    services: [
      {
        id: 'srv-discord',
        number: '01',
        title: 'Discord Server Development',
        shortDescription:
          'Comprehensive community infrastructure with custom bots, permission hierarchies, and automated member retention.',
        icon: 'Bot',
        features: [
          'Custom Discord server setup',
          'Advanced channel/category structure',
          'Roles and permissions hierarchy',
          'Professional server design',
          'Custom Discord bots',
          'Moderation systems',
          'Ticket systems',
          'Automation',
          'Community systems',
        ],
        featured: true,
        order: 1,
      },
      {
        id: 'srv-minecraft',
        number: '02',
        title: 'Minecraft Server Development',
        shortDescription:
          'High-performance SMP and network architecture with custom gameplay loops, economy, and bespoke server identities.',
        icon: 'Box',
        features: [
          'Minecraft server setup',
          'SMP development',
          'Plugin configuration',
          'Custom gameplay systems',
          'Permissions',
          'Economy systems',
          'Server optimization',
          'Cross-platform support where applicable',
          'Custom GUIs and server experiences',
        ],
        featured: true,
        order: 2,
      },
      {
        id: 'srv-custom-systems',
        number: '03',
        title: 'Custom Systems & Web Portals',
        shortDescription:
          'Bespoke web applications, real-time Minecraft telemetry integrations, player leaderboards, and store interfaces.',
        icon: 'Cpu',
        features: [
          'High-converting studio web portals',
          'Live Minecraft server query & telemetry widgets',
          'Player store & Tebex custom styling',
          'Discord OAuth2 member verification',
          'Full-stack API development & databases',
        ],
        featured: false,
        order: 3,
      },
    ],
    projects: [
      {
        id: 'proj-arise-smp',
        number: '01',
        name: 'ARISE SMP',
        category: 'Minecraft SMP',
        tagline: 'Monumental Multiplayer Survival Experience',
        description:
          'Arise SMP is a custom Minecraft survival experience designed around a polished multiplayer ecosystem, immersive gameplay, community systems, and a professional server identity.',
        longDescription:
          'Arise SMP is built on a high-concurrency PaperMC foundation featuring custom monolith rune obelisks, player-driven trading outposts, and custom dungeons. With custom anti-grief algorithms and balance passes, players experience a persistent universe with zero tick stutter.',
        tags: ['Minecraft', 'SMP', 'Server Development', 'Community', 'Gameplay'],
        image: '/src/assets/images/arise_smp_hero_1791476499363.jpg',
        gallery: [
          '/src/assets/images/arise_smp_hero_1791476499363.jpg',
          '/src/assets/images/minecraft_dev_showcase_1791476532941.jpg',
        ],
        projectUrl: 'https://discord.gg/asurakinetics',
        technologies: [
          'PaperMC 1.21',
          'Java 21',
          'Custom Lore Modules',
          'PostgreSQL',
          'Redis Cache',
        ],
        features: [
          'Towering Ancient Rune Obelisks and World Events',
          'Custom player economy with dynamic marketplace',
          'Cross-server state synchronization',
          'Custom soundscape & atmosphere tuning',
          'Zero-lag combat and movement registry',
        ],
        status: 'Active Season',
        featured: true,
        order: 1,
      },
      {
        id: 'proj-kinetic-hub',
        number: '02',
        name: 'KINETIC COMMUNITY HUB',
        category: 'Discord Systems',
        tagline: 'Next-Gen Guild & Esports Infrastructure',
        description:
          'A modern Discord server architecture built for seamless high-volume traffic, support tickets, and role automation.',
        longDescription:
          'Designed for high-retention esports communities, this ecosystem integrates automated member onboarding, multi-tier staff support channels with SLA logging, and custom webhook dispatchers.',
        tags: ['Discord', 'Custom Bots', 'Automation', 'Community Systems'],
        image: '/src/assets/images/discord_systems_showcase_1791476555166.jpg',
        gallery: ['/src/assets/images/discord_systems_showcase_1791476555166.jpg'],
        projectUrl: 'https://discord.gg/asurakinetics',
        technologies: ['TypeScript', 'Discord.js v14', 'SQLite', 'Docker'],
        features: [
          'Interactive role selection menu',
          'Multi-department ticket routing system',
          'Anti-raid automated quarantine mode',
          'Custom statistics logging dashboard',
        ],
        status: 'Production',
        featured: true,
        order: 2,
      },
    ],
    navigation: [
      { id: 'nav-about', label: 'About', href: '#about', enabled: true, order: 1 },
      { id: 'nav-services', label: 'Services', href: '#services', enabled: true, order: 2 },
      { id: 'nav-projects', label: 'Projects', href: '#projects', enabled: true, order: 3 },
      { id: 'nav-contact', label: 'Contact', href: '#contact', enabled: true, order: 4 },
      { id: 'nav-admin', label: 'Admin', href: '/admin', enabled: true, order: 5 },
    ],
    media: [
      {
        id: 'med-1',
        name: 'Arise SMP Twilight Render',
        url: '/src/assets/images/arise_smp_hero_1791476499363.jpg',
        category: 'projects',
        size: '1.2 MB',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'med-2',
        name: 'Asura Studio Abstract Prism',
        url: '/src/assets/images/asura_studio_abstract_1791476515128.jpg',
        category: 'studio',
        size: '980 KB',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'med-3',
        name: 'Minecraft SMP World Architecture',
        url: '/src/assets/images/minecraft_dev_showcase_1791476532941.jpg',
        category: 'projects',
        size: '1.1 MB',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'med-4',
        name: 'Discord Systems Operations Center',
        url: '/src/assets/images/discord_systems_showcase_1791476555166.jpg',
        category: 'services',
        size: '1.3 MB',
        createdAt: new Date().toISOString(),
      },
    ],
    messages: [
      {
        id: 'msg-seed-1',
        name: 'Marcus Vance',
        email: 'marcus@echogaming.net',
        discord: 'marcus_vance#0001',
        projectType: 'Minecraft Server Development',
        message:
          'Looking for a custom MMORPG survival server setup with custom quests and economy integration for our 2,000 player community.',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        read: false,
      },
      {
        id: 'msg-seed-2',
        name: 'Aria Thorne',
        email: 'aria@solaris-guild.org',
        discord: 'aria_thorne',
        projectType: 'Discord Server Development',
        message:
          'We need an overhaul of our 15,000 member Discord server including custom ticketing and automated role assignment.',
        createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
        read: true,
      },
    ],
  };
}

class DatabaseManager {
  private db: DatabaseSchema;

  constructor() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch {
      // Read-only filesystem (e.g., Vercel / Serverless) — operate in-memory
    }

    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        this.db = JSON.parse(raw);
        // Ensure all required fields exist in case of schema additions
        const defaultData = getDefaultDatabase();
        this.db = { ...defaultData, ...this.db };
      } catch (err) {
        console.error('Failed to read db file, initializing default:', err);
        this.db = getDefaultDatabase();
        this.save();
      }
    } else {
      this.db = getDefaultDatabase();
      this.save();
    }
  }

  private save() {
    try {
      const tempPath = `${DB_PATH}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_PATH);
    } catch (err) {
      console.error('Failed to save database:', err);
    }
  }

  // Public data getter (safe for public endpoints, never exposes passwordHash/salt or private sessions)
  getPublicData() {
    return {
      settings: this.db.settings,
      about: this.db.about,
      services: [...this.db.services].sort((a, b) => a.order - b.order),
      projects: [...this.db.projects].sort((a, b) => a.order - b.order),
      navigation: [...this.db.navigation]
        .filter((n) => n.enabled)
        .sort((a, b) => a.order - b.order),
    };
  }

  // Full data getter for Admin CMS
  getFullData() {
    return {
      adminUser: {
        id: this.db.adminUser.id,
        username: this.db.adminUser.username,
        updatedAt: this.db.adminUser.updatedAt,
      },
      settings: this.db.settings,
      about: this.db.about,
      services: [...this.db.services].sort((a, b) => a.order - b.order),
      projects: [...this.db.projects].sort((a, b) => a.order - b.order),
      navigation: [...this.db.navigation].sort((a, b) => a.order - b.order),
      media: this.db.media,
      messages: this.db.messages,
      stats: {
        totalProjects: this.db.projects.length,
        totalServices: this.db.services.length,
        totalMessages: this.db.messages.length,
        unreadMessages: this.db.messages.filter((m) => !m.read).length,
      },
    };
  }

  // Auth methods
  verifyCredentials(username: string, password: string):boolean {
    if (username !== this.db.adminUser.username) {
      return false;
    }
    return verifyPassword(password, this.db.adminUser.salt, this.db.adminUser.passwordHash);
  }

  createSession(username: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.db.sessions[token] = { username, expiresAt };
    this.cleanExpiredSessions();
    this.save();
    return token;
  }

  validateSession(token: string | undefined): boolean {
    if (!token) return false;
    const session = this.db.sessions[token];
    if (!session) return false;
    if (session.expiresAt < Date.now()) {
      delete this.db.sessions[token];
      this.save();
      return false;
    }
    return true;
  }

  destroySession(token: string) {
    if (this.db.sessions[token]) {
      delete this.db.sessions[token];
      this.save();
    }
  }

  cleanExpiredSessions() {
    const now = Date.now();
    for (const [token, session] of Object.entries(this.db.sessions)) {
      if (session.expiresAt < now) {
        delete this.db.sessions[token];
      }
    }
  }

  updateAdminCredentials(newUsername: string, newPassword?: string) {
    this.db.adminUser.username = newUsername.trim() || this.db.adminUser.username;
    if (newPassword && newPassword.trim().length >= 6) {
      const salt = generateSalt();
      this.db.adminUser.salt = salt;
      this.db.adminUser.passwordHash = hashPassword(newPassword.trim(), salt);
    }
    this.db.adminUser.updatedAt = new Date().toISOString();
    this.save();
    return { username: this.db.adminUser.username };
  }

  // Updates for website content
  updateSettings(settings: Partial<WebsiteSettings>) {
    this.db.settings = { ...this.db.settings, ...settings };
    this.save();
    return this.db.settings;
  }

  updateAbout(about: Partial<AboutSection>) {
    this.db.about = { ...this.db.about, ...about };
    this.save();
    return this.db.about;
  }

  // Services CRUD
  saveService(service: ServiceItem) {
    const index = this.db.services.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      this.db.services[index] = service;
    } else {
      this.db.services.push(service);
    }
    this.save();
    return service;
  }

  deleteService(id: string) {
    this.db.services = this.db.services.filter((s) => s.id !== id);
    this.save();
  }

  reorderServices(orderIds: string[]) {
    orderIds.forEach((id, idx) => {
      const s = this.db.services.find((item) => item.id === id);
      if (s) s.order = idx + 1;
    });
    this.save();
  }

  // Projects CRUD
  saveProject(project: ProjectItem) {
    const index = this.db.projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      this.db.projects[index] = project;
    } else {
      this.db.projects.push(project);
    }
    this.save();
    return project;
  }

  deleteProject(id: string) {
    this.db.projects = this.db.projects.filter((p) => p.id !== id);
    this.save();
  }

  reorderProjects(orderIds: string[]) {
    orderIds.forEach((id, idx) => {
      const p = this.db.projects.find((item) => item.id === id);
      if (p) p.order = idx + 1;
    });
    this.save();
  }

  // Navigation CRUD
  updateNavigation(navigation: NavItem[]) {
    this.db.navigation = navigation;
    this.save();
    return this.db.navigation;
  }

  // Media CRUD
  addMedia(asset: Omit<MediaAsset, 'id' | 'createdAt'>) {
    const newAsset: MediaAsset = {
      ...asset,
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.db.media.unshift(newAsset);
    this.save();
    return newAsset;
  }

  deleteMedia(id: string) {
    this.db.media = this.db.media.filter((m) => m.id !== id);
    this.save();
  }

  // Contact messages
  addMessage(msg: {
    name: string;
    email: string;
    discord: string;
    projectType: string;
    message: string;
  }) {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    this.db.messages.unshift(newMsg);
    this.save();
    return newMsg;
  }

  markMessageRead(id: string, read: boolean) {
    const m = this.db.messages.find((item) => item.id === id);
    if (m) {
      m.read = read;
      this.save();
    }
    return m;
  }

  deleteMessage(id: string) {
    this.db.messages = this.db.messages.filter((m) => m.id !== id);
    this.save();
  }
}

export const dbManager = new DatabaseManager();
