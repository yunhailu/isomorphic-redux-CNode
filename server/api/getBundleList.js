import Bundle from '../Models/bundle';
const BundleEntity = new Bundle();

export default function(req,res,next){
    Bundle.find({},function(err, bundlesList) {
        if(err){
            return res.status(500).end(err);
        }
        return res.json({ok: true, json: bundlesList});
    })
}