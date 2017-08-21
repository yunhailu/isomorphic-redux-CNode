import config from '../../config';
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

export default function zipBundle(fileName, baseName, resourceId, operate){
    console.log('config.baseDir', config.baseDir);
    console.log('resourceId', `${resourceId}`);
    console.log('baseName', baseName);
    console.log('operate', operate);
    console.log('fileName', `${fileName}.zip`);
    console.log('FirestoutputPath', fileName);
    console.log('alltoutputPath', path.resolve(config.baseDir, 'bundle_packages', `${resourceId}`, baseName, 'output', operate, `${fileName}.zip`));
    const outputPath = path.resolve(config.baseDir, 'bundle_packages', `${resourceId}`, baseName, 'output', operate, `${fileName}.zip`);
    console.log('outputPath',outputPath);
    const output = fs.createWriteStream(outputPath);
    const zipArchive = archiver('zip');

    output.on('close', function() {
        console.log('done with the zip', outputPath);
    });

    zipArchive.pipe(output);

    const getStream = function(fileonly){
      return fs.readFileSync(fileonly);
    }
    const pathOne = path.resolve(config.baseDir, 'bundle_packages', `${resourceId}`, baseName, 'output', operate, fileName);
    
    zipArchive.append(getStream(pathOne), { name: fileName});

    zipArchive.finalize(function(err, bytes) {

        if(err) {
          throw err;
        }

        console.log('done:', bytes);

    });
}