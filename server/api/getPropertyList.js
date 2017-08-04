import Property from '../Models/property';
const PropertyEntity = new Property();

export default function(req,res,next){
    Property.find({},function(err, propsList) {
        if(err){
            return res.status(500).end(err);
        }
        let propsMap = {};
        propsList.forEach(function(propsItem,key){
            let propsItemDoc = propsItem._doc;
            
            if (Object.keys(propsMap).indexOf(propsItemDoc.type) == -1){
                propsMap[propsItemDoc.type] = [propsItemDoc.value];
            }else{
                propsMap[propsItemDoc.type].push(propsItemDoc.value)
            }
        })
        return res.json({ok: true, json: propsMap});
    })
}