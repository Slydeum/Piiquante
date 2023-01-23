// configure un serveur Express 


require('dotenv').config();  // variables d'environnement
const express = require('express'); // framework node
const mongoose = require('mongoose');  // mongoDB
const path = require('path'); // système de fichiers
const cors = require('cors'); // sécurité protège les headers


// création de express
const app = express();


// connexion à MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB,  // via variable d'environnment
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// sécurité protége les headers
app.use(cors());

// json en js
app.use(express.json());

// dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// import des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// enregistre les routeurs
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// exporte l'app
module.exports = app;