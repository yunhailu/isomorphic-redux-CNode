import User from '../Models/user';
import userService from '../service/user';
const CAS = require('../util/cas58');

const cas = new CAS({
    testFlag: true, // 是否是在测试true为是
    service: 'http://localhost:8080/'
    //offline_url: 'https://sso.test.58.com:8443/gsso', // 测试连接
    //online_url: 'https://passport.58corp.com', // 线上连接
    //checkTicket_url: 'http://passport.web.58dns.org' // 线上校验ticket的url
});

export default function(req,res,next){
    console.log('logoutddd')
    req.session.destroy(err => {
        console.log('session.destroy', err)
    });
    // res.writeHead(307, { 'Location': 'https://sso.test.58.com:8443/gsso/logout?service=http%3A%2F%2Flocalhost%3A8080%2F' });
    // res.write('<a href="' + 'https://sso.test.58.com:8443/gsso/logout?service=http%3A%2F%2Flocalhost%3A8080%2F' + '">CAS login</a>');
    // return res.end();
    cas.logout(req, res, 'http://localhost:8080/');
}