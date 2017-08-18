const fs = require('fs');
const path = require('path');
const Client = require('ftp');
import {io} from '../app';

export default class ftpUpload {
  constructor(options){
    this.config = options;
  }

  upload() {
    const client = new Client();
    const cfg = this.config;
    let remoteRoot = `${cfg.remoteRoot}`;
    let buildPath = cfg.buildPath;
    fs.readdir(buildPath, (err, files) => {
      if (err) {
        console.log('read directory got wrong \n');
        throw err;
      }

      client.on('ready', () => {
        client.cwd(cfg.remoteRoot, () => {
          client.mkdir(remoteRoot, true, (err) => {
            if (err) {
              console.log('failed to create directory, check the function of client.mkdir\n');
              console.log(err);
            }
            files.forEach((file, index) => {
              if (this.config.fileType.test(file)) {
                const filePath = `${buildPath}/${file}`;
                client.put(
                  filePath,
                  `${remoteRoot}/${file}`,
                  (err) => {
                    if (err) {
                      console.log('upload failed！\n');
                      console.log(err);
                    }
                    console.log(`${file} uploaded..`);
                    io.emit('bundleUpload', 'uploaded ok')
                    client.end();
                    /*if (index === files.length - 1) {
                     client.end();
                     }*/
                  }
                );
              }
            });
          });
        });
      });
      //console.log(this.config);
      client.on('error', (err) => {
        console.log('连接客户端出错：\n');
        console.log(err);
      });
      client.connect(this.config);
    });
  }
}