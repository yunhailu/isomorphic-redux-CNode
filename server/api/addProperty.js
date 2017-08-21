import propertyService from '../service/property';

export default function(req,res,next){
    const jsonProperty = JSON.parse(req.body.params);
    const propertys = {
        propertyvalue: jsonProperty.propertyvalue,
        propertytype: jsonProperty.propertytype
    };
    propertyService.countProperty({
        type: propertys.propertytype,
        value: propertys.propertyvalue,
        isDel: false
    })
    .then(function(count){
        if(count){
            console.log('existed');
            return res.json({ok: false, message: "数据已经存在"});
        }
        return propertyService.createProperty({
            type: propertys.propertytype,
            value: propertys.propertyvalue
        })
    })
    .then(doc => {
        return res.json({ok: true, data: "success"});
    })
    .catch(err => {
        return res.status(500).end(err);
    })
}