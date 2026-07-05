function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) rc.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

function isAdminAuth(req) {
  const cookies = parseCookies(req);
  return cookies.sz_admin === 'authenticated';
}

function requireAdmin(req, res, next) {
  if (isAdminAuth(req)) return next();
  if (req.originalUrl.startsWith('/admin/api')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.redirect('/admin/login');
}

module.exports = { parseCookies, isAdminAuth, requireAdmin };
