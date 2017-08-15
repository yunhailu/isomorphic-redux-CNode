import User from '../Models/user';
class userService {
  constructor(user){
    this.User = user;
  }
  getUser(query){
    if(query === null){
        return this.User.find().exec();
    }
    return this.User.findOne(query).exec();
  }
  findAndUpdate(condition, updateInfo, isNew){
    return this.User.findOneAndUpdate(condition, updateInfo, {new:isNew}).exec()
  }
  createUser(infos){
    return this.User.create(infos)
  }
}

export default new userService(User);