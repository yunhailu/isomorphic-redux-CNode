import Property from '../Models/property';
class propertyService {
  constructor(property){
    this.Property = property;
  }
  countProperty(query){
    return this.Property.count(query).exec()
  }
  createProperty(query){
    return this.Property.create(query)
  }
  findProperty(query){
    return this.Property.find(query).exec()
  }
}

export default new propertyService(Property);