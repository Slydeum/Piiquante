// vérifie la validité du token


// import
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // récupère le token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // vérifie le token avec une clé
    const userId = decodedToken.userId; // vérifie si le token est le même que celui de l'id
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Utilisateur non autorisé';
    } else {
      next(); // continue avec une route sauce
    }
  } catch {
    res.status(401).json({
      error: new Error('Requête invalide!')
    });
  }
};