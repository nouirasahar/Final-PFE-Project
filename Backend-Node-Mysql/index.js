//main 
const express = require('express');
const app = express();
const routes = require('./Routes/routes');

app.use(express.json());
app.use('/', routes);

app.listen(3000, () => {
  console.log('🚀 Serveur en écoute sur http://localhost:3000');
});
