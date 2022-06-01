const express = require("express");

const { UserController } = require("./controllers");

const router = express.Router();

// TODO modify the `register` method in UserController
router.post("/users/register", UserController.register);
// TODO modify the `login` method in UserController
router.post("/users/login", UserController.login);

// TODO call the JWT middleware
router.get("/users", UserController.browse);
router.put("/users/:id", UserController.edit);
router.delete("/users/:id", UserController.delete);

module.exports = router;
