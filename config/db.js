/*const { MongoClient } = require('mongodb');

const URL = 'mongodb+srv://nodeprogramer:F4by5!f5RU7YJ25@cluster0.odjfrd7.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=Cluster0'

let dbConnection

module.exports = {
    connectToDb: (cb) => {
        MongoClient
        .connect(URL)
        .then((client) => {
            console.log('Good db');
            dbConnection = client.db();
            return cb();
        })
        .catch((err) => {
            return cb(err);
        })
    },
    getDb: () => dbConnection,
}*/

const { MongoClient } = require('mongodb');

const URI = 'mongodb+srv://username:password@cluster0.odjfrd7.mongodb.net/sample_mflix?retryWrites=true';

let dbConnection;

module.exports = {
    connectToDb: async () => {
        try {
            const client = await MongoClient.connect(URI, { useNewUrlParser: true });
            console.log('Connected to MongoDB');
            dbConnection = client.db();
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
            throw err;
        }
    },
    getDb: () => dbConnection,
};
