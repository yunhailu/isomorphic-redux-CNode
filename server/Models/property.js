import mongoose from 'mongoose'
import db from './db'
mongoose.Promise = global.Promise
const PropertySchema = new mongoose.Schema({
    type: String,
    value: String,
    isDel: {
        type: Boolean,
        default: false
    }
});

PropertySchema.methods.get = function(query,cb){
    if(query===null){
        return this.model('property').find(cb);
    }
    this.model('property').find(query,cb);
};

export default db.model('property',PropertySchema);