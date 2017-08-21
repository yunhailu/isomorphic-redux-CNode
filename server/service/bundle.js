import Bundle from '../Models/bundle';
class bundleService {
  constructor(bundle){
    this.Bundle = bundle;
  }
  countBundle(query){
    return this.Bundle.count(query).exec()
  }
  createBundle(query){
    return this.Bundle.create(query)
  }
  findAndUpdate(condition, updateInfo, isNew){
    return this.Bundle.findOneAndUpdate(condition, updateInfo, {new:isNew}).exec()
  }
  findBundle(query){
    return this.Bundle.find(query)
  }
  findByIdUpdate(condition, updateInfo, isNew){
    return this.Bundle.findByIdAndUpdate(condition, updateInfo, {new:isNew}).exec()
  }
}

export default new bundleService(Bundle);