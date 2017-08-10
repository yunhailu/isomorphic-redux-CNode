import express from 'express';
import path from 'path';
import qs from 'qs';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import apiRouter from './api/apiRouter';
import logger from 'morgan';
import WBCas from './middleware/wbauth';
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

import handleRender from './render';

const mongoose = require("mongoose");
import config from '../config';


const app = new express();
const port = 3000;

app.set('jwtTokenSecret',"lishoulong");

if(process.env.NODE_ENV === 'development'){
    app.use(logger('dev'));
}
app.use(session({
    store: new MongoStore({ 
        mongooseConnection: mongoose.createConnection(`${config.dbaddr}:${config.dbport}/${config.db}`,{user:config.dbuser,pass:config.dbpwd}),
        ttl: 2 * 60 * 60,
    }),
    secret: 'zhuanzhuan',
    cookie:{
        maxAge: 2 * 60 * 60 * 1000
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'../assets')))
app.use(express.static(path.join(__dirname,'../public')))
app.use(express.static(path.join(__dirname,'../dist')))
// app.use(WBCas());//used for the 58 login;
app.all("*",(req,res,next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
});
app.use('/api',apiRouter);
/*
app.use('*',(req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../client/index.html'))
})*/
app.use('*',handleRender);

app.listen(port,err=>{
    if(err){
        console.error(err);
    } else {
        console.info(`the express server has been listened at port: ${port},haha`)
    }
})