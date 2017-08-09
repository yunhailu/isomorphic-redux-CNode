import Bundle from '../Models/bundle';
import Property from '../Models/property';

export function getBundles(){
    return Bundle.find({})
          .sort({createdTime: -1})
          .exec()
          .then(function(bundlesList) {
            return bundlesList;
          })
          .catch(function(err){
              if(err){
                  return err;
              }
          })
}

export function getPropertys(){
    return Property.find({})
                   .exec()
                   .then(function(propsList) {
                        let propsMap = {};
                        propsList.forEach(function(propsItem,key){
                            let propsItemDoc = propsItem._doc;
                            
                            if (Object.keys(propsMap).indexOf(propsItemDoc.type) == -1){
                                propsMap[propsItemDoc.type] = [propsItemDoc.value];
                            }else{
                                propsMap[propsItemDoc.type].push(propsItemDoc.value)
                            }
                        })
                        return propsMap;
                    })
                    .catch(function(err){
                        if(err){
                            return err;
                        }
                    })
}