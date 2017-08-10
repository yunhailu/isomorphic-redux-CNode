import Bundle from '../Models/bundle';
const BundleEntity = new Bundle();

module.exports = function (req,res,next){
    Bundle.find({})
          .sort({createdTime: -1})
          .exec()
          .then(function(bundlesList){
            return res.json({ok: true, json: bundlesList});
          })
          .catch(function(err){
            return res.json({ok: false, message: err});
          })
}