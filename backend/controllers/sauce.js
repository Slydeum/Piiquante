// systeme de gestion des sauces

// imports
const Sauce = require('../models/Sauce');
const fs = require('fs'); // interaction avec le système de fichiers


// créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch(error => res.status(400).json({ error }));
};

// modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch(error => res.status(400).json({ error }));
};

// supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => { // supprime l'image
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// afficher une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// like et dislike pour une sauce
exports.likeSauce = (req, res, _) => {
  switch (req.body.like) {
    case 0: // annule un like ou un dislike
      Sauce.findOne({ _id: req.params.id }) // récupère les informations
        .then((sauce) => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) { // annule like
            Sauce.updateOne({ _id: req.params.id }, {// met à jour
              $inc: { likes: -1 }, // décrémente la valeur
              $pull: { usersLiked: req.body.userId }  // supprime la valeur
            })
              .then(() => { res.status(201).json({ message: "validé" }); })
              .catch((error) => { res.status(400).json({ error }); });
          }
          if (sauce.usersDisliked.find(user => user === req.body.userId)) { // annule dislike
            Sauce.updateOne({ _id: req.params.id }, { // met à jour
              $inc: { dislikes: -1 }, // décrémente la valeur
              $pull: { usersDisliked: req.body.userId } // supprime la valeur
            })
              .then(() => { res.status(201).json({ message: "validé" }); })
              .catch((error) => { res.status(400).json({ error }); });
          }
        })
        .catch((error) => { res.status(404).json({ error }); });
      break;

    case 1: // like
      Sauce.updateOne({ _id: req.params.id }, { // met à jour
        $inc: { likes: 1 }, // incrémente la valeur
        $push: { usersLiked: req.body.userId } // ajoute la valeur
      })
        .then(() => { res.status(201).json({ message: "validé" }); })
        .catch((error) => { res.status(400).json({ error }); });
      break;

    case -1: // dislike
      Sauce.updateOne({ _id: req.params.id }, { // met à jour
        $inc: { dislikes: 1 }, // décrémente la valeur
        $push: { usersDisliked: req.body.userId } // supprime la valeur
      })
        .then(() => { res.status(201).json({ message: "validé" }); })
        .catch((error) => { res.status(400).json({ error }); });
      break;
    default:
      console.error("bad request");
  }
};