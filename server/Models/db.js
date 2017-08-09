const mongoose = require("mongoose");
import config from '../../config';
const autoIncrement = require('mongoose-auto-increment');

const db = mongoose.createConnection(`${config.dbaddr}:${config.dbport}/${config.db}`,{user:config.dbuser,pass:config.dbpwd});
autoIncrement.initialize(db);
db.once('open',()=>{
    console.log('we are connected to the database');
});
db.once('error',(err)=>{
    console.log('error',err);
});

export default db;
