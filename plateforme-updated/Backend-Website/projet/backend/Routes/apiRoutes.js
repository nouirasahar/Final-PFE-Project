const { deleteCollection } = require('../services/mongodbService');
const express = require('express'); 
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb'); 
const uri ='mongodb://localhost:27017'; 
const dbName ='SchoolDB';
const {
   fetchData,
   getTableNames,
} = require('../services/mongodbService');
// API to retrieve the table names 
router.get('/tableNames', async (req, res) => { 
    try {  
        const tableNames = await getTableNames();  
        res.json(tableNames);  // Returns the table names as an array  
    } catch (err) {  
        console.error('Error in /api/tableNames:', err);  
        res.status(500).json({ error: 'Internal Server Error' });  
    }  
}); 
// Route to retrieve all data 
router.get('/getall', async (req, res) => {  
    try { 
        const data = await fetchData();   
        res.json(data); 
    } catch (err) { 
        console.error('Error in /api/getall:', err); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } 
}); 
// Route to update a document in a collection 
router.put('/update/:table/:id', async (req, res) => { 
    const client = new MongoClient(uri); 
    try { 
        await client.connect(); 
        const db = client.db(dbName); 
        const { table, id } = req.params; 
        console.log(`Received update request for table: ${table}, ID: ${id}`); 
        console.log(`Data received for update:`, req.body); 
       // Convert ID to ObjectId 
        let objectId; 
        try { 
            objectId = new ObjectId(id); 
        } catch (error) { 
            return res.status(400).json({ error: 'Invalid ID format' }); 
        } 
        const collection = db.collection(table); 
        // Remove _id from update data 
        const updateData = { ...req.body }; 
        delete updateData._id;  
        const result = await collection.updateOne( 
            { _id: objectId },  
            { $set: updateData } 
        ); 
        if (result.matchedCount === 0) { 
            return res.status(404).json({ error: 'Document not found' }); 
        } 
        res.json({ message: 'Update successful' }); 
    } catch (err) { 
        console.error(`Error in /api/update:`, err); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } finally { 
        await client.close(); 
 } 
}); 
// Route to fetch a single item by ID 
router.get('/:table/:id', async (req, res) => { 
    const client = new MongoClient(uri); 
    try { 
        await client.connect(); 
        const db = client.db(dbName); 
        const { table, id } = req.params; 
        console.log(`Fetching from table: ${table}, ID: ${id}`); 
// Convert ID to ObjectId 
        let objectId; 
        try { 
            objectId = new ObjectId(id); 
        } catch (error) { 
            return res.status(400).json({ error: 'Invalid ID format' }); 
        } 
        const collection = db.collection(table); 
        const document = await collection.findOne({ _id: objectId }); 
        if (document) { 
            res.json(document); 
        } else { 
            res.status(404).json({ error: 'Item not found' }); 
        } 
    } catch (err) { 
        console.error(`Error fetching ${req.params.table} data:`, err); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } finally { 
        await client.close(); 
 } 
}); 
// Route to delete a document 
router.delete('/delete/:table/:id', async (req, res) => { 
    const client = new MongoClient(uri); 
    try { 
        await client.connect(); 
        const db = client.db(dbName); 
        const { table, id } = req.params; 
        console.log(`Received delete request for table: ${table}, ID: ${id}`); 
        let objectId; 
        try { 
            objectId = new ObjectId(id);  // Ensure the ID is valid 
        } catch (error) { 
            return res.status(400).json({ error: 'Invalid ID format' }); 
        } 
        const collection = db.collection(table); 
        const result = await collection.deleteOne({ _id: objectId }); 
        if (result.deletedCount === 0) { 
            return res.status(404).json({ error: 'Document not found' }); 
        } 
        res.json({ message: 'Delete successful' }); 
    } catch (err) { 
        console.error('Error in /api/delete:', err); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } finally { 
       await client.close(); 
    } 
}); 
router.delete('/delete/:table', async (req, res) => { 
    const { table } = req.params; 
    try { 
        const result = await deleteCollection(table); 
        if (!result.success) { 
            return res.status(404).json({ error: result.message }); 
        } 
        res.json({ message: result.message }); 
    } catch (err) { 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } 
}); 
module.exports = router; 
