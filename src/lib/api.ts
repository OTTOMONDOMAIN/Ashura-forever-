import {
  PublicWebsiteData,
  AdminFullData,
  ServiceItem,
  ProjectItem,
  NavItem,
  WebsiteSettings,
  AboutSectionData,
  MediaAsset,
  ContactMessage,
} from '../types';

let authToken: string | null = localStorage.getItem('asura_admin_token');

export function setLocalToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('asura_admin_token', token);
  } else {
    localStorage.removeItem('asura_admin_token');
  }
}

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

// ============================================================================
// STATIC / SERVERLESS FALLBACK ENGINE (FOR CLOUDFLARE PAGES & VERCEL STATIC)
// ============================================================================
const STORAGE_KEY = 'asura_kinetics_cms_store_v1';

interface LocalStoreSchema {
  adminUser: {
    id: string;
    username: string;
    salt: string;
    passwordHash: string;
    updatedAt: string;
  };
  settings: WebsiteSettings;
  about: AboutSectionData;
  services: ServiceItem[];
  projects: ProjectItem[];
  navigation: NavItem[];
  media: MediaAsset[];
  messages: ContactMessage[];
}

const DEFAULT_STORE: LocalStoreSchema = {
  adminUser: {
    id: 'admin_1',
    username: 'AK-Admin-9482',
    salt: '30b43b31e6be87a4a05d513d8c05c314',
    passwordHash:
      'f9e7d2f84d4ae1cb1d9bb596e130cd2794dc151e9d0abc10647ff6147507cf6dd61ff025972a8de4a28351f331dd4c753d96587e94fe5f84d03f5353b092df2a',
    updatedAt: new Date().toISOString(),
  },
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

function getLocalStore(): LocalStoreSchema {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_STORE, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore storage read errors
  }
  return DEFAULT_STORE;
}

function saveLocalStore(store: LocalStoreSchema) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage write errors
  }
}

async function pbkdf2HexBrowser(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 100000,
      hash: 'SHA-512',
    },
    keyMaterial,
    512
  );
  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function isJsonResponse(res: Response): Promise<boolean> {
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json');
}

// ============================================================================
// API CLIENT WITH AUTOMATIC CLOUDFLARE / VERCEL STATIC FALLBACK
// ============================================================================

export async function fetchPublicData(): Promise<PublicWebsiteData> {
  try {
    const res = await fetch('/api/public');
    if (res.ok && (await isJsonResponse(res))) {
      return await res.json();
    }
  } catch {
    // Fallback to static/local store when hosted on static CDN (Cloudflare Pages / Vercel Static)
  }

  const store = getLocalStore();
  return {
    settings: store.settings,
    about: store.about,
    services: [...store.services].sort((a, b) => a.order - b.order),
    projects: [...store.projects].sort((a, b) => a.order - b.order),
    navigation: [...store.navigation]
      .filter((n) => n.enabled)
      .sort((a, b) => a.order - b.order),
  };
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  discord: string;
  projectType: string;
  message: string;
}) {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (await isJsonResponse(res)) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      return data;
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('Please provide')) {
      throw err;
    }
  }

  const store = getLocalStore();
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}`,
    name: payload.name.trim(),
    email: payload.email.trim(),
    discord: (payload.discord || '').trim(),
    projectType: payload.projectType || 'General Inquiry',
    message: payload.message.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  store.messages.unshift(newMsg);
  saveLocalStore(store);

  return {
    success: true,
    message: 'Transmission received. The Asura Kinetics team will review your proposal.',
    id: newMsg.id,
  };
}

export async function loginAdmin(
  username: string,
  password: string
): Promise<{ token: string; user: { username: string } }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (await isJsonResponse(res)) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }
      setLocalToken(data.token);
      return data;
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('Invalid')) {
      throw err;
    }
  }

  // Browser WebCrypto verification fallback for Cloudflare Pages / Static
  const store = getLocalStore();
  if (username.trim() !== store.adminUser.username) {
    throw new Error('Invalid administrator credentials.');
  }
  const computedHash = await pbkdf2HexBrowser(password, store.adminUser.salt);
  if (computedHash !== store.adminUser.passwordHash) {
    throw new Error('Invalid administrator credentials.');
  }

  const token = `static-session-${Date.now()}`;
  setLocalToken(token);
  return { token, user: { username: store.adminUser.username } };
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch {
    // Ignore network error on static host
  } finally {
    setLocalToken(null);
  }
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/check', {
      headers: getAuthHeaders(),
    });
    if (await isJsonResponse(res)) {
      return res.ok;
    }
  } catch {
    // Fallback check
  }
  return Boolean(authToken && authToken.startsWith('static-session-'));
}

export async function fetchAdminData(): Promise<AdminFullData> {
  try {
    const res = await fetch('/api/admin/data', {
      headers: getAuthHeaders(),
    });
    if (res.ok && (await isJsonResponse(res))) {
      return await res.json();
    }
  } catch {
    // Fallback to local store
  }

  const store = getLocalStore();
  return {
    adminUser: {
      id: store.adminUser.id,
      username: store.adminUser.username,
      updatedAt: store.adminUser.updatedAt,
    },
    settings: store.settings,
    about: store.about,
    services: [...store.services].sort((a, b) => a.order - b.order),
    projects: [...store.projects].sort((a, b) => a.order - b.order),
    navigation: [...store.navigation].sort((a, b) => a.order - b.order),
    media: store.media,
    messages: store.messages,
    stats: {
      totalProjects: store.projects.length,
      totalServices: store.services.length,
      totalMessages: store.messages.length,
      unreadMessages: store.messages.filter((m) => !m.read).length,
    },
  };
}

export async function updateAdminSettings(
  settings: Partial<WebsiteSettings>
): Promise<void> {
  try {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    if (res.ok && (await isJsonResponse(res))) return;
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  store.settings = { ...store.settings, ...settings };
  saveLocalStore(store);
}

export async function updateAdminAbout(
  about: Partial<AboutSectionData>
): Promise<void> {
  try {
    const res = await fetch('/api/admin/about', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(about),
    });
    if (res.ok && (await isJsonResponse(res))) return;
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  store.about = { ...store.about, ...about };
  saveLocalStore(store);
}

export async function saveService(service: ServiceItem): Promise<ServiceItem> {
  try {
    const res = await fetch('/api/admin/services', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(service),
    });
    if (res.ok && (await isJsonResponse(res))) {
      const data = await res.json();
      return data.service;
    }
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  const item = { ...service, id: service.id || `srv-${Date.now()}` };
  const idx = store.services.findIndex((s) => s.id === item.id);
  if (idx >= 0) store.services[idx] = item;
  else store.services.push(item);
  saveLocalStore(store);
  return item;
}

export async function deleteService(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/admin/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok && (await isJsonResponse(res))) return;
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  store.services = store.services.filter((s) => s.id !== id);
  saveLocalStore(store);
}

export async function saveProject(project: ProjectItem): Promise<ProjectItem> {
  try {
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(project),
    });
    if (res.ok && (await isJsonResponse(res))) {
      const data = await res.json();
      return data.project;
    }
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  const item = { ...project, id: project.id || `proj-${Date.now()}` };
  const idx = store.projects.findIndex((p) => p.id === item.id);
  if (idx >= 0) store.projects[idx] = item;
  else store.projects.push(item);
  saveLocalStore(store);
  return item;
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok && (await isJsonResponse(res))) return;
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  store.projects = store.projects.filter((p) => p.id !== id);
  saveLocalStore(store);
}

export async function updateNavigation(nav: NavItem[]): Promise<void> {
  try {
    const res = await fetch('/api/admin/navigation', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(nav),
    });
    if (res.ok && (await isJsonResponse(res))) return;
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  store.navigation = nav;
  saveLocalStore(store);
}

export async function addMediaAsset(asset: {
  name: string;
  url: string;
  category: string;
  size?: string;
}): Promise<void> {
  try {
    const res = await fetch('/api/admin/media', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(asset),
    });
    if (res.ok && (await isJsonResponse(res))) return;
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  store.media.unshift({
    id: `med-${Date.now()}`,
    name: asset.name,
    url: asset.url,
    category: asset.category || 'general',
    size: asset.size || 'N/A',
    createdAt: new Date().toISOString(),
  });
  saveLocalStore(store);
}

export async function deleteMediaAsset(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/admin/media/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok && (await isJsonResponse(res))) return;
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  store.media = store.media.filter((m) => m.id !== id);
  saveLocalStore(store);
}

export async function toggleMessageRead(
  id: string,
  read: boolean
): Promise<void> {
  try {
    const res = await fetch(`/api/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ read }),
    });
    if (res.ok && (await isJsonResponse(res))) return;
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  const msg = store.messages.find((m) => m.id === id);
  if (msg) msg.read = read;
  saveLocalStore(store);
}

export async function deleteMessage(id: string): Promise<void> {
  try {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok && (await isJsonResponse(res))) return;
  } catch {
    // Static fallback
  }
  const store = getLocalStore();
  store.messages = store.messages.filter((m) => m.id !== id);
  saveLocalStore(store);
}

export async function updateCredentials(payload: {
  username?: string;
  currentPassword: string;
  newPassword?: string;
}): Promise<void> {
  try {
    const res = await fetch('/api/auth/credentials', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (await isJsonResponse(res)) {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials');
      return;
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('password')) {
      throw err;
    }
  }

  const store = getLocalStore();
  const currentHash = await pbkdf2HexBrowser(
    payload.currentPassword,
    store.adminUser.salt
  );
  if (currentHash !== store.adminUser.passwordHash) {
    throw new Error('Current password verification failed.');
  }
  if (payload.username) {
    store.adminUser.username = payload.username.trim();
  }
  if (payload.newPassword && payload.newPassword.length >= 6) {
    store.adminUser.passwordHash = await pbkdf2HexBrowser(
      payload.newPassword,
      store.adminUser.salt
    );
  }
  store.adminUser.updatedAt = new Date().toISOString();
  saveLocalStore(store);
}
