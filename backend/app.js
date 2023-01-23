/* configure un serveur express
 fonctionnalités pour gérer les routes, les requêtes et les réponses HTTP */


// imports
const express = require('express'); // framework node
require('dotenv').config();  // variables d'environnement
const mongoose = require('mongoose');  // mongoDB
const path = require('path'); // système de fichiers
const cors = require('cors'); // sécurité protège les en-têtes


// création de express
const app = express();


// connexion à mongoDB
mongoose.set('strictQuery', false);  // désactive la validation stricte des requêtes
mongoose.connect(process.env.MONGODB,  // connexion via variable d'environnment(.env)
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// cors (Cross-origin resource sharing)
app.use((req, res, next) => {
  // toute origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  // autorise les en-têtes de requête
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // méthodes de requête
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// utilise cors
app.use(cors());

// json en js
app.use(express.json());

// dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// import des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// utilise les routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// exporte l'app
module.exports = app;