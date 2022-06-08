const { jwtVerify } = require("./jwt");

function authorization(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const data = jwtVerify(token);
    req.userId = data.id;
    req.userRole = data.role;
    return next();
  } catch {
    return res.sendStatus(401);
  }
}

function isAdmin(req, res, next) {
  if (req.userRole === "ROLE_ADMIN") {
    return next();
  }
  return res.sendStatus(403);
}

module.exports = { authorization, isAdmin };
