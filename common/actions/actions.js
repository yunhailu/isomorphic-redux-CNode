import fetch from 'isomorphic-fetch'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const INVALIDATE_POSTS = 'INVALIDATE_POSTS'
export const SELECT_AUTHOR = 'SELECT_AUTHOR'
export const FETCH_ITEM = 'FETCH_ITEM'
export const RECEIVE_USER = 'RECEIVE_USER'
export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'
export const REQUEST_PROPERTY = 'REQUEST_PROPERTY'
export const RECEIVE_PROPERTY = 'RECEIVE_PROPERTY'
export const REQUEST_BUNDLES = 'REQUEST_BUNDLES'
export const RECEIVE_BUNDLES = 'RECEIVE_BUNDLES'
import config from '../../config'
import {propertyList, getBundles, user} from '../util/api'
import { getCookie } from '../util/authService'

function recieveUser(user){
    return {
        type: RECEIVE_USER,
        user
    }
}
export function fetchUser(){
    const token = getCookie('token');
    if(!token){
        console.log('!token');
        return (dispatch)=>{
            return dispatch(recieveUser({}))
        }
    }
    return (dispatch)=>{
        const content = JSON.stringify({
                access_token: token
            })
        return fetch(user,{
            method: 'POST',
            headers:{
                "Content-Type": "application/json",
                "Content-Length": content.length.toString()
            },
            body: content
        }).then(res=>{
            if(res.ok){
                return res.json();
            } else {
                console.log('获取用户失败')
            }
        }).then(json=>{
            dispatch(recieveUser(json))
        })
    }
}
function requestPropertyList(){
    return {
        type: REQUEST_PROPERTY
    }
}
function receiveProperty(json){
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
            method: 'GET'
        }).then(response=>response.json()).then(json=>{
            if (json.ok){
                dispatch(receiveProperty(json.json))
            }
        })
    }
}
export function logIns(user){
    return {
        type: LOG_IN,
        user
    }
}
export function logOut(){
    return {
        type: LOG_OUT
    }
}
function receiveItem(json){
    return {
        type: FETCH_ITEM,
        item: json.data
    }
}
export function selectAuthor(author){
    return {
        type: SELECT_AUTHOR,
        author
    }
}
export function fetchItem(id){
    return dispatch=>{
        return fetch(`/api/detail/?id=${id}`)
        .then(res=>{
            return res.json()
        })
        .then(json=>{
            dispatch(receiveItem(json))
        })
    }
}
export function invalidatePosts(author){
    return {
        type: INVALIDATE_POSTS,
        author
    }
}

function shouldFetchPosts(state,author){
    if(!state.postsByAuthor[author]){
        return true;
    } else {
        const posts = state.postsByAuthor[author];
        if(posts.isFetching) {
            return false;
        } else {
            return posts.didInvalidate;
        }
    }
}

function requestBundles(){
    return {
        type: REQUEST_BUNDLES
    }
}
function receiveBundles(json){
    return {
        type: RECEIVE_BUNDLES,
        bundles: json,
        receivedAt: Date.now()
    }
}
export function fetchBundles(){
    return dispatch=>{
        dispatch(requestBundles())
        return fetch(getBundles)
            .then(response=>response.json())
            .then(json=>{
                if (json.ok){
                    dispatch(receiveBundles(json.json))
                }
            })
    }
}