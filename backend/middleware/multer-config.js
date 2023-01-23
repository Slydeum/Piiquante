// gére les fichiers envoyés par les utilisateurs


// import
const multer = require("multer");


// extensions des images autorisés
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// configure le chemin et le nom de fichier pour les fichiers entrants.
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => { // utilise le nom d'origine
    const name = file.originalname.split(" ").join("_"); // remplace les "espaces" par "_"
    const extension = MIME_TYPES[file.mimetype]; // extensions de fichier autorisées
    callback(null, name + Date.now() + "." + extension); // ajoute marqueur temporel au nom du fichier
  },
});

// fichier unique pour configuration et export (seulement des images)
module.exports = multer({ storage }).single("image");