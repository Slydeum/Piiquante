// routage des sauces


// import
const express = require("express");

// routeur express
const router = express.Router();

// middleware gère authentification utilisateur
const auth = require("../middleware/auth");
// middleware gère les téléchargements de fichiers
const multer = require("../middleware/multer-config");
// controleur gère les routes sauces
const saucesCtrl = require("../controllers/sauce");


// configuration des routes

// route pour récupérer toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);
// route pour créer une sauce
router.post('/', auth, multer, saucesCtrl.createSauce);
// route pour récupérer une sauce
router.get('/:id', auth, saucesCtrl.getOneSauce);
// route pour modifier une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// route pour supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// route pour like ou dislike une sauce
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;