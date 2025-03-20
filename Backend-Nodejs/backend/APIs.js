//Définit l'URI de connexion à la base de données MongoDB locale.  
const express = require('express'); 
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb'); 
const uri ='mongodb://localhost:27017'; 
const dbName ='DataTest'; 
//Fonction asynchrone qui connecte à MongoDB, récupère des données, et les retourne.  
async function fetchData() { 
    const client = new MongoClient(uri); 
    try { 
        await client.connect(); 
        console.log('Connected to MongoDB'); 
        const db = client.db(dbName); 
        const collections = await db.listCollections().toArray(); 
// parcourir 
        let data = {}; 
        for (const collectionInfo of collections) { 
            const collectionName = collectionInfo.name; 
            const collection = db.collection(collectionName); 
            // Fetch all documents from the collection
            const documents = await collection.find({}).toArray();
            //Store the documents in the data object
            data[collectionName] = documents;      
            } 
        return data; 
    } finally { 
        await client.close(); 
    } 
} 
// Fonction pour récupérer les noms des tables et leurs colonnes 
async function getTablesAndColumns() { 
    const client = new MongoClient(uri); 
    try { 
        await client.connect(); 
// Récupère une liste de toutes les collections dans la base de données
        const db = client.db(dbName); 
        const collections = await db.listCollections().toArray(); 
//Initialise un objet vide pour stocker les informations des tables et colonnes.  
        let tablesInfo = {}; 
        for (const collectionInfo of collections) { 
            const collectionName = collectionInfo.name; 
            const collection = db.collection(collectionName); 
// // Récupère le premier document pour identifier les colonnes
            const firstDocument = await collection.findOne({}); 
            if (firstDocument) { 
                tablesInfo[collectionName] = Object.keys(firstDocument); 
            } else { 
                tablesInfo[collectionName] = ['No columns (empty collection)']; 
            } 
        } 
//Retourne l'objet contenant les tables et leurs colonnes.
        return tablesInfo; 
    } finally { 
        await client.close(); 
    } 
} 
// Fonction pour récupérer uniquement les noms des tables  
async function getTableNames() {  
    const client = new MongoClient(uri);  
    try {  
        await client.connect();  
        const db = client.db(dbName);  
        // Récupère une liste de toutes les collections dans la base de données  
        const collections = await db.listCollections().toArray();  
        // Extrait uniquement les noms des collections  
        const tableNames = collections.map(collection => collection.name);  
        // Retourne un tableau avec les noms des tables 
        return tableNames; 
    } finally {  
        await client.close();  
    }  
}  
// API pour récupérer les noms des tables 
router.get('/tableNames', async (req, res) => { 
    try {  
        const tableNames = await getTableNames();  
        res.json(tableNames);  // Renvoie les noms des tables sous forme de tableau  
    } catch (err) {  
        console.error('Error in /api/tableNames:', err);  
        res.status(500).json({ error: 'Internal Server Error' });  
    }  
}); 
// Route pour récupérer toutes les données 
router.get('/getall', async (req, res) => {  
    try { 
        const data = await fetchData();   
        res.json(data); 
    } catch (err) { 
        console.error('Error in /api/getall:', err); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } 
}); 
router.get('/tables', async (req, res) => { 
    try { 
        const tablesInfo = await getTablesAndColumns(); 
        res.json(tablesInfo); 
    } catch (err) { 
        console.error('Error in /api/tables:', err); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } 
}); 
// Route pour mettre à jour un document dans une collection 
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
// Route pour supprimer un étudiant par ID 
// Route pour supprimer un document 
router.delete('/delete/:table/:id', async (req, res) => { 
    const client = new MongoClient(uri); 
    try { 
        await client.connect(); 
        const db = client.db(dbName); 
        const { table, id } = req.params; 
        console.log(`Received delete request for table: ${table}, ID: ${id}`); 
        let objectId; 
        try { 
            objectId = new ObjectId(id);  // Assurez-vous que l'ID est valide 
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
module.exports = router; 
