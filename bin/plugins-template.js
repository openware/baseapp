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
import { BaseappPlugin, BaseappPluginInterface } from '../BaseappPlugin';
import { ${templateName}MenuIcons, ${templateName}MenuItems, ${templateName}Translations } from './constants';
import { ${templateName}Routes } from './containers';
import { ${templateName}PluginReducer, root${capitalize(templateName)}PluginSaga } from './modules';

export * from './modules';

export const ${capitalize(templateName)}Plugin: BaseappPluginInterface =
    new BaseappPlugin(${templateName}PluginReducer, root${capitalize(templateName)}PluginSaga, ${templateName}Routes, ${templateName}MenuItems, ${templateName}MenuIcons, ${templateName}Translations);
`

const rootConstantsFile = `
import * as React from 'react';

export const ${templateName}MenuItems = (isLoggedIn: boolean, isLight?: boolean) => [
    ['page.header.navbar.${templateName}', '/${templateName}', \`${templateName}\${isLight ? 'Light' : ''}\`],
];

export const ${templateName}Translations = (lang: string) => {
    const file = require(\`./translations/\${lang}\`);

    return file[lang];
};

export const ${templateName}MenuIcons = (name: string, className?: string) => {
    switch (name) {
        case '${templateName}':
            return (
                <svg />
            );
        default: return null;
    }
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

const translationsEnFile = 'export const en = {};\n';
const rootStylesFile = '@import \'./themes/style.pcss\';\n';
const stylesThemesFile = `
@import './dark.pcss';
@import './light.pcss';
`;

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
        fs.writeFileSync(`./src/plugins/${templateName}/styles/style.pcss`, rootStylesFile);
        fs.writeFileSync(`./src/plugins/${templateName}/styles/themes/style.pcss`, stylesThemesFile);
        fs.writeFileSync(`./src/plugins/${templateName}/styles/themes/light.pcss`, '/* stylelint-disable-no-empty-source */\n');
        fs.writeFileSync(`./src/plugins/${templateName}/styles/themes/dark.pcss`, '/* stylelint-disable-no-empty-source */\n');
        fs.writeFileSync(`./src/plugins/${templateName}/translations/en.ts`, translationsEnFile);

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
