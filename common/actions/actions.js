import { getPropertyList, getBundleList, getUser } from '../util/fetch';
export const ADD_USER = 'ADD_USER'
export const LOG_OUT = 'LOG_OUT'
export const REQUEST_PROPERTY = 'REQUEST_PROPERTY'
export const RECEIVE_PROPERTY = 'RECEIVE_PROPERTY'
export const REQUEST_BUNDLES = 'REQUEST_BUNDLES'
export const RECEIVE_BUNDLES = 'RECEIVE_BUNDLES'
export const REQUEST_USER = 'REQUEST_USER'
export const RECEIVE_USER = 'RECEIVE_USER'
import config from '../../config'
// import {propertyList, getBundles, getUser} from '../util/api'

function requestPropertyList(){
    return {
        type: REQUEST_PROPERTY
    }
}
export function receiveProperty(json){
    return {
        type: RECEIVE_PROPERTY,
        propertys: json,
        receivedAt: Date.now()
    }
}
export function fetchPropertyList(){
    return dispatch=>{
        dispatch(requestPropertyList())
        return getPropertyList({params: {}}).then(data=>{
            if (data.ok){
                dispatch(receiveProperty(data.json))
            }else{
                console.log('获取属性列表失败')
            }
        })
    }
}
function requestUser(){
    return {
        type: REQUEST_USER
    }
}
export function receiveUser(user){
    return {
        type: RECEIVE_USER,
        user
    }
}
export function fetchUser() {
    return dispatch=>{
        dispatch(requestUser())
        return getUser({params: {}}).then(data=>{
            if (data.ok){
                dispatch(receiveUser(data.json))
            }else{
                console.log('获取用户失败')
            }
        })
    }
}
export function addUser(json){
    return {
        type: ADD_USER,
        userName: json.userName
    }
}
export function logOut(){
    return {
        type: LOG_OUT
    }
}

function requestBundles(){
    return {
        type: REQUEST_BUNDLES
    }
}
export function receiveBundles(json){
    return {
        type: RECEIVE_BUNDLES,
        bundles: json,
        receivedAt: Date.now()
    }
}
export function fetchBundles(){
    return dispatch=>{
        dispatch(requestBundles())
        return getBundleList({params: {}})
            .then(data=>{
                if (data.ok){
                    dispatch(receiveBundles(data.json))
                }else{
                    console.log('获取bundle列表失败')
                }
            })
    }
}