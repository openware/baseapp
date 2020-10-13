#!/usr/bin/env node

var execProcess = require('./exec-process.js');
const fs = require('fs');

const makeBuild = () => {
    execProcess.result(`bash ./bin/android-build-debug.bash`, (err, response) => {
        if(!err) {
            console.log('Your android build was successful. Your apk file is located at android/app/build/outputs/apk/debug');
        } else {
            console.log(err);
        }
    })
}

makeBuild();