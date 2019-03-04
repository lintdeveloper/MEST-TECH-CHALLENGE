const mongoose = require('mongoose');
const url = 'mongodb://user1:user123@ds149732.mlab.com:49732/trippe_live'
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