import {renderToString} from 'react-dom/server';
import qs from 'qs';
import {Provider} from 'react-redux';
import reducerApp from '../common/reducers/index';
import React from 'react';
import {RouterContext,match} from 'react-router';
import {receiveBundles, receiveProperty, receiveUser} from '../common/actions/actions';
import storeApp from '../common/configStore';
import routesApp from '../common/routes';
import fs from 'fs';
import path from 'path';
import * as getInitDatas from './util/initialData';

function renderFullPage(html,initState){
    const main = JSON.parse(fs.readFileSync(path.join(__dirname,'../webpack/webpack-assets.json'))).javascript.main;
    let injectScriptPath = main;
    //console.log(injectScriptPath)
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            
            <title>react-ssr</title>
            <link rel="icon" href="//o4j806krb.qnssl.com/public/images/cnode_icon_32.png" type="image/x-icon">
            <script></script>
        </head>
        <body>
            <div id="container"><div>${html}</div></div>
            <script>
                window.__INITIAL_STATE__ = ${JSON.stringify(initState)}
            </script>
            <script src=${injectScriptPath}></script>
        </body>
        </html>
    `
}

export default function handleRender(req,res){
    match({routes:routesApp,location:req.url},(err,redirectLocation,renderProps)=>{
        if(err){
            res.status(500).end(`server error: ${err}`)
        } else if(redirectLocation){
            console.log('redirectLocation',redirectLocation);
            res.redirect(302,redirectLocation.pathname+redirectLocation.search)
        } else if(renderProps){
            const store = storeApp({});
            Promise.all([
                getInitDatas.getBundles(),
                getInitDatas.getPropertys(),
                getInitDatas.getUser(req)
            ])
            .then(([bundlesList, propertyList, user]) => {
                store.dispatch(receiveBundles(bundlesList)),
                store.dispatch(receiveProperty(propertyList)),
                store.dispatch(receiveUser(user))
            })
            .then(()=>{
                const html = renderToString(
                    <Provider store={store}>
                        <RouterContext {...renderProps}/>
                    </Provider>
                )
                const finalState = store.getState();
                res.end(renderFullPage(html,finalState));
            })
        } else {
            res.status(404).end('404 not found')
        }
    })
}