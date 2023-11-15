const { MongoClient } = require('mongodb')

const client = new MongoClient(process.env.MONGO_CONNECTION_URI)
let dbConnection;

module.exports = {
  connectToServer: async function () {
    try {
      await client.connect()
      dbConnection = client.db("collection-001")
      console.log("Successfully connected to MongoDB.")
    } catch (err) {
      console.error("Error connecting to MongoDB:", err)
      throw err; 
    }
  },

  getDb: function () {
    if (!dbConnection) {
      throw new Error("Database connection has not been established.")
    }
    return dbConnection
  },
};