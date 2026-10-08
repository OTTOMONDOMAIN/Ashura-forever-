import { PublicWebsiteData, AdminFullData, ServiceItem, ProjectItem, NavItem, WebsiteSettings, AboutSectionData } from '../types';

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

export async function fetchPublicData(): Promise<PublicWebsiteData> {
  const res = await fetch('/api/public');
  if (!res.ok) {
    throw new Error('Failed to load website content');
  }
  return res.json();
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  discord: string;
  projectType: string;
  message: string;
}) {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send message');
  }
  return data;
}

export async function loginAdmin(username: string, password: string): Promise<{ token: string; user: { username: string } }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid credentials');
  }
  setLocalToken(data.token);
  return data;
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } finally {
    setLocalToken(null);
  }
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/check', {
      headers: getAuthHeaders(),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchAdminData(): Promise<AdminFullData> {
  const res = await fetch('/api/admin/data', {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error('Unauthorized or session expired');
  }
  return res.json();
}

export async function updateAdminSettings(settings: Partial<WebsiteSettings>): Promise<void> {
  const res = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
}

export async function updateAdminAbout(about: Partial<AboutSectionData>): Promise<void> {
  const res = await fetch('/api/admin/about', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(about),
  });
  if (!res.ok) throw new Error('Failed to update about section');
}

export async function saveService(service: ServiceItem): Promise<ServiceItem> {
  const res = await fetch('/api/admin/services', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(service),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save service');
  return data.service;
}

export async function deleteService(id: string): Promise<void> {
  const res = await fetch(`/api/admin/services/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete service');
}

export async function saveProject(project: ProjectItem): Promise<ProjectItem> {
  const res = await fetch('/api/admin/projects', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(project),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to save project');
  return data.project;
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/admin/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

export async function updateNavigation(nav: NavItem[]): Promise<void> {
  const res = await fetch('/api/admin/navigation', {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(nav),
  });
  if (!res.ok) throw new Error('Failed to update navigation');
}

export async function addMediaAsset(asset: { name: string; url: string; category: string; size?: string }): Promise<void> {
  const res = await fetch('/api/admin/media', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(asset),
  });
  if (!res.ok) throw new Error('Failed to upload media');
}

export async function deleteMediaAsset(id: string): Promise<void> {
  const res = await fetch(`/api/admin/media/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete media');
}

export async function toggleMessageRead(id: string, read: boolean): Promise<void> {
  const res = await fetch(`/api/admin/messages/${id}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ read }),
  });
  if (!res.ok) throw new Error('Failed to update message');
}

export async function deleteMessage(id: string): Promise<void> {
  const res = await fetch(`/api/admin/messages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete message');
}

export async function updateCredentials(payload: { username?: string; currentPassword: string; newPassword?: string }): Promise<void> {
  const res = await fetch('/api/auth/credentials', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update credentials');
}
