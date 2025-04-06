const db = require('./db');

// Fonction pour obtenir tous les utilisateurs
const getAllUsers = (callback) => {
  db.query('SELECT * FROM utilisateurs', (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Fonction pour ajouter un utilisateur
const addUser = (nom, email, age, callback) => {
  const query = 'INSERT INTO utilisateurs (nom, email, age) VALUES (?, ?, ?)'; // Requête SQL pour ajouter un utilisateur

  // Exécuter la requête SQL avec les données de l'utilisateur
  db.query(query, [nom, email, age], (err, result) => {
    if (err) {
      return callback(err); // Si erreur, appeler le callback avec l'erreur
    }
    callback(null, result); // Si succès, appeler le callback avec le résultat
  });
};

// Exporter les deux fonctions dans un seul objet
module.exports = { addUser, getAllUsers };
