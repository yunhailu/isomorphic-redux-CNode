import fetch from 'isomorphic-fetch'

export const addProperty = (content) => {
    fetch('/api/property',{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "Content-Length": content.length.toString()
        },
        body: content
    })
}

export const fetchProperty = () => {
    fetch('/api/propertyList')
}