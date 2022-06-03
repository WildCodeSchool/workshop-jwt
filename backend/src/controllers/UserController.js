const models = require("../models");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

class UserController {
  static register = async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).send({ error: "Please specify both email and password" });
      return;
    }

    try {
      const hash = await argon2.hash(password);

      models.user
        .insert({ email, password: hash, role })
        .then(([result]) => {
          res.status(201).send({ id: result.insertId, email, role });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({
            error: err.message,
          });
        });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: err.message,
      });
    }
  };

  static login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ error: "Please specify both email and password" });
    }

    models.user
      .findByMail(email)
      .then(async ([rows]) => {
        if (rows[0] == null) {
          res.status(401).send({
            error: "Invalid email",
          });
        } else {
          const { id, email, password: hashedPassword, role } = rows[0];

          if (await argon2.verify(hashedPassword, password)) {
            const token = jwt.sign(
              { id: id, role: role },
              process.env.JWT_AUTH_SECRET,
              {
                expiresIn: "1h",
              }
            );

            res
              .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
              })
              .status(200)
              .send({
                id,
                email,
                role,
              });
          } else {
            res.status(401).send({
              error: "Invalid password",
            });
          }
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  };

  // TODO add `authorization` middleware here!
  static authorization = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.sendStatus(401);
    }
    try {
      const data = jwt.verify(token, process.env.JWT_AUTH_SECRET);
      req.userId = data.id;
      req.userRole = data.role;
      return next();
    } catch {
      return res.sendStatus(401);
    }
  };

  // TODO add `isAdmin` middleware here!
  static isAdmin = (req, res, next) => {
    if (req.userRole === "ADMIN") {
      return next();
    }
    return res.sendStatus(403);
  };

  static browse = (req, res) => {
    models.user
      .findAll()
      .then(([rows]) => {
        res.send(
          rows.map((user) => {
            return {
              id: user.id,
              email: user.email,
              role: user.role,
            };
          })
        );
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  };

  static edit = (req, res) => {
    const user = req.body;

    user.id = parseInt(req.params.id, 10);

    models.user
      .update(user)
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.sendStatus(404);
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static delete = (req, res) => {
    models.user
      .delete(req.params.id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };
}

module.exports = UserController;
