const express = require('express'); 
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb'); 
const uri ='mongodb://localhost:27017'; 
const dbName ='SchoolDB'; 
async function fetchData() { 
    const client = new MongoClient(uri); 
    try { 
        await client.connect(); 
        console.log('Connected to MongoDB'); 
        const db = client.db(dbName); 
        const collections = await db.listCollections().toArray(); 
// loop through 
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
// Function to retrieve only the table names  
async function getTableNames() {  
    const client = new MongoClient(uri);  
    try {  
        await client.connect();  
        const db = client.db(dbName);  
        // Retrieves a list of all collections in the database  
        const collections = await db.listCollections().toArray(); 
        // Extracts only the names of the collections  
        const tableNames = collections.map(collection => collection.name);  
        // Returns an array with the table names 
        return tableNames; 
    } finally {  
        await client.close();  
    }  
}  
async function deleteCollection(tableName) { 
    const client = new MongoClient(uri); 
    try { 
        await client.connect(); 
        const db = client.db(dbName); 
        const collections = await db.listCollections({ name: tableName }).toArray(); 
        if (collections.length === 0) { 
            return { success: false, message: 'Table not found' }; 
        } 
        await db.collection(tableName).drop(); 
        return { success: true, message: `Table '${tableName}' deleted successfully` }; 
    } catch (error) { 
        console.error(`Error deleting table '${tableName}':`, error); 
        throw error; 
    } finally { 
        await client.close(); 
    } 
} 
// services/mongodbService.js 
module.exports = { 
    fetchData, 
    getTableNames,deleteCollection 
}; 
