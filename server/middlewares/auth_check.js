const jwt = require('jsonwebtoken');
const config = require('config')
const userService = require('../services/users')

async function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, config.get('jwt.secret'));
    req.user = await userService.findById(decoded.id)
    if (req.user) {
        console.log("User authenticated: ", {id: req.user.id, name: req.user.name})
        next();
    } else {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } catch (err) {
    if (err.message.includes('invalid signature')) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
    if (err.message.includes('expired')) {
        return res.status(403).json({ message: 'Token expired' });
    }
    if (err.message.includes('jwt malformed')) {
        return res.status(403).json({ message: 'Invalid token' });
    }
    console.error('Error authenticating user: ', err)
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function checkIsAdmin(req, res, next) {
    await authenticate(req, res, () => {
        if (!req.user) {
            return res.status(403).json({ message: 'Access denied' });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    });
}

module.exports = {
    authenticate,
    checkIsAdmin
}
