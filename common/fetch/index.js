/**
 * Created by yunhailu on 2017/8/7.
 */

import API from './API';
import axios from 'axios';

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
        return axios[opts.method](url, data).then(response => {
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
        return axios.get(url, {params}).then(response => {
            if(response.status == 200 && response.statusText == "OK") {
                return response.data;
            }
            return null;
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
        return axios.post(url, params).then(response => {
            if(response.status == 200 && response.statusText == "OK") {
                return response.data;
            }
            return null;
        });
    }
};

/**
* @describe 获取用户信息
* @params {Object} data - 必填, 请求参数
* @return {Promise} 返回接口的promise对象
* */
export const getCustomer = params => {
    const method = 'get',
        url = API.getCustomer;
    //return Request[method]({ url, params });
    return Request.json({ url, method, params });
};

