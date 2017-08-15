import fetch from 'isomorphic-fetch'
export const ADD_USER = 'ADD_USER'
export const LOG_OUT = 'LOG_OUT'
export const REQUEST_PROPERTY = 'REQUEST_PROPERTY'
export const RECEIVE_PROPERTY = 'RECEIVE_PROPERTY'
export const REQUEST_BUNDLES = 'REQUEST_BUNDLES'
export const RECEIVE_BUNDLES = 'RECEIVE_BUNDLES'
export const REQUEST_USER = 'REQUEST_USER'
export const RECEIVE_USER = 'RECEIVE_USER'
import config from '../../config'
import {propertyList, getBundles, getUser} from '../util/api'

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
        return fetch(propertyList,{
            method: 'GET',
            credentials: "include"
        }).then(response=>response.json()).then(json=>{
            if (json.ok){
                dispatch(receiveProperty(json.json))
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
        return fetch(getUser,{
                method: 'GET',
                credentials: "include"
            })
            .then(res => {
                if(res.ok){
                    return res.json()
                }
                console.log('获取用户失败')
            })
            .then(json=>{
                dispatch(receiveUser(json))
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
        return fetch(getBundles,{
                method: 'GET',
                credentials: "include"
            })
            .then(response=>response.json())
            .then(json=>{
                if (json.ok){
                    dispatch(receiveBundles(json.json))
                }
            })
    }
}