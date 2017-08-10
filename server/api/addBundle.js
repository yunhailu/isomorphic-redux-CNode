import Bundle from '../Models/bundle';
import config from '../../config';
const shell = require('shelljs');
const BundleEntity = new Bundle();
const path = require('path');
const fs = require('fs');
const android = {},
      ios = {};
let tempBundleId = "";
let getFiles = function getFiles(dir, done, resolve,reject){
    console.log('dir',dir)
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        console.log('length', list.length);
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results, resolve, reject);
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                walk(file, function(err, res) {
                    results = results.concat(res);
                    next();
                });
                } else {
                results.push(file);
                next();
                }
            });
        })();
    });
}
let handleFiles = function handleFiles(err, files, resolve, reject){
    if (err) return reject(err);
    if(!files || (files.length < 1)) return;
    const expBundle = /.bundle/;
    const bundleObject = {};
    let filterdFiles = files.filter(function(file){
        return expBundle.test(path.extname(file))
    })
    filterdFiles.forEach(function(file){
        const baseIndex = file.split('.').indexOf('base');
        const lastPart = file.substr(file.lastIndexOf(path.sep) + 1);
        if(parseInt(baseIndex) == 1){
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
        forceValue = body.forceValue;

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
            createdTime: time.minute
        })
      })
};

function buildPackage (bundle){
    const url = bundle.resourceUrl;
    tempBundleId = bundle.resourceId;
    const baseName = path.basename(url, path.extname(url));
    console.log('tempBundleId',tempBundleId);
    // shell.cd(config.baseDir);
    // shell.rm('-rf', 'bundle_packages');
    // shell.mkdir('bundle_packages');
    // shell.cd(`bundle_packages`);
    // shell.mkdir('bundle_packagesss');
    // shell.cd('bundle_packagesss');
    // shell.exec(`git clone ${url}`);
    // shell.cd(baseName);
    // shell.exec('npm install && sh bundleSplit.sh');
    // return new Promise(function(resolve,reject){
    //   resolve('test')
    // })
    const androidBundlepath = path.resolve(config.baseDir, 'bundle_packages', 'bundle_packagesss', baseName, 'output', 'android');
    const iosBundlepath = path.resolve(config.baseDir, 'bundle_packages', 'bundle_packagesss', baseName, 'output', 'ios');
    return Promise.all([
        new Promise(function(resolve,reject){
            getFiles(androidBundlepath,handleFiles,resolve,reject)
        }),
        new Promise(function(resolve,reject){
            getFiles(iosBundlepath,handleFiles,resolve,reject)
        })
    ])
}

export default function (req,res,next){
    const body = req.body;
    generateBundle(body).then((bundle) => {
                          return buildPackage(bundle,res)
                        })
                        .then(([bundleAndr, bundleIos]) => {
                            const bundleName = {
                                ios: bundleIos,
                                android: bundleAndr
                            }
                            console.log('tempBundleId',tempBundleId);
                            Bundle.findOneAndUpdate({resourceId: tempBundleId}, {$set:{bundleName:bundleName}}, {new: true}, function(err, doc){
                                if(err){
                                    console.log("Something wrong when updating data!");
                                }

                                console.log(doc);
                                return res.json({ok: true, message: "success", data: {}});
                            })
                        })
                        .catch(err => {
                            throw new Error('balabala ');
                        })
    // console.log('sdfsd')
    // buildPackage('sssssdd')
    // generateBundle('ss');
}