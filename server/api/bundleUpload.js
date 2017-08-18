import {isPathExist} from '../util/baseHelper';
import config from '../../config';
import ftpUpload from '../util/ftpUpload';
const fs = require('fs');
const path = require('path');

export default function(req,res,next){
    console.log('logoutddd')
    const resourceId = req.body.resourceId;
    const resourceUrl = req.body.resourceUrl;
    const baseName = path.basename(`${resourceUrl}`, path.extname(resourceUrl));
    const androidBuildPath = isPathExist(config.baseDir, 'bundle_packages', `${resourceId}`, baseName, 'output', 'android') && path.resolve(config.baseDir, 'bundle_packages', `${resourceId}`, baseName, 'output', 'android');
    const iosBuildPath = isPathExist(config.baseDir, 'bundle_packages', `${resourceId}`, baseName, 'output', 'ios') && path.resolve(config.baseDir, 'bundle_packages', `${resourceId}`, baseName, 'output', 'ios');
    
    const androidConfig = {
      port: '21',
      host: '192.168.185.128',
      user: 'qatest',
      password: '58ftp@fe',
      remoteRoot: `/pic2.58.com/zhuanzhuan/bundle/${resourceId}/android`,
      fileType: /\.zip$/,
      buildPath: androidBuildPath
    };
    const iosConfig = {
      port: '21',
      host: '192.168.185.128',
      user: 'qatest',
      password: '58ftp@fe',
      remoteRoot: `/pic2.58.com/zhuanzhuan/bundle/${resourceId}/ios`,
      fileType: /\.zip$/,
      buildPath: iosBuildPath
    };
    res.json({ok: true, message: "success"});
    [androidConfig, iosConfig].forEach(function(configEither, index){
      const ftpConfig = new ftpUpload(configEither);
      ftpConfig.upload();
    })
}