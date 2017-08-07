import Bundle from '../Models/bundle';
const BundleEntity = new Bundle();

export default function(req,res,next){
  const _id = req.body.id;
  delete req.body.id;
  req.body.updateTime = new Date();
  Bundle.findByIdAndUpdate(_id,req.body,{new:true})
        .exec()
        .then(function(bundle){
          console.log('id',_id);
          return res.status(200).json({ok: true, json: bundle._id});
        }).catch(function(err){
          return res.status(500).end(err);
        })
}
