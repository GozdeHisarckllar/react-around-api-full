const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(403).send({ message: 'Forbidden resource. Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'b06e69b88dbbe0fdfe76f90af191777318f414fb532337e5ec723dd8ec19ef99');
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token. Authorization required' });
  }

  req.user = payload;

  next();
};
