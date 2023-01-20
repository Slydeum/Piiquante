const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const multer = require("../middleware/multer-config");

const saucesCtrl = require("../controllers/sauce");

// route pour récupérer toutes les sauces
router.get('/', auth, saucesCtrl.getAllSauces);
// route pour créer une sauce
router.post('/', auth, multer, saucesCtrl.createSauce);
// route pour récupérer une sauce séléctionnée
router.get('/:id', auth, saucesCtrl.getOneSauce);
// route pour modifier une sauce
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
// route pour supprimer une sauce
router.delete('/:id', auth, saucesCtrl.deleteSauce);
// route pour like ou dislike une sauce
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router;