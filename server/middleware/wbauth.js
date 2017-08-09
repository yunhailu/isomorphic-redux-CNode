import User from '../Models/user';
const userEntity = new User();
const CAS = require('../util/cas58');
const MD5 = require('md5');

const cas = new CAS({
    testFlag: true, // 是否是在测试true为是
    service: 'http://localhost:3000'
    //offline_url: 'https://sso.test.58.com:8443/gsso', // 测试连接
    //online_url: 'https://passport.58corp.com', // 线上连接
    //checkTicket_url: 'http://passport.web.58dns.org' // 线上校验ticket的url
});

export default function WBCas(){
  return function(req, res, next){
    console.log('req.originalUrl',req.originalUrl);
    const sessionUser = req.session.user;
    if(sessionUser){
      return next();
    }
    cas.authenticate(req, res, function(err, status, username, extended) {
        console.log('arguments',arguments);
        console.log('username',username);
        if (err) {
            return res.send({ error: err });
        } else {
            /**
             * 登陆成功时创建session
             * 下次用户的请求，只需要判断session即可
             * 不用每次都去 CAS 请求
             *
             */
            userEntity.getUser({
                name:username
            },(err,user)=>{
                if(err){
                    return res.status(500).json({message:'服务器错误'});
                }
                if(!user){
                    // return res.status(404).json({message: '无权限访问，请联系管理员！'});
                    return res.send('无权限访问，请联系管理员！');
                }
                // const expires = moment().add(7,'days').valueOf();
                // const ticket = extended.ticket || "";
                // const token = jwt.encode({
                //     ticket,
                //     exp: expires
                // }, req.app.get('jwtTokenSecret'));
                // req.token = token;
                const ticket = extended.ticket || "";
                req.session.ticket = ticket;
                req.session.user = user;
                res.redirect('/');
            })
        }
    });
  }
}