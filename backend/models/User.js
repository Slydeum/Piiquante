// schéma de données d'un utilisateur


const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// schéma
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// userSchema utilise uniqueValidator
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);