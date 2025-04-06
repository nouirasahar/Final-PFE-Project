//ici on ecrit les routes 
//on definit les endpoints
const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../Controllers/mysqlservice');
const { addUser } = require('../Controllers/mysqlservice'); // 1. Importer la fonction d'ajout d'utilisateur

// ✅ Route test (http://localhost:3000/)
router.get('/', (req, res) => {
    res.send('Bienvenue sur mon API !');
  });
  
router.get('/all', (req, res) => {
  getAllUsers((err, data) => {
    if (err) return res.status(500).send('Erreur serveur');
    res.json(data);
  });
});

// 2. Définir la route POST pour ajouter un utilisateur
router.post('/add', (req, res) => {
  const { nom, email, age } = req.body; // 3. Récupérer les données envoyées dans le corps de la requête

  addUser(nom, email, age, (err, result) => {
    if (err) {
      return res.status(500).send('Erreur serveur'); // 4. Si erreur, renvoyer un message d'erreur
    }
    res.status(201).json(result); // 5. Si succès, envoyer la réponse avec le résultat
  });
});
module.exports = router;
