const express = require('express'); 
const router = express.Router(); 
const db = require('../Controllers/dbConnection'); 
const { deleteItem,deleteTable  } = require('../Controllers/mysqlService');
router.get('/', (req, res) => { 
    res.send('Bienvenue sur ton API !'); 
  }); 
// Route pour récupérer les noms de toutes les tables
router.get('/tablenames', (req, res) => {
  // Requête pour obtenir les noms des tables
  db.query('SHOW TABLES', (err, results) => {
    if (err) {
      return res.status(500).send('Erreur serveur lors de la récupération des tables');
    }
    // Extraire uniquement les noms des tables (en prenant les valeurs de la colonne "Tables_in_ma_base")
    const tableNames = results.map(row => Object.values(row)[0]);
    // Retourner les noms des tables en réponse
    res.json(tableNames);
  });
});
// Route to fetch all data from all tables in the database 
router.get('/getall', (req, res) => { 
  // Étape 1 : Récupérer les noms de toutes les tables 
    db.query('SHOW TABLES', (err, tables) => { 
      if (err) { 
        return res.status(500).send('Erreur serveur lors de la récupération des tables'); 
      } 
      // Extraire uniquement les noms des tables 
      const tableNames = tables.map(table => Object.values(table)[0]); 
      // Étape 2 : Pour chaque table, récupérer ses données 
      const promises = tableNames.map(table => { 
        return new Promise((resolve, reject) => { 
          // Récupérer les données de chaque  
          db.query(`SELECT * FROM ${table}`, (err, data) => { 
            if (err) { 
              reject(`Erreur avec la table ${table}: ${err}`); 
            } else { 
              resolve({ table, data }); 
            } 
          }); 
        }); 
      }); 
      // Étape 3 : Attendre que toutes les données des tables soient récupérées 
      Promise.all(promises) 
        .then(results => { 
          // Créer un objet avec les données de toutes les tables 
          const allTablesData = results.reduce((acc, { table, data }) => { 
            acc[table] = data; 
            return acc; 
          }, {}); 
          // Retourner les données de toutes les tables en réponse 
          res.json(allTablesData); 
        }) 
        .catch(err => { 
          res.status(500).send(`Erreur lors de la récupération des données des tables: ${err}`); 
  }); 
    }); 
  }); 
// Route to delete an item from a specified table by id 
router.delete('/delete/:table/:id', (req, res) => { 
  const { table, id } = req.params; 
    deleteItem(table, id, (err, result) => { 
    if (err) {
      return res.status(500).json({ message: 'Error deleting item', error: err });
    }
    return res.status(200).json(result);
  });
});
// Route to delete a table
router.delete('/deleteTable/:tableName', (req, res) => {
  const { tableName } = req.params;
  deleteTable(tableName, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting table', error: err });
    }
    res.status(200).json(result);
  });
});
// Route to update  
router.put('/update/:table/:id', (req, res) => { 
 const { table, id } = req.params; 
 const updateData = req.body; 
 // Vérifie qu'on a bien des données à mettre à jour 
 if (!updateData || Object.keys(updateData).length === 0) { 
  return res.status(400).json({ error: 'Aucune donnée à mettre à jour' }); 
 } 
 // Préparer les colonnes et les valeurs pour l’UPDATE 
 const columns = Object.keys(updateData).map(key => `${key} = ?`).join(', '); 
 const values = Object.values(updateData); 
 // Construire la requête SQL 
 const sql = `UPDATE \`${table}\` SET ${columns} WHERE id = ?`; 
 const db = require('../Controllers/dbConnection'); 
 db.query(sql, [...values, id], (err, result) => { 
  if (err) { 
   return res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err }); 
  } 
  if (result.affectedRows === 0) { 
   return res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err }); 
  } 
  if (result.affectedRows === 0) { 
   return res.status(404).json({ message: 'Aucun enregistrement trouvé avec cet ID' }); 
  } 
  res.status(200).json({ message: 'Mise à jour réussie', result }); 
 }); 
}); 
module.exports = router; 
