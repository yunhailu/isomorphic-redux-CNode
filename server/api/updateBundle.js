import bundleService from '../service/bundle';

export default function(req,res,next){
  const jsonBody = JSON.parse(req.body.params);
  const _id = jsonBody.id;
  console.log('id',_id);
  // the userName is getted from the register part.
  const userName = req.session.user.userName;
  delete jsonBody.id;
  const updateInfo = {
    updateTime: new Date(),
    updatePerson: userName
  }
  bundleService.findByIdUpdate({_id: _id},{"$pushAll": {"updateInfo": [updateInfo]}, $set:jsonBody},true)
        .then(function(bundle){
          console.log('bundleService', bundle);
          return res.status(200).json({ok: true, json: bundle._id});
        }).catch(function(err){
          return res.status(500).end(err);
        })
}
