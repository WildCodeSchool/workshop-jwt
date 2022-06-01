const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const models = require("../models");

class UserController {
  static register = async (req, res) => {
    const { email, password, name } = req.body;

    // TODO check if email and/or password are empty or missing
    if (!email || !password) {
      res.status(400).send({ error: "Please specify both email and password" });
      return;
    }

    try {
      // TODO hash password
      const hash = await argon2.hash(password);

      models.user
        .insert({ email, password: hash, name })
        .then(([result]) => {
          // TODO success response
          res.status(201).send({ id: result.insertId, email, name });
        })
        .catch((err) => {
          console.error(err);
          // TODO send error response
          res.status(500).send({
            error: err.message,
          });
        });
    } catch (err) {
      console.error(err);
      // TODO send error response
      res.status(500).send({
        error: err.message,
      });
    }
  };

  static login = (req, res) => {
    const { email, password } = req.body;

    // TODO check if email and/or password are empty or missing
    if (!email || !password) {
      res.status(400).send({ error: "Please specify both email and password" });
    }

    models.user
      // TODO complete the `findByMail` method in UserManager.js
      .findByMail(email)
      .then(async ([rows]) => {
        // TODO invalid email
        if (rows[0] == null) {
          res.status(403).send({
            error: "Invalid email",
          });
        } else {
          const { id, email, password: hashedPassword, name } = rows[0];

          // TODO check password
          if (await argon2.verify(hashedPassword, password)) {
            const token = jwt.sign(
              { id: id, name: name },
              process.env.JWT_AUTH_SECRET,
              {
                expiresIn: "1h",
              }
            );

            res.status(200).send({
              id,
              email,
              name,
              token,
            });
          } else {
            res.status(403).send({
              error: "Invalid password",
            });
          }
        }
      })
      .catch((err) => {
        console.error(err);
        // TODO send error response
        res.status(500).send({
          error: err.message,
        });
      });
  };

  static authenticateWithJsonWebToken = (req, res, next) => {
    if (req.headers.authorization !== undefined) {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.JWT_AUTH_SECRET, (err) => {
        if (err) {
          res
            .status(401)
            .json({ error: "you're not allowed to access these data" });
        } else {
          next();
        }
      });
    } else {
      res
        .status(401)
        .json({ error: "you're not allowed to access these data" });
    }
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
              name: user.name,
            };
          })
        );
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  };

  static edit = (req, res) => {
    const user = req.body;

    // TODO validations (length, format...)

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
