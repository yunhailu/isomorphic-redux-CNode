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
    bundleName: {
        ios: {
            baseName: String,
            projectName: String
        },
        android: {
            baseName: String,
            projectName: String
        }
    },
    beforeValue: String,
    forceValue: String,
    createdTime: String,
    updateInfo: Array,
    isUseOldDependency: String,
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

BundleSchema
    .virtual('bundleNameDisplay')
    .get(function () {
        return Object.values(this.bundleName);
    });
export default db.model('bundle',BundleSchema);