const { MongoClient } = require('mongodb');
// Static credentials (empty if none)
const USER = '', PASS = '';
let client;
async function connect({host='localhost', port= 27017 , dbName='DBTest'}) {
  // Include "user:pass@" only when both are non-empty
  const auth = USER && PASS ? `${USER}:${PASS}@` : ''; 
  const uri = `mongodb://${auth}${host}:${port}/${dbName}`;
  console.log(` Connecting to MongoDB at ${uri}`);
  try {
    if (client) {
      console.log('Closing previous connection');
      await client.close();
    }
    client = await MongoClient.connect(uri);
    console.log('Connection established');
    return client.db(dbName);
  } catch (err) {
    console.error('Connection failed:', err);
    throw err;
  }
}
module.exports = { connect };
