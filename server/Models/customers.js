import mongoose from 'mongoose'
import db from './db'
mongoose.Promise = global.Promise
const UserSchema = new mongoose.Schema({
    name: String,
    email:String,
    id: String,
    company: String
});
UserSchema.methods.getCustomers = function(query,cb){
    if(query === null){
        return this.model('customers').find(cb);
    }
    this.model('customers').findOne(query,cb);
};

export default db.model('customers',UserSchema);
