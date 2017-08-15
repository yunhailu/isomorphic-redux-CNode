/**
 * Created by bjf on 2017/2/27.
 */

'use strict';

/**
 * 依赖模块
 * cheerio 需要安装才能使用
 * npm install cheerio --save
 */
var http = require('http');
var https = require('https');
var url = require('url');
var cheerio = require('cheerio');
var path = require('path');

/**
 * Initialize CAS with the given `options`.
 *
 * @param {Object} options
 *     {
 *       'offline_url':     {String}
 *           测试环境中的CAS地址，默认设置为公司的 https://sso.test.58.com:8443/gsso
 *       'online_url':      {String}
 *           线上环境CAS地址，默认设置为公司的 https://passport.58corp.com
 *       'testFlag':        {Boolean}
 *           用来表示当前CAS是测试环境还是线上环境
 *           true：测试环境
 *           false：线上环境
 *       'checkTicket_url': {String}
 *           用来验证ticket的url 用户名会在xml的报文里 默认设置为公司的 http://passport.web.58dns.org
 *           注：只有线上环境是这个地址。在测试环境中，只需要offline_url
 *              offline_url即负责登陆CAS也负责返回用户名
 *       'service':         {String}
 *           这个url是需要认证的url，也就是需要CAS登陆之后才能使用的页面，建议使用首页
 *           在authenticate()方法中会让CAS登陆成功之后重定向到这个url
 *     }
 * @api public
 */
var CAS = module.exports = function CAS(options) {
    options = options || {};
    options.offline_url = options.offline_url || 'https://sso.test.58.com:8443/gsso';
    options.online_url = options.online_url || 'https://passport.58corp.com';
    options.checkTicket_url = options.online_url || 'http://passport.web.58dns.org';

    this.testFlag = options.testFlag;
    if (this.testFlag) {
        // 测试环境
        var cas_url = url.parse(options.offline_url);
    } else {
        // 正式环境
        var cas_url = url.parse(options.online_url);
    }

    if (cas_url.protocol != 'https:') {
        throw new Error('只支持HTTPS的CAS服务端');
    }
    if (!cas_url.hostname) {
        throw new Error('offline_url或者online_url格式错误');
    }
    this.hostname = cas_url.hostname;
    this.protocol = cas_url.protocol;
    this.port = cas_url.port || 443;
    this.base_path = cas_url.pathname;
    this.service = options.service;
    this.checkTicket_url = options.checkTicket_url;
    if(!!options.testFlag){
        this.secureSSL = false;
    }else{
        this.secureSSL = true;
    }
};


/**
 * Library version.
 */

CAS.version = '0.0.1';

/**
 * 强制 CAS 在一个页面认证，如果当前用户没有被认证过
 * 将会被重定向到 CAS 服务端登陆
 *
 * @param {object} req
 *      HTTP request object
 * @param {object} res
 *      HTTP response object
 * @param {function} callback
 *      callback(err, status, username, extended)
 * @param {String} service
 *      这个url是需要认证之后才能访问的页面路径
 *      默认从当前的req对象里提取
 * @api public
 */
CAS.prototype.authenticate = function (req, res, callback, service) {
    if(this.base_path == '/'){
        var casURL = 'https://' + this.hostname + ':' + this.port;
    }else{
        var casURL = 'https://' + this.hostname + ':' + this.port + this.base_path;
    }
    var reqURL = url.parse(req.url, true);

    // 充URL中取出ticket
    var ticket = reqURL.query['ticket'];

    // 如果 service 没传，将自动获取
    if (!service) {
        // 获取当前页面 URL ，截去 ticket
        delete reqURL.query['ticket'];
        service = url.format({
            protocol: req.protocol || 'http',
            host: req.headers['x-forwarded-host'] || req.headers['host'],
            pathname: reqURL.pathname,
            query: reqURL.query
        });
    }

    // 如果没有ticket，说明我们还没有向CAS服务端发送过请求
    if (!ticket) {
        // 重定向到CAS服务端
        var redirectURL = casURL + '/login?service=' + encodeURIComponent(service);
        console.log('loginredirectUrl', redirectURL);
        res.writeHead(307, { 'Location': redirectURL });
        res.write('<a href="' + redirectURL + '">CAS login</a>');
        res.end();
    }

    // 如果我们有ticket
    else {
        // 向CAS服务端认证
        this.validate(ticket, service, callback);
    }
};


/**
 * 
 * 尝试去 CAS 服务端 验证 传入的ticket
 *
 * @param {String} ticket
 *     一个 ticket
 * @param {Function} callback
 *     callback(err, auth_status, username, extended).
 *     `extended` is an object containing:
 *       - username
 *       - attributes
 *       - PGTIOU
 *       - ticket
 *       - proxies
 * @param {String} service
 *     服务端需要认证的URL
 *     实例化时传入的值
 * @param {Boolean} renew
 *     设置为true的时候，哪怕 CAS 的服务端为用户认证过，将再次强制请求一次
 * @api public
 * 
 */
CAS.prototype.validate = function(ticket, service, callback, renew) {
    var service_url = service || this.service;
    if (!service_url) {
        throw new Error('CAS参数`service`错误.');
    }

    var query = {
        'ticket': ticket,
        'service': service_url
    };

    if (renew) {
        query['renew'] = 1;
    }

    var queryPath = url.format({
        pathname: this.base_path+'/serviceValidate',
        query: query
    });
    // 如果测试环境
    if(this.testFlag){
        console.log('---------------------------测试环境----------------------');
        var req = https.get({
            host: this.hostname,
            port: this.port,
            path: queryPath,
            ca: this.ssl_ca || null,
            rejectUnauthorized: this.secureSSL
        }, function(res) {
            getCallback(res);
        });
    }else{
        // 如果是线上环境
        console.log('---------------------------线上环境----------------------');
        var check_url = url.parse(this.checkTicket_url);
        console.log(check_url);
        var req = https.get({
            host: check_url.hostname,
            port: check_url.port,
            path: queryPath,
            ca: this.ssl_ca || null,
            rejectUnauthorized: this.secureSSL
        }, function(res) {
            getCallback(res);
        });
    }
    function getCallback(res){
        // Handle server errors
        res.on('error', function(e) {
            callback(e);
        });

        // Read result
        res.setEncoding('utf8');
        var response = '';
        res.on('data', function(chunk) {
            response += chunk;
            if (response.length > 1e6) {
                req.connection.destroy();
            }
        });

        res.on('end', function() {
            // 使用cheerio解析XML
            var $ = cheerio.load(response);

            // 查出用户名
            var elemSuccess = $('cas\\:authenticationSuccess').first();
            if (elemSuccess && elemSuccess.length > 0) {
                var elemUser = elemSuccess.find('cas\\:user').first();
                if (!elemUser || elemUser.length < 1) {
                    // 没有用户名？
                    callback(new Error("No username?"), false);
                    return;
                }

                // 获取用户名
                var username = elemUser.text();

                // Look for optional proxy granting ticket
                var pgtIOU;
                var elemPGT = elemSuccess.find('cas\\:proxyGrantingTicket').first();
                if (elemPGT) {
                    pgtIOU = elemPGT.text();
                }

                // Look for optional proxies
                var proxies = [];
                var elemProxies = elemSuccess.find('cas\\:proxies');
                for (var i=0; i<elemProxies.length; i++) {
                    var thisProxy = $(elemProxies[i]).text().trim();
                    proxies.push(thisProxy);
                }

                // Look for optional attributes
                var attributes = parseAttributes(elemSuccess);

                callback(undefined, true, username, {
                    username: username,
                    attributes: attributes,
                    PGTIOU: pgtIOU,
                    ticket: ticket,
                    proxies: proxies
                });
                return;
            } 

            // 错误消息
            var elemFailure = $('cas\\:authenticationFailure').first();
            if (elemFailure && elemFailure.length > 0) {
                var code = elemFailure.attr('code');
                var message = 'Validation failed [' + code +']: ';
                message += elemFailure.text();
                callback(new Error(message), false);
                return;
            }

            // 返回错误
            callback(new Error('Bad response format.'));
            console.error(response);
            return;

        });
    }
    // CAS的链接错误
    req.on('error', function(err) {
        callback(err);
        req.abort();
    });
};

// 退出登陆
CAS.prototype.logout = function(req, res, returnUrl){
    if(this.base_path == '/'){
        var casURL = 'https://' + this.hostname + ':' + this.port;
    }else{
        var casURL = 'https://' + this.hostname + ':' + this.port + this.base_path;
    }
    if(!returnUrl){
        returnUrl = url.format({
            protocol: req.protocol,
            host: req.hostname
        })
    }
    // logout with auto redirect
    // var redirectURL = url.format({
    //     protocol: this.protocol,
    //     hostname: this.hostname,
    //     port: this.port,
    //     pathname: path.join(this.base_path, '/logout'),
    //     search: `service=${encodeURIComponent(returnUrl)}`
    // })
    // res.location(redirectURL);
    // res.redirect(redirectURL);
    // res.end();
    var redirectURL = casURL + '/logout?service=' + encodeURIComponent(returnUrl);
    // res.writeHead(307, { 'Location': redirectURL });
    // res.write('<a href="' + redirectURL + '">CAS login</a>');
    return res.redirect(redirectURL);
    // return res.end();
}

/**
 * 
 * 单点退出
 *
 * 当单点退出时，CAS 服务端会向各个接入单点退出的服务端发送请求，
 * POST请求  且请求体里还有 logoutRequest属性
 * 
 * @param {Object} req
 *      Express/Connect HTTP serverRequest.
 * @param {Object} res
 *      HTTP serverResponse.
 * @param {Function} logoutCallback
 *      function(status,result);
 *       - status 表示状态  
 *           -'success' 退出成功        'result' 返回ticket
 *           -'err'     退出失败        'result' 返回错误对象
 *           -'noquit'  不是退出请求    'result' 返回 null
 * @api public
 */
CAS.prototype.handleSingleSignout = function(req, res, logoutCallback) {
    var ticket = '';
    if (req.method == 'POST' && req.body['logoutRequest']) {
        try {
            // 退出请求，格式化XML
            var $ = cheerio.load(req.body['logoutRequest']);
            var ticketElems = $('samlp\\:SessionIndex');
            if (ticketElems && ticketElems.length > 0) {
                // 获取用户第一次登陆是的 ticket
                ticket = ticketElems.first().text().trim();
                logoutCallback('success', ticket);
            }
        } catch (err) {
            // 退出失败
            console.warn(err);
            logoutCallback('err',err);
        }
    }else{
        logoutCallback('noquit', null);
    }
}

/**
 * Parse a cas:authenticationSuccess XML node for CAS attributes.
 * Supports Jasig style, RubyCAS style, and Name-Value.
 *
 * @param {Object} elemSuccess
 *     DOM node
 * @return {Object}
 *     {
 *         attr1: [ attr1-val1, attr1-val2, ... ],
 *         attr2: [ attr2-val1, attr2-val2, ... ],
 *         ...
 *     }
 * @attribution http://downloads.jasig.org/cas-clients/php/1.2.0/docs/api/client_8php_source.html#l01589
 */
var parseAttributes = function(elemSuccess) {
    var attributes = {};
    var elemAttribute = elemSuccess.find('cas\\:attributes').first();
    if (elemAttribute && elemAttribute.children().length > 0) {
        // "Jasig Style" Attributes:
        //
        //  <cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>
        //      <cas:authenticationSuccess>
        //          <cas:user>jsmith</cas:user>
        //          <cas:attributes>
        //              <cas:attraStyle>RubyCAS</cas:attraStyle>
        //              <cas:surname>Smith</cas:surname>
        //              <cas:givenName>John</cas:givenName>
        //              <cas:memberOf>CN=Staff,OU=Groups,DC=example,DC=edu</cas:memberOf>
        //              <cas:memberOf>CN=Spanish Department,OU=Departments,...</cas:memberOf>
        //          </cas:attributes>
        //          <cas:proxyGrantingTicket>PGTIOU-84678-8a9d2...</cas:proxyGrantingTicket>
        //      </cas:authenticationSuccess>
        //  </cas:serviceResponse>
        //
        for (var i = 0; i < elemAttribute.children().length; i++) {
            var node = elemAttribute.children()[i];
            var attrName = node.name.toLowerCase().replace(/cas:/, '');
            if (attrName != '#text') {
                var attrValue = cheerio(node).text();
                if (!attributes[attrName]) {
                    attributes[attrName] = [attrValue];
                } else {
                    attributes[attrName].push(attrValue);
                }
            }
        }
    } else {
        // "RubyCAS Style" attributes
        //
        //    <cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>
        //        <cas:authenticationSuccess>
        //            <cas:user>jsmith</cas:user>
        //
        //            <cas:attraStyle>RubyCAS</cas:attraStyle>
        //            <cas:surname>Smith</cas:surname>
        //            <cas:givenName>John</cas:givenName>
        //            <cas:memberOf>CN=Staff,OU=Groups,DC=example,DC=edu</cas:memberOf>
        //            <cas:memberOf>CN=Spanish Department,OU=Departments,...</cas:memberOf>
        //
        //            <cas:proxyGrantingTicket>PGTIOU-84678-8a9d2...</cas:proxyGrantingTicket>
        //        </cas:authenticationSuccess>
        //    </cas:serviceResponse>
        //
        for (var i = 0; i < elemSuccess.children().length; i++) {
            var node = elemSuccess.children()[i];
            var tagName = node.name.toLowerCase().replace(/cas:/, '');
            switch (tagName) {
                case 'user':
                case 'proxies':
                case 'proxygrantingticket':
                case '#text':
                    // these are not CAS attributes
                    break;
                default:
                    var attrName = tagName;
                    var attrValue = cheerio(node).text();
                    if (attrValue != '') {
                        if (!attributes[attrName]) {
                            attributes[attrName] = [attrValue];
                        } else {
                            attributes[attrName].push(attrValue);
                        }
                    }
                    break;
            }
        }
    }

    if (attributes == {}) {
        // "Name-Value" attributes.
        //
        // Attribute format from this mailing list thread:
        // http://jasig.275507.n4.nabble.com/CAS-attributes-and-how-they-appear-in-the-CAS-response-td264272.html
        // Note: This is a less widely used format, but in use by at least two institutions.
        //
        //    <cas:serviceResponse xmlns:cas='http://www.yale.edu/tp/cas'>
        //        <cas:authenticationSuccess>
        //            <cas:user>jsmith</cas:user>
        //
        //            <cas:attribute name='attraStyle' value='Name-Value' />
        //            <cas:attribute name='surname' value='Smith' />
        //            <cas:attribute name='givenName' value='John' />
        //            <cas:attribute name='memberOf' value='CN=Staff,OU=Groups,DC=example,DC=edu' />
        //            <cas:attribute name='memberOf' value='CN=Spanish Department,OU=Departments,...' />
        //
        //            <cas:proxyGrantingTicket>PGTIOU-84678-8a9d2sfa23casd</cas:proxyGrantingTicket>
        //        </cas:authenticationSuccess>
        //    </cas:serviceResponse>
        //
        var nodes = elemSuccess.find('cas\\:attribute');
        if (nodes && nodes.length) {
            for (var i = 0; i < nodes.length; i++) {
                var attrName = nodes[i].attr('name');
                var attrValue = nodes[i].attr('value');
                if (!attributes[attrName]) {
                    attributes[attrName] = [attrValue];
                } else {
                    attributes[attrName].push(attrValue);
                }
            }
        }
    }
    return attributes;
}
