import User from '../Models/user';
import userService from '../service/user';

export default function(req,res,next){
    const userName = req.session.user.userName;
    console.log('userName',userName);    
    User.findOne({
        userName
    })
    .exec()
    .then(function(userInfo){
        return res.statue(200).json(userInfo);
    })
    .catch(function(err){
        if(err){
            return res.status(500).json({ok: false, message: '服务器错误'});
        }
    })
}