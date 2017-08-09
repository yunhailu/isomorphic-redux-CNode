import Bundle from '../Models/bundle';
const BundleEntity = new Bundle();

export default function * (req,res,next){
    console.log('req.session.usergetB', req.session.user);
    console.log('req.cookies.name', req.cookies);

    let bundlesList = yield Bundle.find({}).sort({createdTime: -1}).exec().catch(err => {
         return res.status(500).send(err);
    });

    return res.json({ok: true, json: bundlesList});
}