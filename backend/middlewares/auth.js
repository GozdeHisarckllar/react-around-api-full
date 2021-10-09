const jwt = require('jsonwebtoken');
const { devKey } = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).send({ message: 'Forbidden resource. Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : devKey);
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token. Authorization required' });
  }

  req.user = payload;

  next();
};
