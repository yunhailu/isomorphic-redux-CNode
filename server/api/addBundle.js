import bundleService from '../service/bundle';
import config from '../../config';
import {io} from '../app';
import {isPathExist, getFilesPromise, getsyncFiles, filteingFiles} from '../util/baseHelper';
import zipBundle from '../util/zipBundle';
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const android = {},
      ios = {};
let tempBundleId = "";

let handleFiles = function handleFiles(err, files, resolve, reject){
    if (err) return reject(err);
    if(!files || (files.length < 1)) return;
    let bundleObject = {};
    let filterdFiles = filteingFiles(err, files);
    filterdFiles.forEach(function(file){
        let lastPart = file.substr(file.lastIndexOf(path.sep) + 1);
        // add the zip extention;
        lastPart = `${lastPart}.zip`;
        const baseIndex = lastPart.split('.').indexOf('base');
        if(parseInt(baseIndex) == 0){
            bundleObject.baseName = lastPart
        }else {
            bundleObject.projectName = lastPart
        }
    })
    resolve(bundleObject);
}
function generateBundle(body){
    const partUserType = body.partUserType,
        appType = body.appType,
        baseType = body.baseType,
        businessType = body.businessType,
        utilityType = body.utilityType,
        description = body.description,
        simDescription = body.simDescription,
        resourceUrl = body.resourceUrl,
        beforeValue = body.beforeValue,
        forceValue = body.forceValue,
        isUseOldDependency = body.isUseOldDependency;

    return bundleService.countBundle({
          resourceUrl,
          isDel: false
      })
      .then(function(count){
        const date = new Date();
        const time = {
            date: date,
            year : date.getFullYear(),
            month : date.getFullYear() + "-" + (date.getMonth() + 1),
            day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
            minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
        };
        // if(count){
        //     throw new Error('Bundle已经存在 ');
        // }
        return bundleService.createBundle({
            partUserType,
            appType,
            baseType,
            businessType,
            utilityType,
            description,
            simDescription,
            resourceUrl,
            beforeValue,
            forceValue,
            createdTime: time.minute,
            isUseOldDependency
        })
      })
};

function getMaxFile(filePath){
    let files = [];
    fs.readdirSync(filePath).forEach(file => {
        const intFile = parseInt(file, 10);
        // 剔除NaN
        if (intFile === intFile){
            files.push(intFile)
        }
    })
    console.log('files',files);
    let maxOne = files.reduce(function(a,b){
        return Math.max(a,b)
    });
    return maxOne;
}

function zipBundles(lists, baseName, bundleId, platForm){
    lists.forEach(function(file, index){
        zipBundle(file, baseName, bundleId, platForm);
    })
}

function buildPackage (bundle, isUseOldDependency){
    const url = bundle.resourceUrl;
    tempBundleId = bundle.resourceId;
    const baseName = path.basename(url, path.extname(url));
    console.log('tempBundleId',tempBundleId);
    shell.cd(config.baseDir);
    if(!isPathExist('bundle_packages')){
        console.log(1)
        // create the root project directory
        shell.mkdir('bundle_packages');
        shell.cd(`bundle_packages`);
        // create the node_modules directory
        shell.mkdir('bundle_nodeModules');
        shell.cd('bundle_nodeModules');
        shell.mkdir(`${tempBundleId}`);
        shell.cd(`${tempBundleId}`);
        shell.mkdir('node_modules');
        shell.cd('../..');
    }else{
        console.log(2)
        shell.cd(`bundle_packages`);
    }
        console.log(3)
    console.log('isDirecsdfsdf', !isPathExist('bundle_packages', `${tempBundleId}`));
    // if the specific project directory is not exist, create it. 
    !isPathExist('bundle_packages', `${tempBundleId}`) && shell.mkdir('-p',`${tempBundleId}`);
    shell.cd(`${tempBundleId}`);
    shell.exec(`git clone ${url}`);
    shell.cd(baseName);
    if (isUseOldDependency){
        const pathCon = isPathExist(config.baseDir, 'bundle_packages', 'bundle_nodeModules') && path.resolve(config.baseDir, 'bundle_packages', 'bundle_nodeModules')
        // copy last node_modules to contempotary directory.
        let lastBundleId = getMaxFile(pathCon);
        console.log('lastBundleId',lastBundleId);
        const lastModulesDirectory = isPathExist(config.baseDir, 'bundle_packages', 'bundle_nodeModules', `${lastBundleId}`, 'node_modules') && path.resolve(config.baseDir, 'bundle_packages', 'bundle_nodeModules', `${lastBundleId}`, 'node_modules');
        console.log('lastModulesDirectory',lastModulesDirectory)
        lastModulesDirectory && shell.cp('-R', lastModulesDirectory, './')
    }else{
        console.log('isUseOldDependency false', isUseOldDependency)
        // 创建放置node_modules的文件夹。
        shell.cd('../../bundle_nodeModules');
        shell.mkdir(`${tempBundleId}`);
        shell.cd(`../${tempBundleId}/baseName`);
        const bundleModulesDirectory = path.resolve(config.baseDir, 'bundle_packages', 'bundle_nodeModules', `${tempBundleId}`, 'node_modules');
        shell.exec('npm install')
        shell.cp('-R', './node_modules',bundleModulesDirectory)
    }
    shell.exec('sh bundleSplit.sh');
    const androidBundlepath = path.resolve(config.baseDir, 'bundle_packages', `${tempBundleId}`, baseName, 'output', 'android');
    const iosBundlepath = path.resolve(config.baseDir, 'bundle_packages', `${tempBundleId}`, baseName, 'output', 'ios');   
    // android zip.
    let androidFilterFiles = filteingFiles(null,getsyncFiles(androidBundlepath));
    let iosFilterFiles = filteingFiles(null,getsyncFiles(iosBundlepath));
    console.log('androidFilterFiles',androidFilterFiles);
    console.log('iosFilterFiles',iosFilterFiles);
    zipBundles(androidFilterFiles, baseName, tempBundleId, 'android');
    zipBundles(iosFilterFiles, baseName, tempBundleId, 'ios');
    return Promise.all([
        new Promise(function(resolve,reject){
            getFilesPromise(androidBundlepath,handleFiles,resolve,reject)
        }),
        new Promise(function(resolve,reject){
            getFilesPromise(iosBundlepath,handleFiles,resolve,reject)
        })
    ])
}

export default function (req,res,next){
    const body = JSON.parse(req.body.params);
    console.log('req.body.isUseOldDependency',body.isUseOldDependency);
    const isUseOldDependency = (body.isUseOldDependency == "是")? true: false;
    generateBundle(body).then((bundle) => {
                          res.json({ok: true, data: "success"});
                          return buildPackage(bundle, isUseOldDependency)
                        })
                        .then(([bundleAndr, bundleIos]) => {
                            console.log('bundleAndr',bundleAndr);
                            const bundleName = {
                                ios: bundleIos,
                                android: bundleAndr
                            }
                            console.log('tempBundleId',tempBundleId);
                            return bundleService.findAndUpdate({resourceId: tempBundleId}, {$set:{bundleName:bundleName}}, true)
                        })
                        .then(function(doc){
                            console.log(doc,'doc');
                            io.emit('bundled', 'ok')
                        })
                        .catch(err => {
                            throw new Error(err);
                        })
}