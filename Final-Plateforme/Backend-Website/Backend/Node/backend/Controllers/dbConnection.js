const mysql = require('mysql2'); 
const connection = mysql.createConnection({ 
  host: 'localhost', 
  user: 'root', 
  password: 'admin123456789',
  database: 'datatest', 
  port: '3307',
}); 
connection.connect(err => { 
  if (err) throw err; 
  console.log(' Connecté à la base de données MySQL'); 
}); 
module.exports = connection; 
