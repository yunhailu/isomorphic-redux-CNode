import Bundle from '../Models/bundle';
const BundleEntity = new Bundle();
export default function(req,res,next){
    const partUserType = req.body.partUserType,
            appType = req.body.appType,
            baseType = req.body.baseType,
            businessType = req.body.businessType,
            utilityType = req.body.utilityType,
            description = req.body.description,
            simDescription = req.body.simDescription,
            resourceUrl = req.body.resourceUrl,
            beforeValue = req.body.beforeValue,
            forceValue = req.body.forceValue;
    Bundle.count({
        partUserType,
        appType,
        baseType,
        businessType,
        utilityType,
        description,
        simDescription,
        resourceUrl,
        beforeValue,
        forceValue,
        isDel: false
    }).exec()
    .then(function(count){
        const date = new Date();
        const time = {
            date: date,
            year : date.getFullYear(),
            month : date.getFullYear() + "-" + (date.getMonth() + 1),
            day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
        };
        const resourceId = "resourceId";
        if(count){
            console.log('existed');
            return res.json({ok: false, message: "Bundle已经存在"});
        }
        return Bundle.create({
            partUserType,
            appType,
            baseType,
            businessType,
            utilityType,
            description,
            simDescription,
            resourceUrl,
            beforeValue,
            forceValue,
            createdTime: time.minute
        })
    })
    .then(doc => {
        Bundle.update({
            simDescription:simDescription
        },{$inc:{resourceId:1},$set: {bundleVersion: 'hoho'}},false,false);
        return res.json({ok: true, message: "success"});
    })
    .catch(err => {
        return res.status(500).end(err);
    })
}