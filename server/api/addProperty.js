const jwt = require("jwt-simple");
import Property from '../Models/property';
const PropertyEntity = new Property();
export default function(req,res,next){
    const propertys = {
        propertyvalue: req.body.propertyvalue,
        propertytype: req.body.propertytype
    }
    Property.count({
        type: propertys.propertytype,
        value: propertys.propertyvalue,
        isDel: false
    }).exec()
    .then(function(count){
        if(count){
            console.log('existed');
            return res.json({ok: false, message: "数据已经存在"});
        }
        return Property.create({
            type: propertys.propertytype,
            value: propertys.propertyvalue
        })
    })
    .then(doc => {
        console.log(doc);
        return res.json({ok: true, message: "success"});
    })
    .catch(err => {
        return res.status(500).end(err);
    })
}