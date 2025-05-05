const express = require('express');
const router = express.Router();
const { fetchData, getTableNames, updateItemById, deleteItemById, deleteCollectionByName, getItemById } = require('../Config/services.js');
router.get('/getall', (req, res) => 
    fetchData().then(data => res.json(data)).catch(err => res.status(500).send('Erreur')) 
);
//route to get the table names
router.get('/tablenames', async (req, res) => {
    try {
        const names = await getTableNames();
        console.log(names); //log names to see them 
        res.json(names);
        } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
//route to view an item with its id
router.get('/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    try {
      const item = await getItemById(table, id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
//rouute to update an item with its id 
router.put('/update/:table/:id', async (req, res) => {
    try {
      console.log('Received PUT /update', req.params, 'body:', req.body);
      const result = await updateItemById(req.params.table, req.params.id, req.body);
      const success = result.modifiedCount > 0;
      res.json({ success, matched: result.matchedCount, modified: result.modifiedCount });
    } catch (err) {
      console.error('Error during update:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });
  //route to delete an item with its id 
  router.delete('/delete/:table/:id', (req, res) => {
    deleteItemById(req.params.table, req.params.id)
      .then(result => res.json(result))
      .catch(err => res.status(500).json({ error: err.message }));
  });
//route to delete a TABLE 
router.delete('/delete/:table', async (req, res) => {
    try {
      await deleteCollectionByName(req.params.table);
      res.json({ message: `${req.params.table} collection dropped successfully` });
    } catch (err) {
      res.status(500).json({ error: 'Failed to drop collection' });
    }
  });
module.exports = router;
