#!/usr/bin/env node

const fs = require('fs');
var exec = require("./exec-process.js");

const getPlugins = (callback) => {
    fs.readFile("plugins.json", 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        callback(JSON.parse(data));
    });
};

var templateName = process.argv.slice(2)[0];
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const rootIndexFile = `
import { TowerPlugin, TowerPluginInterface } from '../TowerPlugin';
import { ${templateName}Actions, ${templateName}MenuIcons, ${templateName}MenuItems } from './constants';
import { ${templateName}PluginReducer, root${capitalize(templateName)}PluginSaga } from './modules';

export * from './modules';

export const ${capitalize(templateName)}Plugin: TowerPluginInterface =
    new TowerPlugin(${templateName}PluginReducer, root${capitalize(templateName)}PluginSaga, ${templateName}Routes, ${templateName}Actions, ${templateName}MenuItems, ${templateName}MenuIcons, null);
`

const rootConstantsFile = `
import * as React from 'react';
import { HeaderActions, MenuItem } from '../TowerPlugin';

export const ${templateName}MenuItems: MenuItem[] = [
    { key: '/tower/plugins/${templateName}', value: '${capitalize(templateName)}', isLink: true },
];

export const ${templateName}MenuIcons = (name: string) => {
    switch (name) {
        case '/tower/plugins/${templateName}':
            return (
                <svg />
            );
        default: return;
    }
};

export const pagesWithFilter = ['/tower/plugins/${templateName}'];

export const pagesWithRefresh = ['/tower/plugins/${templateName}'];

export const ${templateName}Actions: HeaderActions = {
    pagesWithFilter,
    pagesWithRefresh,
};

`

const rootModulesFile = `
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

// tslint:disable-next-line: no-empty-interface
export interface ${capitalize(templateName)}PluginState {

}

export const ${templateName}PluginReducer = combineReducers({

});

export function* root${capitalize(templateName)}PluginSaga() {
    yield all([

    ]);
}
`
const pluginItemJson = plugin =>
    plugin.git ? (
`
    {
        "name": "${plugin.name}",
        "git": "${plugin.git}"
    }
`
) : (
`
    {
        "name": "${plugin.name}"
    }
`
);

const pluginsJson = pluginsJsonList => (
`[${pluginsJsonList.join('    ,')}]`
)

exec.result(`bash ./bin/create-folders.bash --plugin ${templateName}`, function(err, response){
    if (!err){
        fs.writeFileSync(`./src/plugins/${templateName}/index.ts`, rootIndexFile);
        fs.writeFileSync(`./src/plugins/${templateName}/constants.tsx`, rootConstantsFile);
        fs.writeFileSync(`./src/plugins/${templateName}/modules/index.ts`, rootModulesFile);
        getPlugins(plugins => {
            const pluginsJsonList = [ ...plugins.filter(item => item.name !== templateName), { name: templateName }].map(pluginItemJson);
            fs.writeFileSync('plugins.json', pluginsJson(pluginsJsonList));
        });
        exec.result(`yarn prepare:plugins`, function(err, response){
            if (!err) {
                console.log(response);
            } else {
                console.log(err);
            }
        });
        console.log(`Generated plugin template`);
    } else {
        console.log(err);
    }
});
