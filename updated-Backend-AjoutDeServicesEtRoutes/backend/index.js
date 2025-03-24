const express = require('express'); 
var cors = require('cors'); 
const readline = require('readline'); 
const app = express(); 
const apiRoutes = require('./APIs'); 
var corsOptions = {  
    origin: 'http://localhost:4200',  // No trailing slash 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow necessary HTTP methods 
    allowedHeaders: ['Content-Type', 'Authorization']  // Allow necessary headers 
}; 
app.use(cors(corsOptions)); 
app.use(cors());  
app.use(express.json()); // Pour gérer les requêtes JSON 
// Use the API routes. 
app.use('/api', apiRoutes); 
//Démarrage du serveur  
const port = 3000; 
app.listen(port, () => { 
    console.log (`Server is running at http://localhost:${port}`);
}); 
const uri = 'mongodb://localhost:27017'; 
const dbName = 'DataTest'; 
//Configure readline pour lire les entrées et afficher des messages via la console.  
const rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
}); 
//Fonction pour demander les identifiants de connexion à l'utilisateur. 
function promptLogin() { 
    rl.question('Enter username: ', (username) => { 
        rl.question('Enter password: ', (password) => { 
            const validUsername = 'admin'; 
            const validPassword = 'admin123'; 
if (username === validUsername && password === validPassword) { 
                console.log('Login successful!'); 
                console.log('Server is running at http://localhost:3000'); 
                console.log('Available routes: /api/getall and /api/tables and /api/tablenames and /api/getItemById   /api/update/:table/:id'); 
            } else { 
                console.log('Invalid username or password.'); 
            } 
            rl.close(); 
        }); 
    }); 
} 
promptLogin(); 
