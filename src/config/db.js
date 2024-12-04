const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { CONFIG } = require('./config');

async function connectDb() {
    try {
        mongoose.connect(CONFIG.dbUrl);
        console.log("Database Connected");
    } catch (error) {
        console.log("Database error", error);
    }
}

module.exports = {
    connectDb
}