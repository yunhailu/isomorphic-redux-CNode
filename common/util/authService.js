import cookie from 'react-cookie'
import config from '../../config'
let cookieConfig = {}
// if(config.cookieDomain !== ''){
//   cookieConfig = { domain: config.cookieDomain, path: '/' };
// }
cookieConfig = { path: '/' };

export function saveCookie(name,value) {
  console.log('saveCookie', name);
  cookie.save(name, value, cookieConfig)
}

export function getCookie(name) {
  return cookie.load(name)
}

export function removeCookie(name) {
  console.log('removeCookie', name);
  cookie.remove(name, cookieConfig)
}

export function signOut() {
    console.log('removeCookie');
  cookie.remove('token', cookieConfig)
}

export function isLogin() {
  return !!cookie.load('token')
}

export function redirectToBack(nextState, replace) {
  //已经登录则不进入
  if (isLogin()) {
    replace({
        pathname: '/',
        state: { nextPathname: nextState.location.pathname}
    })
  }
}
export function redirectToLogin(nextState,replace) {
  console.log('!isLogin()',!isLogin());
  if (!isLogin()) {
    replace({
        pathname: '/logIn',
        state: { nextPathname: nextState.location.pathname}
    })
  }
}
// export function redirectToBack(nextState, replaceState) {
//   //已经登录则不进入
//   if (isLogin()) {
//     replaceState(null, '/')
//   }
// }
// export function redirectToLogin(nextState,replaceState) {
//   if (!isLogin()) {
//     replaceState(null, '/logIn')
//   }
// }