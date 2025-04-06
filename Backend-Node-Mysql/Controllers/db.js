//ici on definit la base de donnes 
//URI + Nom de la base de donées
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',      // laisse vide si tu n'as pas mis de mot de passe
  database: 'ma_base'
});

connection.connect(err => {
  if (err) throw err;
  console.log('✅ Connecté à la base de données MySQL');
});

module.exports = connection;
