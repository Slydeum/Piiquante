// systeme de gestion des sauces

// imports
const Sauce = require('../models/Sauce');
const fs = require('fs'); // interaction avec le système de fichiers


// crée une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); // transforme en json
  delete sauceObject._id; // supprime l'id par défault de mongoose
  const sauce = new Sauce({ // création de la sauce
    ...sauceObject, // corps de la requête
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // url de l'image
  });
  sauce.save() // sauvegarde
    .then(() => res.status(201).json({ message: 'enregistré !' }))
    .catch((error) => { res.status(400).json({ error: error }) })
};

// modifie une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? // compare aux fichiers existants
    {
      ...JSON.parse(req.body.sauce), // corps de la requête
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // image
    } : { ...req.body }; // 
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // mise à jour
    .then(() => res.status(200).json({ message: 'modifié !' }))
    .catch(error => res.status(400).json({ error: error }));
};

// affiche une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // trouve une sauce
    .then(sauce => res.status(200).json(sauce))
    .catch((error) => { res.status(404).json({ error: error }) })
};

// affiche toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find() // trouve les sauces
    .then(sauces => res.status(200).json(sauces))
    .catch((error) => { res.status(400).json({ error: error }) })
};

// supprime une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // trouve la sauce
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => { // supprime l'image
        Sauce.deleteOne({ _id: req.params.id }) // supprime la sauce
          .then(() => res.status(201).json({ message: 'supprimé !' }))
          .catch(error => res.status(400).json({ error: error }))
      });
    })
    .catch(error => res.status(500).json({ error: "erreur" }));
};

// like et dislike pour une sauce
exports.likeSauce = (req, res, _) => {
  switch (req.body.like) {
    case 0: // annule un like ou un dislike
      Sauce.findOne({ _id: req.params.id }) // récupère les informations
        .then((sauce) => {
          // annule like
          if (sauce.usersLiked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {// requête de mise à jour avec l'id
              $inc: { likes: -1 }, // décrémente la valeur
              $pull: { usersLiked: req.body.userId }  // supprime l'id de usersLiked
            })
              .then(() => { res.status(201).json({ message: "validé" }); })
              .catch((error) => { res.status(400).json({ error: "erreur" }); });
          }
          // annule dislike
          if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { // requête de mise à jour avec l'id
              $inc: { dislikes: -1 }, // décrémente la valeur
              $pull: { usersDisliked: req.body.userId } // supprime l'id de usersDisliked
            })
              .then(() => { res.status(201).json({ message: "validé" }); })
              .catch((error) => { res.status(400).json({ error: "erreur" }); });
          }
        })
        .catch((error) => { res.status(404).json({ error: "erreur" }); });
      break;

    case 1: // like
      Sauce.updateOne({ _id: req.params.id }, { // requête de mise à jour avec l'id
        $inc: { likes: 1 }, // incrémente la valeur
        $push: { usersLiked: req.body.userId } // ajoute l'id à userLiked
      })
        .then(() => { res.status(201).json({ message: "validé" }); })
        .catch((error) => { res.status(400).json({ error: "erreur" }); });
      break;

    case -1: // dislike
      Sauce.updateOne({ _id: req.params.id }, { // requête de mise à jour avec l'id
        $inc: { dislikes: 1 }, // décrémente la valeur
        $push: { usersDisliked: req.body.userId } // ajoute l'id à userDisliked
      })
        .then(() => { res.status(201).json({ message: "validé" }); })
        .catch((error) => { res.status(400).json({ error: "erreur" }); });
      break;
    default:
      console.error("erreur");
  }
};