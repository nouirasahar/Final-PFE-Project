const db = require('./dbConnection'); 
// function to delete Item in a table
const deleteItem = (table, id, callback) => {
  const query = `DELETE FROM ${table} WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) return callback(err);
    if (result.affectedRows > 0) {
      callback(null, { message: 'Item deleted successfully' });
    } else {
      callback(null, { message: 'Item not found' });
    }
  });
};
// function to delete  a table
const deleteTable = (tableName, callback) => {
  const query = `DROP TABLE IF EXISTS ??`;
  db.query(query, [tableName], (err, result) => {
    if (err) return callback(err);
    callback(null, { message: `Table '${tableName}' deleted successfully.` });
  });
};
module.exports = {deleteItem, deleteTable}; 
