import userService from '../service/user';

export default function(req,res,next){
    const userName = req.session.user.userName;
    console.log('userName',userName);
    userService.getUser({
        userName
    })
    .then(function(userInfo){
        return res.status(200).json({ok: true, json: userInfo});
    })
    .catch(function(err){
        if(err){
            return res.status(500).json({ok: false, message: '服务器错误'});
        }
    })
}