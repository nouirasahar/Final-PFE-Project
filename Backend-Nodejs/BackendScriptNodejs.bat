@echo off
echo ===== Setting up Node.js Backend =====

:: Define the backend folder
set BACKEND_DIR=%~dp0backend

:: Define the index.js file path
set INDEX_FILE=%BACKEND_DIR%\index.js

:: Define the API file path
set APIFILE=%BACKEND_DIR%\APIs.js

:: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed! Please download it here: https://nodejs.org/
    exit /b
)

:: Create the backend folder
if not exist "%BACKEND_DIR%" (
    mkdir "%BACKEND_DIR%"
    echo Backend folder created.
) else (
    echo Backend folder already exists.
)

:: Prompt user for MongoDB URI
set /p MONGODB_URI=Enter MongoDB URI (e.g., mongodb://localhost:27017): 
set /p MONGODB_name=Enter MongoDB name (e.g., SchoolDB): 
:: Create package.json
echo Creating package.json...
echo { > "%BACKEND_DIR%\package.json"
echo   "name": "backend", >> "%BACKEND_DIR%\package.json"
echo   "version": "1.0.0", >> "%BACKEND_DIR%\package.json"
echo   "main": "index.js", >> "%BACKEND_DIR%\package.json"
echo   "type": "commonjs", >> "%BACKEND_DIR%\package.json"
echo   "scripts": { >> "%BACKEND_DIR%\package.json"
echo     "start": "node index.js" >> "%BACKEND_DIR%\package.json"
echo   }, >> "%BACKEND_DIR%\package.json"
echo   "dependencies": { >> "%BACKEND_DIR%\package.json"
echo     "express": "^4.18.2", >> "%BACKEND_DIR%\package.json"
echo     "mongodb": "^5.5.0" >> "%BACKEND_DIR%\package.json"
echo   } >> "%BACKEND_DIR%\package.json"
echo } >> "%BACKEND_DIR%\package.json"

::---------------------------------------------------------
:: Create index.js

echo Creating index.js...
echo const express = require('express'); >> "%INDEX_FILE%"
echo var cors = require('cors'); >> "%INDEX_FILE%"

echo const readline = require('readline'); >> "%INDEX_FILE%"
echo const app = express(); >> "%INDEX_FILE%"
echo const apiRoutes = require('./APIs'); >> "%INDEX_FILE%"
echo var corsOptions = {  >> "%INDEX_FILE%"
echo     origin: 'http://localhost:4200',  // No trailing slash >> "%INDEX_FILE%"
echo     methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow necessary HTTP methods >> "%INDEX_FILE%"
echo     allowedHeaders: ['Content-Type', 'Authorization']  // Allow necessary headers >> "%INDEX_FILE%"
echo }; >> "%INDEX_FILE%"

echo app.use(cors(corsOptions)); >> "%INDEX_FILE%"

echo app.use(cors());  >> "%INDEX_FILE%"
echo app.use(express.json()); // Pour gérer les requêtes JSON >> "%INDEX_FILE%"

echo // Use the API routes. >> "%INDEX_FILE%"
echo app.use('/api', apiRoutes); >>"%INDEX_FILE%"

echo //Démarrage du serveur  >> "%INDEX_FILE%"
echo const port = 3000; >> "%INDEX_FILE%"
echo app.listen(port, () =^> { >> "%INDEX_FILE%"
echo     console.log (`Server is running at http://localhost:${port}`);>> "%INDEX_FILE%"
echo }); >> "%INDEX_FILE%"


echo //Définit l'URI de connexion à la base de données MongoDB locale.  >>"%APIFILE%"
echo const uri = '%MONGODB_URI%'; >> "%INDEX_FILE%"
echo const dbName = '%MONGODB_name%'; >> "%INDEX_FILE%"

echo //Configure readline pour lire les entrées et afficher des messages via la console.  >> "%INDEX_FILE%"
echo const rl = readline.createInterface({ >> "%INDEX_FILE%"
echo     input: process.stdin, >> "%INDEX_FILE%"
echo     output: process.stdout >> "%INDEX_FILE%"
echo }); >> "%INDEX_FILE%"


echo //Fonction pour demander les identifiants de connexion à l'utilisateur. >> "%INDEX_FILE%"
echo function promptLogin() { >> "%INDEX_FILE%"
echo     rl.question('Enter username: ', (username) =^> { >> "%INDEX_FILE%"
echo         rl.question('Enter password: ', (password) =^> { >> "%INDEX_FILE%"
echo             const validUsername = 'admin'; >> "%INDEX_FILE%"
echo             const validPassword = 'admin123'; >> "%INDEX_FILE%"
echo if (username === validUsername ^&^& password === validPassword^) { >> "%INDEX_FILE%"
echo                 console.log('Login successful!'); >> "%INDEX_FILE%"
echo                 console.log('Server is running at http://localhost:3000'); >> "%INDEX_FILE%"
echo                 console.log('Available routes: /api/getall and /api/tables and /api/tablenames and /api/getItemById   /api/update/:table/:id'); >> "%INDEX_FILE%"
echo             } else { >> "%INDEX_FILE%"
echo                 console.log('Invalid username or password.'); >> "%INDEX_FILE%"
echo             } >> "%INDEX_FILE%"
echo             rl.close(); >> "%INDEX_FILE%"
echo         }); >> "%INDEX_FILE%"
echo     }); >> "%INDEX_FILE%"
echo } >> "%INDEX_FILE%"
echo promptLogin(); >> "%INDEX_FILE%"



echo index.js created.

::----------------------------------------
::creating APIs File:
echo Creating APIs.js...
echo const express = require('express'); >> "%APIFILE%"
echo const router = express.Router();>>  "%APIFILE%"
echo const { MongoClient, ObjectId } = require('mongodb'); >>  "%APIFILE%"
echo const uri ='%MONGODB_URI%'; >> "%APIFILE%"
echo const dbName ='%MONGODB_name%'; >> "%APIFILE%"

echo //Fonction asynchrone qui connecte à MongoDB, récupère des données, et les retourne.  >> "%APIFILE%"
echo async function fetchData() { >> "%APIFILE%"
echo     const client = new MongoClient(uri); >> "%APIFILE%"
echo     try { >> "%APIFILE%"
echo         await client.connect(); >> "%APIFILE%"
echo         console.log('Connected to MongoDB'); >> "%APIFILE%"
echo         const db = client.db(dbName); >> "%APIFILE%"
echo         const collections = await db.listCollections().toArray(); >> "%APIFILE%"

echo // parcourir >> "%APIFILE%"
echo         let data = {}; >> "%APIFILE%"
echo         for (const collectionInfo of collections) { >> "%APIFILE%"
echo             const collectionName = collectionInfo.name; >> "%APIFILE%"
echo             const collection = db.collection(collectionName); >> "%APIFILE%"
echo             // Fetch all documents from the collection>> "%APIFILE%"
echo             const documents = await collection.find({}).toArray();>> "%APIFILE%"
echo             //Store the documents in the data object>> "%APIFILE%"
echo             data[collectionName] = documents; >> "%APIFILE%"     
echo             } >> "%APIFILE%"
echo         return data; >>"%APIFILE%"
echo     } finally { >> "%APIFILE%"
echo         await client.close(); >> "%APIFILE%"
echo     } >> "%APIFILE%"
echo } >> "%APIFILE%"



echo // Fonction pour récupérer les noms des tables et leurs colonnes >> "%APIFILE%"
echo async function getTablesAndColumns() { >> "%APIFILE%"
echo     const client = new MongoClient(uri); >> "%APIFILE%"
echo     try { >> "%APIFILE%"
echo         await client.connect(); >> "%APIFILE%"
echo // Récupère une liste de toutes les collections dans la base de données>> "%APIFILE%"
echo         const db = client.db(dbName); >> "%APIFILE%"
echo         const collections = await db.listCollections().toArray(); >> "%APIFILE%"
echo //Initialise un objet vide pour stocker les informations des tables et colonnes.  >> "%APIFILE%"
echo         let tablesInfo = {}; >> "%APIFILE%"
echo         for (const collectionInfo of collections) { >> "%APIFILE%"
echo             const collectionName = collectionInfo.name; >> "%APIFILE%"
echo             const collection = db.collection(collectionName); >> "%APIFILE%"
echo // // Récupère le premier document pour identifier les colonnes>> "%APIFILE%"
echo             const firstDocument = await collection.findOne({}); >> "%APIFILE%"
echo             if (firstDocument) { >> "%APIFILE%"
echo                 tablesInfo[collectionName] = Object.keys(firstDocument); >> "%APIFILE%"
echo             } else { >> "%APIFILE%"
echo                 tablesInfo[collectionName] = ['No columns (empty collection)']; >> "%APIFILE%"
echo             } >> "%APIFILE%"
echo         } >> "%APIFILE%"
echo //Retourne l'objet contenant les tables et leurs colonnes.>> "%APIFILE%"
echo         return tablesInfo; >> "%APIFILE%"
echo     } finally { >> "%APIFILE%"
echo         await client.close(); >> "%APIFILE%"
echo     } >> "%APIFILE%"
echo } >> "%APIFILE%"

echo // Fonction pour récupérer uniquement les noms des tables >> "%APIFILE%" 
echo async function getTableNames() {  >> "%APIFILE%"
echo     const client = new MongoClient(uri);  >> "%APIFILE%"
echo     try {  >> "%APIFILE%"
echo         await client.connect();  >> "%APIFILE%"
echo         const db = client.db(dbName);  >> "%APIFILE%"
echo         // Récupère une liste de toutes les collections dans la base de données  >> "%APIFILE%"
echo         const collections = await db.listCollections().toArray(); >> "%APIFILE%" 
        
echo         // Extrait uniquement les noms des collections  >> "%APIFILE%"
echo         const tableNames = collections.map(collection =^> collection.name);  >> "%APIFILE%"
        
echo         // Retourne un tableau avec les noms des tables >> "%APIFILE%"
echo         return tableNames; >> "%APIFILE%"
echo     } finally {  >> "%APIFILE%"
echo         await client.close();  >> "%APIFILE%"
echo     }  >> "%APIFILE%"
echo }  >> "%APIFILE%"

echo // API pour récupérer les noms des tables >> "%APIFILE%"
echo router.get^('/tableNames', async ^(req, res^) =^> { >> "%APIFILE%"
echo     try {  >> "%APIFILE%"
echo         const tableNames = await getTableNames();  >> "%APIFILE%"
echo         res.json^(tableNames^);  // Renvoie les noms des tables sous forme de tableau  >> "%APIFILE%"
echo     } catch ^(err^) {  >> "%APIFILE%"
echo         console.error('Error in /api/tableNames:', err);  >> "%APIFILE%"
echo         res.status^(500^).json^({ error: 'Internal Server Error' }^);  >> "%APIFILE%"
echo     }  >> "%APIFILE%"
echo }); >> "%APIFILE%"


echo // Route pour récupérer toutes les données >> "%APIFILE%"
echo router.get^('/getall', async ^(req, res^) =^> {  >> "%APIFILE%"
echo     try { >> "%APIFILE%"
echo         const data = await fetchData^(^);   >> "%APIFILE%"
echo         res.json^(data^); >> "%APIFILE%"
echo     } catch ^(err^) { >> "%APIFILE%"
echo         console.error^('Error in /api/getall:', err^); >> "%APIFILE%"
echo         res.status^(500^).json^({ error: 'Internal Server Error' }^); >> "%APIFILE%"
echo     } >> "%APIFILE%"
echo }^); >> "%APIFILE%"

echo router.get('/tables', async (req, res) =^> { >> "%APIFILE%"
echo     try { >> "%APIFILE%"
echo         const tablesInfo = await getTablesAndColumns(); >> "%APIFILE%"
echo         res.json(tablesInfo); >> "%APIFILE%"
echo     } catch ^(err^) { >> "%APIFILE%"
echo         console.error('Error in /api/tables:', err); >> "%APIFILE%"
echo         res.status(500).json({ error: 'Internal Server Error' }); >> "%APIFILE%"
echo     } >> "%APIFILE%"
echo }); >> "%APIFILE%"
echo // Route pour mettre à jour un document dans une collection >> "%APIFILE%"
echo router.put^('/update/:table/:id', async ^(req, res^) =^> { >> "%APIFILE%"
echo     const client = new MongoClient^(uri^); >> "%APIFILE%"
echo     try { >> "%APIFILE%"
echo         await client.connect^(^); >> "%APIFILE%"
echo         const db = client.db^(dbName^); >> "%APIFILE%"
echo         const { table, id } = req.params; >> "%APIFILE%"

echo         console.log(`Received update request for table: ${table}, ID: ${id}`); >> "%APIFILE%"
echo         console.log(`Data received for update:`, req.body); >> "%APIFILE%"

echo        // Convert ID to ObjectId >> "%APIFILE%"
echo         let objectId; >> "%APIFILE%"
echo         try { >> "%APIFILE%"
echo             objectId = new ObjectId^(id^); >> "%APIFILE%"
echo         } catch ^(error^) { >> "%APIFILE%"
echo             return res.status^(400^).json^({ error: 'Invalid ID format' }^); >> "%APIFILE%"
echo         } >> "%APIFILE%"

echo         const collection = db.collection^(table^); >> "%APIFILE%"

echo         // Remove _id from update data >> "%APIFILE%"
echo         const updateData = { ...req.body }; >> "%APIFILE%"
echo         delete updateData._id;  >> "%APIFILE%" 

echo         const result = await collection.updateOne^( >> "%APIFILE%"
echo             { _id: objectId },  >> "%APIFILE%"
echo             { $set: updateData } >> "%APIFILE%"
echo         ^); >> "%APIFILE%"

echo         if ^(result.matchedCount === 0^) { >> "%APIFILE%"
echo             return res.status^(404^).json^({ error: 'Document not found' }^); >> "%APIFILE%"
echo         } >> "%APIFILE%"

echo         res.json^({ message: 'Update successful' }^); >> "%APIFILE%"
echo     } catch ^(err^) { >> "%APIFILE%"
echo         console.error^(`Error in /api/update:`, err^); >> "%APIFILE%"
echo         res.status^(500^).json^({ error: 'Internal Server Error' }^); >> "%APIFILE%"
echo     } finally { >> "%APIFILE%"
echo         await client.close^(^); >> "%APIFILE%"
echo  } >> "%APIFILE%"
echo }); >> "%APIFILE%"

echo // Route to fetch a single item by ID >> "%APIFILE%"
echo router.get^('/:table/:id', async ^(req, res^) =^> { >> "%APIFILE%"
echo     const client = new MongoClient^(uri^); >> "%APIFILE%"
echo     try { >> "%APIFILE%"
echo         await client.connect^(^); >> "%APIFILE%"
echo         const db = client.db^(dbName^); >> "%APIFILE%"
echo         const { table, id } = req.params; >> "%APIFILE%"

echo         console.log^(`Fetching from table: ${table}, ID: ${id}`^); >> "%APIFILE%"

echo // Convert ID to ObjectId >> "%APIFILE%"
echo         let objectId; >> "%APIFILE%"
echo         try { >> "%APIFILE%"
echo             objectId = new ObjectId^(id^); >> "%APIFILE%"
echo         } catch ^(error^) { >> "%APIFILE%"
echo             return res.status^(400^).json^({ error: 'Invalid ID format' }^); >> "%APIFILE%"
echo         } >> "%APIFILE%"

echo         const collection = db.collection^(table^); >> "%APIFILE%"
echo         const document = await collection.findOne^({ _id: objectId }^); >> "%APIFILE%"

echo         if ^(document^) { >> "%APIFILE%"
echo             res.json^(document^); >> "%APIFILE%"
echo         } else { >> "%APIFILE%"
echo             res.status^(404^).json^({ error: 'Item not found' }^); >> "%APIFILE%"
echo         } >> "%APIFILE%"
echo     } catch ^(err^) { >> "%APIFILE%"
echo         console.error^(`Error fetching ${req.params.table} data:`, err^); >> "%APIFILE%"
echo         res.status^(500^).json^({ error: 'Internal Server Error' }^); >> "%APIFILE%"
echo     } finally { >> "%APIFILE%"
echo         await client.close^(^); >> "%APIFILE%"
echo  } >> "%APIFILE%"
echo }^); >> "%APIFILE%"

echo // Route pour supprimer un étudiant par ID >> "%APIFILE%"
echo // Route pour supprimer un document >> "%APIFILE%"
echo router.delete^('/delete/:table/:id', async ^(req, res^) =^> { >> "%APIFILE%"
echo     const client = new MongoClient^(uri^); >> "%APIFILE%"
echo     try { >> "%APIFILE%"
echo         await client.connect^(^); >> "%APIFILE%"
echo         const db = client.db^(dbName^); >> "%APIFILE%"
echo         const { table, id } = req.params; >> "%APIFILE%"
echo         console.log^(`Received delete request for table: ${table}, ID: ${id}`^); >> "%APIFILE%"

echo         let objectId; >> "%APIFILE%"
echo         try { >> "%APIFILE%"
echo             objectId = new ObjectId^(id^);  // Assurez-vous que l'ID est valide >> "%APIFILE%"
echo         } catch ^(error^) { >> "%APIFILE%"
echo             return res.status^(400^).json^({ error: 'Invalid ID format' }^); >> "%APIFILE%"
echo         } >> "%APIFILE%"

echo         const collection = db.collection^(table^); >> "%APIFILE%"
echo         const result = await collection.deleteOne^({ _id: objectId }^); >> "%APIFILE%"

echo         if ^(result.deletedCount === 0^) { >> "%APIFILE%"
echo             return res.status^(404^).json^({ error: 'Document not found' }^); >> "%APIFILE%"
echo         } >> "%APIFILE%"

echo         res.json^({ message: 'Delete successful' }^); >> "%APIFILE%"
echo     } catch ^(err^) { >> "%APIFILE%"
echo         console.error^('Error in /api/delete:', err^); >> "%APIFILE%"
echo         res.status^(500^).json^({ error: 'Internal Server Error' }^); >> "%APIFILE%"
echo     } finally { >> "%APIFILE%"
echo        await client.close^(^); >> "%APIFILE%"
echo     } >> "%APIFILE%"
echo }^); >> "%APIFILE%"

echo router.delete^('/delete/:table', async ^(req, res^) =^> { >> "%APIFILE%"
echo     const client = new MongoClient^(uri^); >> "%APIFILE%"
echo     try { >> "%APIFILE%"
echo         await client.connect^(^); >> "%APIFILE%"
echo         const db = client.db^(dbName^); >> "%APIFILE%"
echo         const { table } = req.params; >> "%APIFILE%"
echo         const collections = await db.listCollections^({ name: table }^).toArray^(^); >> "%APIFILE%"
echo         if ^(collections.length === 0^) { >> "%APIFILE%"
echo             return res.status^(404^).json^({ error: 'Table not found' }^);  // Assurez-vous que l'ID est valide >> "%APIFILE%"
echo         } >> "%APIFILE%"
echo             // Drop the collection >> "%APIFILE%"
echo         await db.collection^(table^).drop^(^); >> "%APIFILE%"
echo         res.json^({ message: `Table '${table}' deleted successfully` }^); >> "%APIFILE%"
echo         } catch ^(err^) { >> "%APIFILE%"
echo         console.error^(`Error deleting table '${req.params.table}':`, err^); >> "%APIFILE%"
echo            res.status^(500^).json^({ error: 'Internal Server Error' }^); >> "%APIFILE%"
echo         } finally { >> "%APIFILE%"
echo         await client.close^(^); >> "%APIFILE%"
echo         } >> "%APIFILE%"
echo }^); >> "%APIFILE%"
echo module.exports = router; >> "%APIFILE%"
echo APIs created

cd /d "%BACKEND_DIR%"
echo //installing dependencies please wait!
npm install cors


::----------------------------------------------------
:: Install dependencies
cd /d "%BACKEND_DIR%"
if exist node_modules (
    echo Reinstalling dependencies...
    rd /s /q node_modules
)
npm install



echo ===== Setup Completed =====
echo To start the server, run the following commands:
echo cd "%BACKEND_DIR%"
echo node index.js
pause