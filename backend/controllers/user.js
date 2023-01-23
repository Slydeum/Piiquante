// système d'inscription et de connexion d'utilisateur


const bcrypt = require('bcrypt');  // chiffre et hache le mot de passe
const jwt = require('jsonwebtoken');  // crée et vérifie les tokens pour l'authentification
const User = require('../models/User'); // schéma utilisateur
require('dotenv').config();  // variables d'environnement (informations sensibles)

//// créer un compte
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // hache le mot de passe 10 fois
    .then(hash => {
      const user = new User({ // création utilisateur
        email: req.body.email,
        password: hash
      });
      user.save()// sauvegarde utilisateur
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


// se connecter à un compte
exports.login = (req, res, next) => {
  // vérifie si l'email existe
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {  // si l'email est introuvable
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // vérifie le mot de passe 
        .then(valid => {
          if (!valid) { // mot de passe incorrect
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({ // mot de passe correct
            userId: user._id,
            token: jwt.sign( // création du token
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' } // token valide 24h
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};