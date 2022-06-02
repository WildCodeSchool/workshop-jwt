const models = require("../models");

class UserController {
  static register = async (req, res) => {
    const { email, password, name } = req.body;

    // TODO check if email and/or password are empty or missing

    // TODO hash password

    models.user
      .insert({ email, password, name })
      .then(([result]) => {
        // TODO success response
      })
      .catch((err) => {
        console.error(err);
        // TODO send error response
      });
  };

  static login = (req, res) => {
    const { email, password } = req.body;

    // TODO check if email and/or password are empty or missing

    models.user
      // TODO complete the `findByMail` method in UserManager.js
      .findByMail(email)
      .then(async ([rows]) => {
        if (rows[0] == null) {
          // TODO invalid email
        } else {
          // TODO check password
          // TODO generate JWT
          // TODO send response
        }
      })
      .catch((err) => {
        console.error(err);
        // TODO send error response
      });
  };

  // TODO add authenticateWithJsonWebToken method here!

  static browse = (req, res) => {
    models.user
      .findAll()
      .then(([rows]) => {
        // TODO send users without passwords
      })
      .catch((err) => {
        console.error(err);
        // TODO send error response
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
