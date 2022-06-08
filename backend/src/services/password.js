const argon2 = require("argon2");

async function passwordHash(password) {
  return argon2.hash(password);
}

async function passwordVerify(hash, password) {
  return argon2.verify(hash, password);
}

module.exports = { passwordHash, passwordVerify };
