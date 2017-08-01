const jwt = require("jwt-simple");
import mongoose from 'mongoose';
const PropertyEntity = mongoose.model('property');
export default function(req,res,next){
    const property = {
        propertyvalue: req.body.propertyvalue,
        propertytype: req.body.propertytype
    }
    PropertyEntity.findOne({
        businessValue: [],
        appValue: [],
        utilityValue: [property.propertyvalue],
        baseValue: []
    }).then(function(doc){
        if(doc){
            console.log('doc',doc)
            this.save(cb)
        }else{
            console.log('doc is false');
        }
    })
    // PropertyEntity.saveProperty(property,err=>{
    //     if(err){
    //         return res.status(500).end('服务器错误')
    //     } else {
    //         return res.status(200).end('发布属性成功') 
    //     }
    // })
}