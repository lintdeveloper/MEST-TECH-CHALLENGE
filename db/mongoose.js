const mongoose = require('mongoose');
const url = 'mongodb://localhost/ShoppingApp'
mongoose.Promise = global.Promise;

// Setup DB Connetion
mongoose.connect(url, {
    useNewUrlParser: true
});

//Setup event handlers for DB
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, "connection error"));

conn.once('open', () => {
    console.log('connected to a database');
});

module.exports = { mongoose };