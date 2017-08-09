import Bundle from '../Models/bundle';
const co = require('co')
const BundleEntity = new Bundle();

let  generateBundle = function * (){
    const partUserType = body.partUserType,
        appType = body.appType,
        baseType = body.baseType,
        businessType = body.businessType,
        utilityType = body.utilityType,
        description = body.description,
        simDescription = body.simDescription,
        resourceUrl = body.resourceUrl,
        beforeValue = body.beforeValue,
        forceValue = body.forceValue;

    let count = yield Bundle.count({
        resourceUrl,
        isDel: false
    }).exec();

    const date = new Date();
    const time = {
        date: date,
        year : date.getFullYear(),
        month : date.getFullYear() + "-" + (date.getMonth() + 1),
        day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
        date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
    };
    if(count){
        throw new Error('xxx ')
    }

    return yield Bundle.create({
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

};

// function generateBundle(body,res){
//     const partUserType = body.partUserType,
//         appType = body.appType,
//         baseType = body.baseType,
//         businessType = body.businessType,
//         utilityType = body.utilityType,
//         description = body.description,
//         simDescription = body.simDescription,
//         resourceUrl = body.resourceUrl,
//         beforeValue = body.beforeValue,
//         forceValue = body.forceValue;
//     Bundle.count({
//         resourceUrl,
//         isDel: false
//     }).exec()
//     .then(function(count){
//         const date = new Date();
//         const time = {
//             date: date,
//             year : date.getFullYear(),
//             month : date.getFullYear() + "-" + (date.getMonth() + 1),
//             day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
//             minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
//             date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
//         };
//         if(count){
//             console.log('existed');
//         }
//         return Bundle.create({
//             partUserType,
//             appType,
//             baseType,
//             businessType,
//             utilityType,
//             description,
//             simDescription,
//             resourceUrl,
//             beforeValue,
//             forceValue,
//             createdTime: time.minute
//         })
//     })
// }
export default function * (req,res,next){
    const body = req.body;

    let  bundle = yield generateBundle(body).catch(err => {
        return res.send(err);
    })

    let package = yield buildPackage(bundle).catch(err => {
        return res.send(err);
    })

    bundle.id = buildInfo.id;
    yield bundle.save()

    return res.json({ok: true, message: "success", data: bundle});

    // const partUserType = req.body.partUserType,
    //         appType = req.body.appType,
    //         baseType = req.body.baseType,
    //         businessType = req.body.businessType,
    //         utilityType = req.body.utilityType,
    //         description = req.body.description,
    //         simDescription = req.body.simDescription,
    //         resourceUrl = req.body.resourceUrl,
    //         beforeValue = req.body.beforeValue,
    //         forceValue = req.body.forceValue;
    // Bundle.count({
    //     partUserType,
    //     appType,
    //     baseType,
    //     businessType,
    //     utilityType,
    //     description,
    //     simDescription,
    //     resourceUrl,
    //     beforeValue,
    //     forceValue,
    //     isDel: false
    // }).exec()
    // .then(function(count){
    //     const date = new Date();
    //     const time = {
    //         date: date,
    //         year : date.getFullYear(),
    //         month : date.getFullYear() + "-" + (date.getMonth() + 1),
    //         day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    //         minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
    //         date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
    //     };
    //     const resourceId = "resourceId";
    //     if(count){
    //         console.log('existed');
    //         return res.json({ok: false, message: "Bundle已经存在"});
    //     }
    //     return Bundle.create({
    //         partUserType,
    //         appType,
    //         baseType,
    //         businessType,
    //         utilityType,
    //         description,
    //         simDescription,
    //         resourceUrl,
    //         beforeValue,
    //         forceValue,
    //         createdTime: time.minute
    //     })
    // })
    // .then(doc => {
    //     return res.json({ok: true, message: "success"});
    // })
    // .catch(err => {
    //     return res.status(500).end(err);
    // })
}