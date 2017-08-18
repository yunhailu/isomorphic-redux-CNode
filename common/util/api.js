import fetch from 'isomorphic-fetch'
const baseUrl = `/api/`;

export const propertyList = baseUrl + 'propertyList';

export const getBundles = baseUrl + 'getBundles';

export const getUser = baseUrl + 'getUser'; 

export function postApi(apiType, content){
  return fetch(`/api/${apiType}`,{
            method: 'POST',
            credentials: "include",
            headers:{
                "Content-Type": "application/json"
            },
            body: content
        })
}