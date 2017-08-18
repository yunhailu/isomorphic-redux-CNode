import Bundle from '../Models/bundle';
import config from '../../config';
import {io} from '../app';
import {isPathExist, getFilesPromise, getsyncFiles, filteingFiles} from '../util/baseHelper';
import zipBundle from '../util/zipBundle';
const shell = require('shelljs');
const BundleEntity = new Bundle();
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

    return Bundle.count({
        resourceUrl,
        isDel: false
    }).exec()
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
        return Bundle.create({
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
        files.push(intFile)
    })
    let maxOne = files.reduce(function(a,b){
        return Math.max(a,b)
    });
    return maxOne;
}

function zipBundles(lists, bundleId, platForm){
    lists.forEach(function(file, index){
        console.log('zipBundle', zipBundle);
        zipBundle(file, bundleId, platForm);
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
        shell.cd('../');
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
        console.log('isUseOldDependency', isUseOldDependency)
        const pathCon = isPathExist(config.baseDir, 'bundle_packages', 'bundle_nodeModules') && path.resolve(config.baseDir, 'bundle_packages', 'bundle_nodeModules')
        // copy last node_modules to contempotary directory.
        let lastBundleId = getMaxFile(pathCon);
        const lastModulesDirectory = isPathExist(config.baseDir, 'bundle_packages', 'bundle_nodeModules', `${lastBundleId}`, 'node_modules') && path.resolve(config.baseDir, 'bundle_packages', 'bundle_nodeModules', `${lastBundleId}`, 'node_modules');
        console.log('lastModulesDirectory',lastModulesDirectory)
        lastModulesDirectory && shell.cp('-R', lastModulesDirectory, './')
    }else{
        console.log('isUseOldDependency false', isUseOldDependency)
        const bundleModulesDirectory = path.resolve(config.baseDir, 'bundle_packages', 'bundle_nodeModules', `${tempBundleId}`);
        shell.exec('npm install')
        shell.cp('-R', 'node_modules/',bundleModulesDirectory)
    }
    shell.exec('sh bundleSplit.sh');
    const androidBundlepath = path.resolve(config.baseDir, 'bundle_packages', `${tempBundleId}`, baseName, 'output', 'android');
    const iosBundlepath = path.resolve(config.baseDir, 'bundle_packages', `${tempBundleId}`, baseName, 'output', 'ios');   
    // android zip.
    let androidFilterFiles = filteingFiles(null,getsyncFiles(androidBundlepath));
    let iosFilterFiles = filteingFiles(null,getsyncFiles(iosBundlepath));
    console.log('androidFilterFiles',androidFilterFiles);
    console.log('iosFilterFiles',iosFilterFiles);
    zipBundles(androidFilterFiles, tempBundleId, 'android');
    zipBundles(iosFilterFiles, tempBundleId, 'ios');
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
    const body = req.body;
    console.log('req.body.isUseOldDependency',req.body.isUseOldDependency);
    const isUseOldDependency = (req.body.isUseOldDependency == "是")? true: false;
    generateBundle(body).then((bundle) => {
                          res.json({ok: true, message: "success"});
                          return buildPackage(bundle, isUseOldDependency)
                        })
                        .then(([bundleAndr, bundleIos]) => {
                            console.log('bundleAndr',bundleAndr);
                            const bundleName = {
                                ios: bundleIos,
                                android: bundleAndr
                            }
                            console.log('tempBundleId',tempBundleId);
                            return Bundle.findOneAndUpdate({resourceId: tempBundleId}, {$set:{bundleName:bundleName}}, {new: true})
                        })
                        .then(function(doc){
                            console.log(doc,'doc');
                            io.emit('bundled', 'ok')
                        })
                        .catch(err => {
                            throw new Error(err);
                        })
}