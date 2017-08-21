import bundleService from '../service/bundle';

export default function(req,res,next){
  const _id = req.body.id;
  // the userName is getted from the register part.
  const userName = req.session.user.userName;
  delete req.body.id;
  const updateInfo = {
    updateTime: new Date(),
    updatePerson: userName
  }
  bundleService.findByIdUpdate(_id,{"$pushAll": {"updateInfo": [updateInfo]}, $set:req.body},true)
        .then(function(bundle){
          console.log('id',_id);
          return res.status(200).json({ok: true, json: bundle._id});
        }).catch(function(err){
          return res.status(500).end(err);
        })
}
