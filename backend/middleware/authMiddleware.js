import { verifyAccessToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no access token provided' });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }

  const user = await User.findById(decoded.id).lean();
  if (!user) {
    return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
  }

  req.user = user;
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`
      });
    }
    next();
  };
};
