import mongoose from 'mongoose'
import db from './db'
mongoose.Promise = global.Promise
const BundleSchema = new mongoose.Schema({
    partUserType: String,
    appType: String,
    baseType: String,
    businessType: String,
    utilityType: String,
    description: String,
    simDescription: String,
    resourceUrl: String,
    resourceId: {
        type: Number, 
        default: 0
    },
    bundleVersion: {
        type: String, 
        default: 'abcdeffasdddf'
    },
    beforeValue: String,
    forceValue: String,
    createdTime: String,
    updateTime: String,
    isDel: {
        type: Boolean,
        default: false
    }
});

export default db.model('bundle',BundleSchema);