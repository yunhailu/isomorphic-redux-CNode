import config from '../../config';
const path = require('path');
const fs = require('fs');

export function isPathExist(...theArgs){
    let paths = "";
    paths = theArgs.reduce(function(sum,value){
        return path.resolve(sum, value)
    }, config.baseDir);
    return fs.existsSync(paths);
}

export function filteingFiles(err, files){
    console.log('files', files)
    if (err) return err;
    const expBundle = /.bundle/;
    return files.filter(function(file){
        return expBundle.test(path.extname(file))
    })
}

export function getsyncFiles(dir){
    return fs.readdirSync(dir);
}

export function getFilesPromise(dir, done, resolve,reject){
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
                getFilesPromise(file, function(err, res) {
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