import mongoose from 'mongoose'
import db from './db'
const autoIncrement = require('mongoose-auto-increment');

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
BundleSchema.plugin(autoIncrement.plugin, {
  model: 'bundle',
  field: 'resourceId',
  startAt: 0,
});
export default db.model('bundle',BundleSchema);