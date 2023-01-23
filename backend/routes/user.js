// routage pour utilisateur


// import d'express
const express = require('express');

// routeur express
const router = express.Router();

// import du schéma d'utilisateur
const userCtrl = require('../controllers/user');

// définition des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;