import mongoose from 'mongoose'
import db from './db'
mongoose.Promise = global.Promise
const PropertySchema = new mongoose.Schema({
    businessValue:Array,
    appValue:Array,
    utilityValue:Array,
    baseValue:Array
});
PropertySchema.methods.saveProperty = function(property,cb){
    let propsValue = property.propertyvalue;
    let propsType = property.propertytype;
    console.log('propsType-server',propsType);
    console.log('this',this);
    
    switch(propsType){
        case 'business':
            // !!(this.businessValue.indexOf(propsValue) == -1) && this.businessValue.push(propsValue)
            PropertySchema.businessValue.push(propsValue);
            break;
        case 'app':
            // !!(this.appValue.indexOf(propsValue) == -1) && this.appValue.push(propsValue)
            PropertySchema.appValue.push(propsValue);
            break;
        case 'utility':
            // !!(this.utilityValue.indexOf(propsValue) == -1) && this.utilityValue.push(propsValue)
            // db.properties.utilityValue.push(propsValue);
            this.utilityValue = propsValue;
            break;
        case 'base':
            // !!(this.baseValue.indexOf(propsValue) == -1) && this.baseValue.push(propsValue)
            PropertySchema.baseValue.push(propsValue);
            break;
        default:
            console.log(propsValue);       
    }
    this.save(cb);
};

PropertySchema.methods.get = function(query,cb){
    if(query===null){
        return this.model('property').find(cb);
    }
    this.model('property').find(query,cb);
};

export default db.model('property',PropertySchema);