_Fork_ this _boilerplate_ before starting the tutorial!

Install the project with the command:

```bash
npm run setup
```

# Backend

## 0 - Configuration

### Database

In order to manage user registration and login, create a new database named `jwtcourse` and import the script `backend/database.sql` to recreate the following `user` table:

![Database](pictures/2-database.png)

### Environment variables

In the `backend` folder, copy the `.env.sample` file to `.env` and change the environment variables for the database.

### Running

You can start the project with the command:

```bash
npm run dev
```

## 1 - Creating a user account

Modify the POST route `/users/register` which will allow the creation of a user account.

The route must retrieve a json with the following structure from the request body:

```json
{
  "email": "their email",
  "password": "their password",
  "name": "their name"
}
```

If the email or password are not filled in, return an error 400 'Please specify both email and password'.

If they are, query the database and insert the data into the `user` table.

If an error occurs while executing the SQL query, return an error 500 with the corresponding error message.

If all went well, return a 201 code with a json with the following structure:

```json
{
  "id": "their id",
  "email": "their email",
  "name": "their name"
}
```

> Do not return the password

Test it with Postman:

- POST http://localhost:5000/users/register
- Body / raw / JSON
- In the body of the request a JSON, for example:

```json
{
  "email": "test@test.fr",
  "password": "tacos",
  "name": "Michel"
}
```

![Register - Postman](pictures/3-register-postman.png)

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
// src/controllers/UserController.js

  static register = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).send({ error: "Please specify both email and password" });
      return;
    }

    models.user
      .insert({ email, password, name })
      .then(([result]) => {
        res.status(201).send({ id: result.insertId, email, name });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({
          error: err.message,
        });
      });
  };
```

## 2 - Password hashing

It is very dangerous to leave the user's _clear_ password in a database.

Look at the following link to see how to _hash_ the password with the _argon2_ library: [https://github.com/ranisalt/node-argon2#node-argon2](https://github.com/ranisalt/node-argon2#node-argon2).

Install the [argon2](https://www.npmjs.com/package/argon2) module in your project.

Then modify your `/users/register` route to hash the password, **before** it is stored in the database.

Check that the password is hashed in the database.

> Be careful, the module must be installed in the backend!

> Remember to import the module at the top of your file!

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
// src/controllers/UserController.js

  const argon2 = require("argon2");

  static register = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).send({ error: "Please specify both email and password" });
      return;
    }

    try {
      const hash = await argon2.hash(password);

      models.user
        .insert({ email, password: hash, name })
        .then(([result]) => {
          res.status(201).send({ id: result.insertId, email, name });
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
```

## 3 - User account login

Create a POST route `/users/login` that will allow the connection of a user account.

The route must retrieve a json with the following structure from the request body:

```json
{
  "email": "their email",
  "password": "their password"
}
```

If neither the email nor the password are filled in, return a 400 error 'Please specify both email and password'.

If they are both specified, make a request to the database and check that the email exists (**test the email only, not the password!)**).

If an error occurs during the execution of the SQL query, return an error 500 with the corresponding error message.

If the result returned is empty, return a 403 'Invalid email' error.

If the result is not empty, you will now verify the password using the `verify` method of the _argon2_ module. You can find an example here: [https://github.com/ranisalt/node-argon2#node-argon2](https://github.com/ranisalt/node-argon2#node-argon2).

> Be careful, you have to put the database password as the first argument, and the _clear_ password as the second

If all the password is the same, return a 200 code with a json with the following structure:

```json
{
  "id": "their id",
  "email": "their email",
  "name": "their name"
}
```

Otherwise returns a 403 error with the message 'Invalid password'.

Test this with Postman:

- POST http://localhost:5000/users/login
- Body / raw / JSON
- In the body of the request a JSON, for example:

```json
{
  "email": "test@test.fr",
  "password": "tacos"
}
```

![Login - Postman](pictures/4-login-postman.png)

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
// src/models/UserManager.js

  findByMail(email) {
    return this.connection.query(
      `select * from ${UserManager.table} where email = ?`,
      [email]
    );
  }

// src/controllers/UserController.js

  static login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ error: "Please specify both email and password" });
    }

    models.user
      .findByMail(email)
      .then(async ([rows]) => {
        if (rows[0] == null) {
          res.status(403).send({
            error: "Invalid email",
          });
        } else {
          const { id, email, password: hashedPassword, name } = rows[0];

          if (await argon2.verify(hashedPassword, password)) {
            res.status(200).send({
              id,
              email,
              name,
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
        res.status(500).send({
          error: err.message,
        });
      });
  };
```

## 4 - Creating a JSON Web Token

You are finally getting to the heart of the matter: generating the JWT using a secret key.

Start by filling in a secret key in the `.env` file. You can generate a secure key here: [https://www.grc.com/passwords.htm](https://www.grc.com/passwords.htm).

Next, you will use the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) module to perform the key generation:

- install the module
- module, use the `sign` method to generate a JWT, using the secret key charred from the environment variables.
- The _payload_ of the key will be the following json: `json { id: id, name: name }`
- the expiry date `expiresIn` will be one hour.

Generate the key just before returning user in the `/users/login` route and make the structure of the JSON as follows:

```json
{
  "id": "their id",
  "email": "their email",
  "name": "their name",
  "token": "their generated token"
}
```

![Login with token - Postman](pictures/5-token-postman.png)

> Be careful, the module has to be installed in the backend!

> Remember to import the module at the top of your file!

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
// src/controllers/UserController.js

  const jwt = require("jsonwebtoken");

  static login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ error: "Please specify both email and password" });
    }

    models.user
      .findByMail(email)
      .then(async ([rows]) => {
        if (rows[0] == null) {
          res.status(403).send({
            error: "Invalid email",
          });
        } else {
          const { id, email, password: hashedPassword, name } = rows[0];

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
        res.status(500).send({
          error: err.message,
        });
      });
  };
```

## 5 - Displaying the list of users

Create a GET `/users` route that retrieves the list of users.

If an error occurs during the execution of the SQL query, return an error 500 with the corresponding error message.

If all went well, return a 200 code with a json with the following structure:

```json
[
  {
    "id": 1,
    "email": "test@test.fr",
    "name": "Michel"
  },
  {
    "id": 2,
    "email": "tacos@test.fr",
    "name": "tacosman"
  }
]
```

> Remember to remove the password of each user from the display!

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
// src/controllers/UserController.js

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
        res.status(500).send({
          error: err.message,
        });
      });
  };
```

## 6 - Creating authentication middleware

In order to protect the `/users` route so that only authenticated users can access it, you will use _middleware_ which will retrieve the request header and look for a _token_.

For this part, add the _middleware_ below to the `UserController`:

```js
// src/controllers/UserController.js

  static authenticateWithJsonWebToken = (req, res, next) => {
    if (req.headers.authorization !== undefined) {
      const token = req.headers.authorization.split(' ')[1];
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
```

You'll need to modify the `/user` route in `src/router.js`, so that it loads this _middleware_.

Then test the route with Postman, by filling in the following header: `Authorization: Bearer eyJhbG.. ...8RvKts`

Of course, you'll have to replace the _token_ with the one you got when you logged in in step 4.

![Login with token - Postman](pictures/6-bearer-postman.png)

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
// src/router.js

const {
  authenticateWithJsonWebToken,
} = require("./controllers/UserController");

router.get("/users", authenticateWithJsonWebToken, UserController.browse);
```

# Frontend

## 0 - Configuration

In the `frontend` folder, copy the `.env.sample` file to `.env`.

## 1 - Login form

The first step will be to create a form that will allow a user to log into the backend made earlier.

Open the `Login` page and create a **controlled** form containing:

- a field for **email**
- a field for **password**
- an input to submit the form

Creates a `handleSubmit` function linked to the form submission:

- if the email or password is not filled in, displays an alert box with the message "Please specify both email and password"
- otherwise, displays the email and password values with a `console.log`.

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email && password) {
      console.log(email, password);
    } else {
      alert("Please specify both email and password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor='email'>
        Email:
        <input
          type='email'
          name='email'
          id='email'
          placeholder='test@blabla.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <br />
      <label htmlFor='password'>
        Password:
        <input
          type='password'
          name='password'
          id='password'
          placeholder='***********'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <input type='submit' value='Login' />
    </form>
  );
};

export default Login;
```

## 2 - Calling the server

Now that you have your form ready, you will contact the server and have it respond to you if the user is logged in.

Install the `axios` module and modify the `handleSubmit` function to call the `/users/login` route on your server, using the environment variable for the server url.

> Be careful, the module has to be installed in the frontend!

You can get an environment variable as follows:

```js
import.meta.env.VITE_BACKEND_URL;
```

Think that the _email_ and _password_ will be sent in the body of the request, you can see an example here: [https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index](https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index) (in the _POST request_ section).

If an error is catched, it displays an alert box with the corresponding message. This is the `catch` method which you can see used in the shared resource above.

Once the contents of the response are retrieved, display the result with a `console.log`. If the result looks like the following code, you're in:

```json
{
  "id": "their id",
  "email": "their email",
  "token": "their generated token"
}
```

> Make sure your backend server is running!

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
const handleSubmit = (event) => {
  event.preventDefault();
  if (email && password) {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
        email,
        password,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  } else {
    alert("Please specify both email and password");
  }
};
```

## 3 - Saving the JSON Web Token

Now that the JWT has been received, you need to store it when the user logs in: that is, when you actually make the `console.log` of the axios call result.

Use **local storage** to store the `token` property value of the received JSON in the "TOKEN" key.

You can see how to store a value in _local storage_ here: [https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem).

Then display an alert box with the message "Logged successfully".

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
const handleSubmit = (event) => {
  event.preventDefault();
  if (email && password) {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
        email,
        password,
      })
      .then((res) => res.data)
      .then((data) => {
        localStorage.setItem("TOKEN", data.token);
        alert("Logged successfully");
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  } else {
    alert("Please specify both email and password");
  }
};
```

## 4 - Authenticated page: list of users

Now go to the `Users` page.

The purpose of this page is to display the list of users.

The first step will be to retrieve the "TOKEN" stored in the _local storage_. You can find it here:[https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem).

Next, you'll need to modify the `useEffect` function to make a call with `axios` to the `/users` route. Since this route is authenticated by JWT, the call will need a **header** of the following form:

```js
{
  headers: {
    Authorization: `Bearer ${token}`,
  },
}
```

You can find out how to send _headers_ with _axios_ at the following link: [https://masteringjs.io/tutorials/axios/headers](https://masteringjs.io/tutorials/axios/headers). Make sure you modify the example to look like the code above.

If all goes well, change the _state_ of `users` and the list of users should appear.

If there is an error (in the `catch` method), check the _status code_ (`error.response.status`). If it equals 401, it means that the person is not authenticated. Display an alert box with the message "You're not authorized to access these datas". If it is not this error code, display the error message retrieved from the response.

> Tip: make `console.log` everywhere to help you if it doesn't work.

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
useEffect(() => {
  const token = localStorage.getItem("TOKEN");
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data)
    .then((data) => {
      setUsers(data);
    })
    .catch((err) => {
      let message;
      if (err.response.status === 401) {
        message = "You're not authorized to access these datas";
      } else {
        message = err.response.data.error;
      }
      alert(message);
      console.error(err);
    });
}, []);
```

## 5 - Logging out the user

Finish now by going to the Logout page.

You will manage the user's logout by deleting their "TOKEN" from _local storage_: [https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/removeItem).

Once the _token_ is deleted, you can display an alert box with the message "Disconnected successfully".

**Bonus:** you can also create an account creation form for practice.

### Solution

> **Warning**: try to do the exercise by yourself before looking at the solution!

-
-
-
-
-
-
-
-
-
-
-
-

```js
const handleSubmit = (event) => {
  event.preventDefault();
  localStorage.removeItem("TOKEN");
  alert("Disconnected successfully");
};
```

## Bonus 1 - Retrieving the JWT payload

When a user logs in, the token is retrieved: it contains a `payload` (data stored in JSON).

Use the [jwt-decode] library (https://www.npmjs.com/package/jwt-decode) to decode and log the `payload`, when a user logs in.

## Bonus 2 - Account creation

Adds the content needed to create a user account.

## Bonus 3 - HTTP Cookies

Rather than using localStorage to handle Json Web Tokens, it is safer to use HTTP Cookies.

Change the code to use this method here: [Using Cookies with JWT in Node.js](https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn)
