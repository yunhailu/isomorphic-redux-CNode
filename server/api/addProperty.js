import propertyService from '../service/property';

export default function(req,res,next){
    const propertys = {
        propertyvalue: req.body.propertyvalue,
        propertytype: req.body.propertytype
    }
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
        console.log(doc);
        return res.json({ok: true, message: "success"});
    })
    .catch(err => {
        return res.status(500).end(err);
    })
}