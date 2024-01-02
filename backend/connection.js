const mongoose = require('mongoose');
require('dotenv').config();

const connection = () => {
    mongoose.connect(`mongodb://localhost:27017`, {
        dbName: process.env.DB_NAME,
    });
    const conn = mongoose.connection;
    conn.on('error', console.error.bind(console, 'Connection error :'));
    conn.once('open', () => {
        console.log('Connected to MongoDB')
    })
}

module.exports = connection;