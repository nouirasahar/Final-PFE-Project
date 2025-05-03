echo ===== Setting up Node.js Backend Mongodb =====
@echo off
:: Define the backend folder
set BACKEND_DIR=%~dp0backend
:: Define the Config and Routes directories
set CONFIG_DIR=%BACKEND_DIR%\Config
set ROUTES_DIR=%BACKEND_DIR%\Routes
:: Define file paths for Services.js, dbConnection.js, Routes.js and index.js
set SERVICE_FILE=%CONFIG_DIR%\services.js
set DB_FILE=%CONFIG_DIR%\dbConnection.js
set ROUTE_FILE=%ROUTES_DIR%\routes.js
set INDEX_FILE=%BACKEND_DIR%\index.js
::----------------------------------------------------
:: Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed! Please download it here: https://nodejs.org/
    exit /b
)
::---------------------------------------------------
:: Create the backend folder
if not exist "%BACKEND_DIR%" (
    mkdir "%BACKEND_DIR%"
    echo Backend folder created.
) else (
    echo Backend folder already exists.
)
:: Create the Config folder
if not exist "%CONFIG_DIR%" (
    mkdir "%CONFIG_DIR%"
    echo Config folder created.
) else (
    echo Config folder already exists.
)
:: Create the Routes  folder
if not exist "%ROUTES_DIR%" (
    mkdir "%ROUTES_DIR%"
    echo Routes folder created.
) else (
    echo Routes folder already exists.
)
::--------------------------------------------------------
:: Capture parameters
set "DB_URI=%~1"
set "DB_NAME=%~2"
set "PORT=%~3"
set "PASSWORD=%~4"
set "USERNAME=%~5"
::--------------------------------------------------------
:: Debugging: Print values to confirm they are correct 
echo DB URI: %DB_URI%
echo Database Name: %DB_NAME%
echo Username: %USERNAME%
echo Password: %PASSWORD%
echo port: %PORT%
::--------------------------------------------------------
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
echo     "mongodb": "^5.5.0", >> "%BACKEND_DIR%\package.json"
echo     "cors": "^2.8.5" >> "%BACKEND_DIR%\package.json"
echo   } >> "%BACKEND_DIR%\package.json"
echo } >> "%BACKEND_DIR%\package.json"
::---------------------------------------------------------
:: Creating index.js
echo Creating index.js...
echo const express = require('express');>> "%INDEX_FILE%"
echo const cors = require('cors'); >> "%INDEX_FILE%"
echo const app = express();>> "%INDEX_FILE%"
echo const apiRoutes = require('./Routes/routes.js');>> "%INDEX_FILE%"
echo app.use(express.json()); >> "%INDEX_FILE%"
echo // Active CORS >> "%INDEX_FILE%"
echo app.use(cors()); >> "%INDEX_FILE%"
echo app.use('/api', apiRoutes); >> "%INDEX_FILE%"

echo app.listen(3000, () =^> console.log('Server running on http://localhost:3000'));>> "%INDEX_FILE%"   
::------------------------------------------------
::creating dbConnection.js
echo const { MongoClient } = require('mongodb');>>"%DB_FILE%"
echo // Static credentials (empty if none)>>"%DB_FILE%"
echo const USER = '%USERNAME%', PASS = '%PASSWORD%';>>"%DB_FILE%"

echo let client;>>"%DB_FILE%"

echo async function connect({host='%DB_URI%', port= %PORT% , dbName='%DB_NAME%'}) {>>"%DB_FILE%"
echo   // Include "user:pass@" only when both are non-empty>>"%DB_FILE%"
echo   const auth = USER ^&^& PASS ^? `^${USER}:^${PASS}^@` : ''; >>"%DB_FILE%"
echo   const uri = `mongodb://${auth}${host}:${port}/${dbName}`;>>"%DB_FILE%"

echo   console.log(` Connecting to MongoDB at ${uri}`);>>"%DB_FILE%"
echo   try {>>"%DB_FILE%"
echo     if (client) {>>"%DB_FILE%"
echo       console.log('Closing previous connection');>>"%DB_FILE%"
echo       await client.close();>>"%DB_FILE%"
echo     }>>"%DB_FILE%"
echo     client = await MongoClient.connect(uri);>>"%DB_FILE%"
echo     console.log('Connection established');>>"%DB_FILE%"
echo     return client.db(dbName);>>"%DB_FILE%"
echo   } catch (err) {>>"%DB_FILE%"
echo     console.error('Connection failed:', err);>>"%DB_FILE%"
echo     throw err;>>"%DB_FILE%"
echo   }>>"%DB_FILE%"
echo }>>"%DB_FILE%"
echo module.exports = { connect };>>"%DB_FILE%"
echo dbConnection.js created 
echo index.js created.
::----------------------------------------
::creating Services.js File:
echo Creating Services.js...
echo const { connect } = require('./dbConnection.js'); // import connect function >>"%SERVICE_FILE%"
echo const { MongoClient, ObjectId } = require('mongodb'); >>"%SERVICE_FILE%"
echo async function fetchData() {>>"%SERVICE_FILE%"
echo   const db = await connect({ host:'%DB_URI%', port: %PORT% , dbName: '%DB_NAME%' }); >>"%SERVICE_FILE%"
echo   const data = {^};>>"%SERVICE_FILE%"
echo   for (const { name } of await db.listCollections().toArray())>>"%SERVICE_FILE%"
echo     data[name] = await db.collection(name).find().toArray();>>"%SERVICE_FILE%"
echo   return data;>>"%SERVICE_FILE%"
echo }>>"%SERVICE_FILE%"
echo //function to get only the table names>>"%SERVICE_FILE%"
echo async function getTableNames() {>>"%SERVICE_FILE%"
echo   return (await (await connect({ host: 'localhost', port: 27017, dbName: 'DBTest' }))>>"%SERVICE_FILE%"
echo     .listCollections().toArray()).map(c =^> c.name);>>"%SERVICE_FILE%"
echo } >>"%SERVICE_FILE%"
echo //function to get  an item with its id>>"%SERVICE_FILE%"
echo async function getItemById(collection, id) {>>"%SERVICE_FILE%"
echo   const db = await connect({^});>>"%SERVICE_FILE%"
echo   return db.collection(collection).findOne({ _id: new ObjectId(id) }); // Find one document by ID>>"%SERVICE_FILE%"
echo }>>"%SERVICE_FILE%"
echo async function updateItemById(collection, id, updateFields) { >>"%SERVICE_FILE%"
echo   const db = await connect({}); >>"%SERVICE_FILE%"
echo   // Log pour debug >>"%SERVICE_FILE%"
echo   console.log('Converting id to ObjectId, fields to update:', updateFields); >>"%SERVICE_FILE%"
echo   // Supprimer le champ _id pour éviter l'erreur Mongo>>"%SERVICE_FILE%"
echo   delete updateFields._id;>>"%SERVICE_FILE%"
echo   // Faire l'update>>"%SERVICE_FILE%"
echo   return db>>"%SERVICE_FILE%"
echo     .collection(collection)>>"%SERVICE_FILE%"
echo     .updateOne(>>"%SERVICE_FILE%"
echo       { _id: new ObjectId(id) }, >>"%SERVICE_FILE%"
echo       { $set: updateFields } >>"%SERVICE_FILE%"       
echo     );>>"%SERVICE_FILE%"
echo }>>"%SERVICE_FILE%"
echo //function to delete an item>>"%SERVICE_FILE%"
echo async function deleteItemById(collection, id) {>>"%SERVICE_FILE%"
echo   const db = await connect({^});>>"%SERVICE_FILE%"
echo   return db.collection(collection).deleteOne({ _id: new ObjectId(id) });>>"%SERVICE_FILE%"
echo }>>"%SERVICE_FILE%"
echo //function to delete a TABLE>>"%SERVICE_FILE%"
echo async function deleteCollectionByName(collectionName) {>>"%SERVICE_FILE%"
echo   const db = await connect({^});>>"%SERVICE_FILE%"
echo   return db.collection(collectionName).drop(^);  // Drops the entire collection>>"%SERVICE_FILE%"
echo }>>"%SERVICE_FILE%"

echo module.exports = { fetchData, getTableNames, updateItemById, deleteItemById, deleteCollectionByName, getItemById};>>"%SERVICE_FILE%"
echo services.js created

::--------------------------------------------------------------------------------
::creating Routes.js
echo const express = require('express');>> "%ROUTE_FILE%"
echo const router = express.Router(^);>> "%ROUTE_FILE%"
echo const { fetchData, getTableNames, updateItemById, deleteItemById, deleteCollectionByName, getItemById } = require('../Config/services.js');>> "%ROUTE_FILE%"

echo router.get('/getall', (req, res) =^> >> "%ROUTE_FILE%"
echo     fetchData().then(data =^> res.json(data)).catch(err =^> res.status(500).send('Erreur')) >> "%ROUTE_FILE%"
echo );>> "%ROUTE_FILE%"
echo //route to get the table names>> "%ROUTE_FILE%"
echo router.get('/tablenames', async (req, res) =^> {>> "%ROUTE_FILE%"
echo     try {>> "%ROUTE_FILE%"
echo         const names = await getTableNames();>> "%ROUTE_FILE%"
echo         console.log(names); //log names to see them >> "%ROUTE_FILE%"
echo         res.json(names);>> "%ROUTE_FILE%"
echo         } catch (err) {>> "%ROUTE_FILE%"
echo         console.error(err);>> "%ROUTE_FILE%"
echo         res.status(500).json({ error: 'Erreur serveur' });>> "%ROUTE_FILE%"
echo     }>> "%ROUTE_FILE%"
echo });>> "%ROUTE_FILE%"
echo //route to view an item with its id>> "%ROUTE_FILE%"
echo router.get('/:table/:id', async (req, res) =^> {>> "%ROUTE_FILE%"
echo     const { table, id } = req.params;>> "%ROUTE_FILE%"
echo     try {>> "%ROUTE_FILE%"
echo       const item = await getItemById(table, id);>> "%ROUTE_FILE%"
echo       if (!item) {>> "%ROUTE_FILE%"
echo         return res.status(404).json({ error: 'Item not found' });>> "%ROUTE_FILE%"
echo       }>> "%ROUTE_FILE%"
echo       res.json(item);>> "%ROUTE_FILE%"
echo     } catch (err) {>> "%ROUTE_FILE%"
echo       res.status(500).json({ error: 'Internal Server Error' });>> "%ROUTE_FILE%"
echo     }>> "%ROUTE_FILE%"
echo   });>> "%ROUTE_FILE%"
echo //rouute to update an item with its id >> "%ROUTE_FILE%"
echo router.put('/update/:table/:id', async (req, res) =^> {>> "%ROUTE_FILE%"
echo     try {>> "%ROUTE_FILE%"
echo       console.log('Received PUT /update', req.params, 'body:', req.body);>> "%ROUTE_FILE%"
echo       const result = await updateItemById(req.params.table, req.params.id, req.body);>> "%ROUTE_FILE%"
echo       const success = result.modifiedCount ^> 0;>> "%ROUTE_FILE%"
echo       res.json({ success, matched: result.matchedCount, modified: result.modifiedCount });>> "%ROUTE_FILE%"
echo     } catch (err) {>> "%ROUTE_FILE%"
echo       console.error('Error during update:', err);>> "%ROUTE_FILE%"
echo       res.status(500).json({ success: false, error: err.message });>> "%ROUTE_FILE%"
echo     }>> "%ROUTE_FILE%"
echo   });>> "%ROUTE_FILE%"
echo   //route to delete an item with its id >> "%ROUTE_FILE%"
echo   router.delete('/delete/:table/:id', (req, res) =^> {>> "%ROUTE_FILE%"
echo     deleteItemById(req.params.table, req.params.id)>> "%ROUTE_FILE%"
echo       .then(result =^> res.json(result))>> "%ROUTE_FILE%"
echo       .catch(err =^> res.status(500).json({ error: err.message }));>> "%ROUTE_FILE%"
echo   });>> "%ROUTE_FILE%"
echo //route to delete a TABLE >> "%ROUTE_FILE%"
echo router.delete('/delete/:table', async (req, res) =^> {>> "%ROUTE_FILE%"
echo     try {>> "%ROUTE_FILE%"
echo       await deleteCollectionByName(req.params.table);>> "%ROUTE_FILE%"
echo       res.json({ message: `${req.params.table} collection dropped successfully` });>> "%ROUTE_FILE%"
echo     } catch (err) {>> "%ROUTE_FILE%"
echo       res.status(500).json({ error: 'Failed to drop collection' });>> "%ROUTE_FILE%"
echo     }>> "%ROUTE_FILE%"
echo   });>> "%ROUTE_FILE%"
echo module.exports = router;>> "%ROUTE_FILE%"
echo routes.js created
::-------------------------------------------------------
cd /d "%BACKEND_DIR%"
echo // Installing dependencies, please wait!
:: Run npm install 
call npm install express mongodb cors
echo Dependencies installed successfully!
:: Define script path
set "SCRIPT_PATH=%~dp0backend"
:: Check if index.js exists
if not exist "%SCRIPT_PATH%" (
    echo Script file not found: %SCRIPT_PATH%
    exit /b
)
:: Start the Node.js server
echo Starting the Node.js server...
start node index.js

echo Server is running at http://localhost:3000