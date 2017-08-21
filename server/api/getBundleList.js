import bundleService from '../service/bundle';

module.exports = function (req,res,next){
    bundleService.findBundle({})
          .sort({createdTime: -1})
          .exec()
          .then(function(bundlesList){
            return res.json({ok: true, json: bundlesList});
          })
          .catch(function(err){
            return res.json({ok: false, message: err});
          })
}