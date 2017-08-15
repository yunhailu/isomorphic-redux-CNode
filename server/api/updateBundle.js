import Bundle from '../Models/bundle';
const BundleEntity = new Bundle();

export default function(req,res,next){
  const _id = req.body.id;
  // the userName is getted from the register part.
  const userName = req.session.user.userName;
  delete req.body.id;
  const updateInfo = {
    updateTime: new Date(),
    updatePerson: userName
  }
  Bundle.findByIdAndUpdate(_id,{"$pushAll": {"updateInfo": [updateInfo]}, $set:req.body},{new:true})
        .exec()
        .then(function(bundle){
          console.log('id',_id);
          return res.status(200).json({ok: true, json: bundle._id});
        }).catch(function(err){
          return res.status(500).end(err);
        })
}
