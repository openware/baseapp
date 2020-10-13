#!/usr/bin/env node

var execProcess = require('./exec-process.js');
const fs = require('fs');

const makeBuild = (callback) => {
    fs.readFile("androidBuildRelease.json", 'utf-8', (err, data) => {
        if (err) {
            throw err;
        }

        callback(JSON.parse(data));
    });
};

makeBuild(config => {
    execProcess.result(`bash ./bin/android-build-release.bash --keystore_path ${config.keystore_path} --keystore_pass ${config.keystore_pass} --keystore_alias ${config.keystore_alias} --android_sdk_root ${config.android_sdk_root}`, (err, response) => {
        if(!err) {
            console.log('Your android build was successful. Your apk file is located at android/app/build/outputs/apk/release');
        } else {
            console.log(err);
        }
    })
});