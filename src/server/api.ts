import { Router, Request, Response, NextFunction } from 'express';
import { dbManager } from './db';

const router = Router();

// Helper to extract session token from cookies or Authorization header
function getSessionToken(req: Request): string | undefined {
  if (req.cookies && req.cookies.asura_session) {
    return req.cookies.asura_session;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return undefined;
}

// Authentication middleware for /api/admin routes
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = getSessionToken(req);
  if (!token || !dbManager.validateSession(token)) {
    return res.status(401).json({ error: 'Unauthorized. Please sign in as administrator.' });
  }
  next();
}

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// Get all published website content
router.get('/public', (_req: Request, res: Response) => {
  try {
    const data = dbManager.getPublicData();
    res.json(data);
  } catch (err) {
    console.error('Error fetching public content:', err);
    res.status(500).json({ error: 'Failed to retrieve website data.' });
  }
});

// Submit contact form
router.post('/contact', (req: Request, res: Response) => {
  try {
    const { name, email, discord, projectType, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide your name, email, and a message.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const saved = dbManager.addMessage({
      name: String(name).trim().slice(0, 100),
      email: String(email).trim().slice(0, 150),
      discord: String(discord || '').trim().slice(0, 100),
      projectType: String(projectType || 'General Inquiry').trim().slice(0, 100),
      message: String(message).trim().slice(0, 3000),
    });

    res.status(201).json({
      success: true,
      message: 'Transmission received. The Asura Kinetics team will review your proposal.',
      id: saved.id,
    });
  } catch (err) {
    console.error('Error processing contact message:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

// Login
router.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const isValid = dbManager.verifyCredentials(String(username).trim(), String(password));
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const sessionToken = dbManager.createSession(String(username).trim());

    // Set secure HTTP-only cookie
    res.cookie('asura_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    res.json({
      success: true,
      token: sessionToken,
      user: { username: String(username).trim() },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication service encountered an error.' });
  }
});

// Check current session
router.get('/auth/check', (req: Request, res: Response) => {
  const token = getSessionToken(req);
  const isValid = dbManager.validateSession(token);
  if (isValid) {
    const data = dbManager.getFullData();
    res.json({ authenticated: true, user: data.adminUser });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Logout
router.post('/auth/logout', (req: Request, res: Response) => {
  const token = getSessionToken(req);
  if (token) {
    dbManager.destroySession(token);
  }
  res.clearCookie('asura_session', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Update credentials
router.post('/auth/credentials', requireAdmin, (req: Request, res: Response) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const currentFull = dbManager.getFullData();
    
    // Verify current password first
    if (!dbManager.verifyCredentials(currentFull.adminUser.username, currentPassword)) {
      return res.status(400).json({ error: 'Current password verification failed.' });
    }

    if (newPassword && newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const updated = dbManager.updateAdminCredentials(username || currentFull.adminUser.username, newPassword);
    res.json({ success: true, message: 'Admin credentials updated successfully.', user: updated });
  } catch (err) {
    console.error('Error updating credentials:', err);
    res.status(500).json({ error: 'Failed to update credentials.' });
  }
});

// ==========================================
// ADMIN CMS ENDPOINTS (PROTECTED)
// ==========================================

// Get full CMS bundle
router.get('/admin/data', requireAdmin, (_req: Request, res: Response) => {
  try {
    const data = dbManager.getFullData();
    res.json(data);
  } catch (err) {
    console.error('Error getting admin data:', err);
    res.status(500).json({ error: 'Failed to retrieve admin data.' });
  }
});

// Update Settings
router.put('/admin/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = dbManager.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update website settings.' });
  }
});

// Update About Section
router.put('/admin/about', requireAdmin, (req: Request, res: Response) => {
  try {
    const updated = dbManager.updateAbout(req.body);
    res.json({ success: true, about: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update about section.' });
  }
});

// Services CRUD
router.post('/admin/services', requireAdmin, (req: Request, res: Response) => {
  try {
    const service = req.body;
    if (!service.id) {
      service.id = `srv-${Date.now()}`;
    }
    const saved = dbManager.saveService(service);
    res.json({ success: true, service: saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save service.' });
  }
});

router.delete('/admin/services/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    dbManager.deleteService(req.params.id);
    res.json({ success: true, message: 'Service deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service.' });
  }
});

router.put('/admin/services/reorder', requireAdmin, (req: Request, res: Response) => {
  try {
    const { orderIds } = req.body;
    if (Array.isArray(orderIds)) {
      dbManager.reorderServices(orderIds);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder services.' });
  }
});

// Projects CRUD
router.post('/admin/projects', requireAdmin, (req: Request, res: Response) => {
  try {
    const project = req.body;
    if (!project.id) {
      project.id = `proj-${Date.now()}`;
    }
    const saved = dbManager.saveProject(project);
    res.json({ success: true, project: saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save project.' });
  }
});

router.delete('/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    dbManager.deleteProject(req.params.id);
    res.json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

router.put('/admin/projects/reorder', requireAdmin, (req: Request, res: Response) => {
  try {
    const { orderIds } = req.body;
    if (Array.isArray(orderIds)) {
      dbManager.reorderProjects(orderIds);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reorder projects.' });
  }
});

// Navigation CRUD
router.put('/admin/navigation', requireAdmin, (req: Request, res: Response) => {
  try {
    const nav = req.body;
    if (Array.isArray(nav)) {
      const updated = dbManager.updateNavigation(nav);
      return res.json({ success: true, navigation: updated });
    }
    res.status(400).json({ error: 'Navigation payload must be an array.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update navigation.' });
  }
});

// Media CRUD
router.post('/admin/media', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, url, category, size } = req.body;
    if (!name || !url) {
      return res.status(400).json({ error: 'Media name and URL are required.' });
    }
    const asset = dbManager.addMedia({
      name: String(name),
      url: String(url),
      category: String(category || 'general'),
      size: String(size || 'N/A'),
    });
    res.json({ success: true, media: asset });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add media asset.' });
  }
});

router.delete('/admin/media/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    dbManager.deleteMedia(req.params.id);
    res.json({ success: true, message: 'Media removed.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete media.' });
  }
});

// Messages management
router.patch('/admin/messages/:id/read', requireAdmin, (req: Request, res: Response) => {
  try {
    const { read } = req.body;
    const updated = dbManager.markMessageRead(req.params.id, Boolean(read));
    res.json({ success: true, message: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message status.' });
  }
});

router.delete('/admin/messages/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    dbManager.deleteMessage(req.params.id);
    res.json({ success: true, message: 'Message deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message.' });
  }
});

export default router;
