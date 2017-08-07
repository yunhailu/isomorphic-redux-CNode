import Bundle from '../Models/bundle';
const BundleEntity = new Bundle();

export default function(req,res,next){
    Bundle.find({})
          .sort({createdTime: -1})
          .exec()
          .then(function(bundlesList) {
            return res.json({ok: true, json: bundlesList});
          })
        .catch(function(err){
            if(err){
                return res.status(500).end(err);
            }
        })
}