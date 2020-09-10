#!/usr/bin/env node

var execProcess = require("./exec-process.js");
const fs = require('fs');

const getPlugins = (callback) => {
    fs.readFile("plugins.json", 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        callback(JSON.parse(data));
    });
};

const githubUrl = (plugin) => `git@${plugin.git.split('/')[0]}:${plugin.git.split('/').slice(1).join('/')}.git`
const pluginPath = (plugin) => plugin.git.split('/').pop();

getPlugins(plugins => {
    if (plugins.length) {
        plugins.map(p => {
            if (p.git) {
                execProcess.result(`bash ./bin/clone.bash --git ${githubUrl(p)} --folder ${pluginPath(p)}`, function(err, response){
                    if (!err){
                        console.log(`Cloned ${p.name} from ${p.git} to src/plugins/${pluginPath(p)}`);
                    } else {
                        console.log(err);
                    }
                });
            }
        });
        const wait = time => new Promise((resolve) => setTimeout(resolve, time));
        wait(2000).then(() => {
            execProcess.result(`yarn prepare:plugins`, function(err, response){
                if (!err) {
                    console.log(response);
                } else {
                    console.log(err);
                }
            });
        });
    } else {
        console.log('Define plugin in plugins.json file');
    }
});
