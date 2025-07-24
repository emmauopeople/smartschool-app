exports.requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.session?.role;
    if (allowedRoles.includes(userRole)) {
      return next();
    }
    return res.status(403).send('Access Denied');
  };
};
