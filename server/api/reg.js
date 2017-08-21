import userService from '../service/user';
const NodeBsp = require('../util/node-bsp');
const bsp = new NodeBsp();

export default function(req,res,next){
    let userName = req.body.name,
        isRNAdmin = req.body.isRNAdmin;
        
    userService.getUser({
        userName
    })
    .then(function(user){
        if(user){
            return res.status(500).send('该账号已经有人注册!');
        }
        return bsp.getUsersByUserName(userName)
    })
    .then(function(userInfo){
        if(!userInfo){
            return res.send('该账号不存在于58系统中，请联系58!');
        }
        userInfo.iid = userInfo.id;
        delete userInfo.id;
        userInfo.isRNAdmin = isRNAdmin;
        return userService.createUser(userInfo)
    })
    .then(function(infos){
        return res.json({ok: true, json: infos});
    })
    .catch(function(err){
        if(err){
            return res.status(500).send('服务器错误');
        }
    })
}