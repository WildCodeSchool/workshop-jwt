_Fork_ ce _boilerplate_ afin de démarrer le tutoriel : [https://github.com/WildCodeSchool/workshop-jwt](https://github.com/WildCodeSchool/workshop-jwt).

## 0 - Configuration

### Installation

Installe le projet avec la commande :

```bash
npm run setup
```

### Base de données

Afin de gérer l'inscription et la connexion d'utilisateurs, crée une nouvelle base de données nommée `jwtcourse` et importe le script `backend/database.sql` afin de recréer la table `user` suivante :

![Database](pictures/2-database.png)

### Variables d'environnements

Dans le dossier `backend`, copie le fichier `.env.sample` vers `.env` et modifie les variables d'environnements correspondantes à la base de données.

### Exécution

Tu pourras démarrer le projet avec la commande :

```bash
npm run dev
```

## 1 - Création d'un compte utilisateur

Modifie la route en POST `/register` qui va permettre la création d'un compte utilisateur.

La route doit récupérer du corps de la requête un json à la structure suivante :

```json
{
  "email": "son email",
  "password": "son mot de passe",
  "name": "son nom"
}
```

Si l'email ou le mot de passe ne sont pas renseignés, renvoyer une erreur 400 'Please specify both email and password'.

Dans le cas où ils sont renseignés, faire une requête à la base de données et insérer les données dans la table `user`.

Si une erreur survient lors de l'exécution de la requête SQL, renvoyer une erreur 500 avec le message d'erreur correspondant.

Si tout c'est bien passé, renvoyer un code 201 avec un json ayant la structure suivante :

```json
{
  "id": "son id",
  "email": "son email",
  "name": "son nom"
}
```

> Ne pas renvoyer le mot de passe renseigné

Teste le tout avec Postman :

- POST http://localhost:8080/register
- Body / raw / JSON
- Dans le corps de la requête un JSON, par exemple :

```json
{
  "email": "test@test.fr",
  "password": "tacos",
  "name": "Michel"
}
```

![Register - Postman](pictures/3-register-postman.png)

### Solution

> **Attention** : essaie de faire l'exercice par toi-même avant de regarder la solution !

⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅

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

## 2 - Hashage du mot de passe

Il est très dangereux de laisser le mot de passe de l'utilisateur _en clair_ dans une base de données.

Regarde le lien suivant pour voir comment _hasher_ le mot de passe avec la bibliothèque _argon2_ : [https://www.npmjs.com/package/argon2](https://www.npmjs.com/package/argon2).

Installe le module [argon2](https://www.npmjs.com/package/argon2) dans ton projet.

Ensuite modifie ta route `/register` pour crypter le mot de passe de façon synchrone, **avant** qu'il ne soit enregistré dans la base de données.

Vérifie que le mot de passe est bien encrypté dans la base de donnée.

> Pense à importer le module en haut de ton fichier !

### Solution

> **Attention** : essaie de faire l'exercice par toi-même avant de regarder la solution !

⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅

```js
// src/controllers/UserController.js

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

## 3 - Connexion au compte utilisateur

Créer une route en POST `/login` qui va permettre la connexion d'un compte utilisateur.

La route doit récupérer du corps de la requête un json à la structure suivante :

```json
{
  "email": "son email",
  "password": "son mot de passe"
}
```

Si l'email ou le mot de passe ne sont pas renseignés, renvoyer une erreur 400 'Please specify both email and password'.

Dans le cas où ils sont renseignés, faire une requête à la base de données et vérifier que l'email existe bien (**tester l'email uniquement, pas le mot de passe !**).

Si une erreur survient lors de l'exécution de la requête SQL, renvoyer une erreur 500 avec le message d'erreur correspondant.

Si le résultat renvoyé est vide, renvoyer une erreur 403 'Invalid email'.

Si le résultat n'est pas vide, tu vas maintenant vérifier le mot de passe en utilisant la méthode `verify` du module _argon2_. Tu peux trouver un exemple d'utilisation ici : [https://www.npmjs.com/package/argon2](https://www.npmjs.com/package/argon2).

> Attention, il faut mettre le mot de passe de la base de données en premier argument, et le mot de passe _en clair_ en second

Si tout le mot de passe est identique, renvoyer un code 200 avec un json ayant la structure suivante :

```json
{
  "id": "son id",
  "email": "son email",
  "name": "son nom"
}
```

Sinon renvoie une erreur 403 avec le message 'Invalid password'.

Teste le tout avec Postman :

- POST http://localhost:8080/login
- Body / raw / JSON
- Dans le corps de la requête un JSON, par exemple :

```json
{
  "email": "test@test.fr",
  "password": "tacos"
}
```

![Login - Postman](pictures/4-login-postman.png)

### Solution

> **Attention** : essaie de faire l'exercice par toi-même avant de regarder la solution !

⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅

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

## 4 - Création d'un JSON Web Token

Tu rentres enfin dans le vif du sujet : la génération du JWT grâce à une clef secrète.

Commence par renseigner une clé secrète dans le fichier `.env`. Tu peux générer une clé sécurisée ici : [https://www.grc.com/passwords.htm](https://www.grc.com/passwords.htm).

Ensuite, tu vas utiliser le module [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) pour effectuer la génération de la clé :

- installe le module
- utilise la méthode `sign` afin de générer un JWT, en utilisant la clé secrète charchée à partir des variables d'environnement.
- Le _payload_ de la clé sera le json suivant : `json { id: id, name: name }`
- la date d'expiration `expiresIn` sera de une heure.

Génère la clé juste avant de renvoyer utilisateur dans la route `/login` et fait en sorte que la structure du JSON soit la suivante :

```json
{
  "id": "son id",
  "email": "son email",
  "name": "son nom",
  "token": "le token généré"
}
```

![Login with token - Postman](pictures/5-token-postman.png)

### Solution

> **Attention** : essaie de faire l'exercice par toi-même avant de regarder la solution !

⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅

```js
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

## 5 - Afficher la liste des utilisateurs

Créer une route en GET `/users` qui récupère la liste des utilisateurs.

Si une erreur survient lors de l'exécution de la requête SQL, renvoyer une erreur 500 avec le message d'erreur correspondant.

Si tout c'est bien passé, renvoyer un code 200 avec un json ayant la structure suivante :

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

> Pense à supprimer de l'affichage le mot de passe de chaque utilisateur !

### Solution

> **Attention** : essaie de faire l'exercice par toi-même avant de regarder la solution !

⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅

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
        res.sendStatus(500);
      });
  };
```

## 6 - Création d'un middleware d'authentification

Afin de protéger la route `/users` pour que seuls les utilisateurs authentifiés puissent y accéder, tu vas utiliser un _middleware_ qui va récupérer l'entête de la requête et y regarder la présence d'un _token_.

Pour cette partie là, le _middleware_ est déjà fourni et est dans `UserController` :

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

Tu vas devoir modifier la route `/user` dans `src/router.js`, afin qu'elle charge ce _middleware_.

Teste ensuite la route avec Postman, en renseignant l'entête suivante : `Authorization: Bearer eyJhbG.. ...8RvKts`

Bien sûr, il faudra remplacer le _token_ par celui récupéré lors de la connexion de l'utilisateur dans l'étape 4.

![Login with token - Postman](pictures/6-bearer-postman.png)

### Solution

> **Attention** : essaie de faire l'exercice par toi-même avant de regarder la solution !

⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅
⋅

```js
// src/router.js

router.get("/users", authenticateWithJsonWebToken, UserController.browse);
```
