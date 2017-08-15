/**
 * author       : Sunil Wang
 * createTime   : 2017/8/10 11:04
 * description  :
 */
const MD5 = require('md5');
const rp = require('request-promise')
const NODE_BSP_SINGLE_INSTANCE = Symbol.for('NODE_BSP_SINGLE_INSTANCE')
const TESTING_OPTIONS = {
  authVersion: '0.3.3',
  url: 'http://t.union.web.58dns.org:11001/',
  appKey: 'zz2mofang',
  appSecret: 'e2afb682a225e560d4a5040d2b175359'
}
const PRODUCTION_OPTIONS = {
  authVersion: '0.3.3',
  url: 'http://union.web.58dns.org/',
  appKey: 'zz2mofang',
  appSecret: '5591dead5050d524c5a528bae08b0509'
}

class Bsp {
  constructor (options = {}) {
    if (options.isTest === true) {
      options = Object.assign(TESTING_OPTIONS, options)
    } else {
      options = Object.assign(PRODUCTION_OPTIONS, options)
    }

    this.authVersion = options.authVersion
    this.url = options.url
    this.appKey = options.appKey
    this.appSecret = options.appSecret

    this.REQUEST_URL_MAP = {
      GET_USERS_BY_USERNAME: `${this.url}bsp/cuser/getusersbyusername`
    }
  }

  getAppSecret (userName) {
    if (!userName) {
      throw new TypeError('userName required!')
    }

    return MD5(this.appSecret + this.appKey + this.authVersion + userName)
  }

  getUsersByUserName (userName) {
    let self = this

    if (!userName) {
      throw new TypeError('userName required!')
    }

    return rp({
            uri: self.REQUEST_URL_MAP.GET_USERS_BY_USERNAME,
            qs: {
              appkey: self.appKey,
              username: userName,
              auth_version: self.authVersion,
              appsecret: self.getAppSecret(userName)
            },
            json: true
          }).then(function(result){
            if (
              result.transstate === 'unsuccess' ||
              result.exceptinstr
            ) {
              return result.exceptinstr
            }
            return (result && result.data && result.data[0]) || undefined
          })
  }

  static newSingleInstance (options = {}) {
    if (Bsp[NODE_BSP_SINGLE_INSTANCE]) {
      return Bsp[NODE_BSP_SINGLE_INSTANCE]
    }

    return (Bsp[NODE_BSP_SINGLE_INSTANCE] = new Bsp(options))
  }
}

module.exports = Bsp