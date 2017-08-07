import mongoose from 'mongoose'
import db from './db'
import Q from 'q';

mongoose.Promise = global.Promise
const UserSchema = new mongoose.Schema({
    name: String,
    email:String,
    id: String,
    company: String
});

const cb = (err, data) => {
    const deferred = Q.defer();
    if(err){
        deferred.reject(err);
    } else {
        deferred.resolve(data);
    }
    return deferred.promise;
};

UserSchema.methods.getCustomers = function(query){
    if(query === null){
        return this.model('customers').find(cb);
    }
    return this.model('customers').findOne(query, cb);
};

export default db.model('customers', UserSchema);
