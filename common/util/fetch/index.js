import * as API from './api';
import axios from 'axios';

const axiosCookie = axios.create({
	withCredentials: true
});

const Request = {
    /**
     * @params json
     * @params {Object} opts - 必填项, 以json对象形式传参
     * @params {String} opts.method - 必填项, 请求方式
     * @params {String} opts.url - 必填项, 请求地址
     * @params {Object} opts.params - 必填项, 请求参数, json对象形式
     * @example
     *      const params = {
                method: 'post',
                url: '/user/12345',
                params: {
                    firstName: 'Fred',
                    lastName: 'Flintstone'
                }
            }
            Api.json(params);
     * @return {Promise} 返回接口的promise对象
     * */
    json(opts){
        const url = opts.url, method = opts.method;
        let data = opts.params;
        if(['get', 'delete', 'head'].some(item => item == method ? true : false)){
            data = { params: opts.params };
        }
        return axiosCookie[opts.method](url, data).then(response => {
            if(response.status == 200 && response.statusText == "OK") {
                return response.data;
            }
            return null;
        }).catch(error => {
            console.log('error: ', error);
        });
    },
    /**
     * @params get
     * @params {Object} opts - 必填项, 以json对象形式传参
     * @params {String} opts.url - 必填项, 请求地址
     * @params {Object} opts.params - 必填项, 请求参数, json对象形式
     * @example
     *      const params = {
                method: 'post',
                url: '/user/12345',
                params: {
                    firstName: 'Fred',
                    lastName: 'Flintstone'
                }
            }
            Api.get(params);
     * @return {Promise} 返回接口的promise对象
     * */
    get(opts){
        const { url, params } = opts;
        return axiosCookie.get(url, {params}).then(response => {
            if((response.status == 200) && (response.statusText == 'OK')){
              return response.data;
            }
        });
    },
    /**
     * @params post
     * @params {Object} opts - 必填项, 以json对象形式传参
     * @params {String} opts.url - 必填项, 请求地址
     * @params {Object} opts.params - 必填项, 请求参数, json对象形式
     * @example
     *      const params = {
                method: 'post',
                url: '/user/12345',
                params: {
                    firstName: 'Fred',
                    lastName: 'Flintstone'
                }
            }
            Api.post(params);
     * @return {Promise} 返回接口的promise对象
     * */
    post(opts){
        const { url, params } = opts;
        return axiosCookie.post(url, params).then(function(response){
          if((response.status == 200) && (response.statusText == 'OK')){
            return response.data;
          }
        })
    },
      /**
     * @params put
     * @params {Object} opts - 必填项, 以json对象形式传参
     * @params {String} opts.url - 必填项, 请求地址
     * @params {Object} opts.params - 必填项, 请求参数, json对象形式
     * @return {Promise} 返回接口的promise对象
     * */
    put(opts){
        const { url, params } = opts;
        console.log('requestPut', params);
        return axiosCookie.put(url, params).then(function(response){
          if((response.status == 200) && (response.statusText == 'OK')){
            return response.data;
          }
        })
    }
};

/**
* @describe 发布bundle
* @params {Object} data - 必填, 请求参数
* @return {Promise} 返回接口的promise对象
* */
export const postBundle = params => {
    const url = API.postBundle;
    return Request.post({ url, params });
};

/**
* @describe 上传bundle到cdn
* @params {Object} data - 必填, 请求参数
* @return {Promise} 返回接口的promise对象
* */
export const bundleUpload = params => {
    const url = API.bundleUpload;
    return Request.post({ url, params });
};

/**
* @describe 获取属性列表
* @params {Object} data - 选填, 请求参数
* @return {Promise} 返回接口的promise对象
* */
export const getPropertyList = params => {
    const url = API.propertyList;
    return Request.get({ url, params });
};

/**
* @describe 添加属性
* @params {Object} data - 必填, 请求参数
* @return {Promise} 返回接口的promise对象
* */
export const postProperty = params => {
    const url = API.postProperty;
    return Request.post({ url, params });
};

/**
* @describe 获取bundle列表
* @params {Object} data - 选填, 请求参数
* @return {Promise} 返回接口的promise对象
* */
export const getBundleList = params => {
    const url = API.getBundles;
    return Request.get({ url, params });
};

/**
* @describe 更新bundle列表
* @params {Object} data - 必填, 请求参数
* @return {Promise} 返回接口的promise对象
* */
export const updateBundle = params => {
    const url = API.updateBundle;
    console.log('params', params);
    return Request.put({ url, params });
};

/**
* @describe 获取用户信息
* @params {Object} data - 选填, 请求参数
* @return {Promise} 返回接口的promise对象
* */
export const getUser = params => {
    const url = API.getUser;
    return Request.get({ url, params });
};

/**
* @describe 注册新用户
* @params {Object} data - 选填, 请求参数
* @return {Promise} 返回接口的promise对象
* */
export const reg = params => {
    const url = API.reg;
    return Request.post({ url, params });
};