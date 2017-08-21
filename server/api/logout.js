const CAS = require('../util/cas58');

const cas = new CAS({
    testFlag: true, // 是否是在测试true为是
    service: 'http://localhost:3000/'
    //offline_url: 'https://sso.test.58.com:8443/gsso', // 测试连接
    //online_url: 'https://passport.58corp.com', // 线上连接
    //checkTicket_url: 'http://passport.web.58dns.org' // 线上校验ticket的url
});

export default function(req,res,next){
    console.log('logoutddd')
    req.session.destroy(err => {
        console.log('session.destroy', err)
    });
    cas.logout(req, res, 'http://localhost:3000/');
}