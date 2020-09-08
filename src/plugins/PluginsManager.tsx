// import * as React from 'react';
import { combineReducers } from 'redux';
import { all, call, CallEffect } from 'redux-saga/effects';
import { pluginsList } from '../api/config';
import { pluginsInstances } from './PluginsTemplate';
// import { MenuItem } from './TowerPlugin';

const pluginsNames = pluginsList().map(item => item.name);

export class PluginsManager {
    public pluginsReducer;
    public rootPluginsSaga;
    // public menuItems: MenuItem[] = [];

    constructor() {
        const initialReducer = (state = []) => state;
        let reducerObject = { initialReducer };
        let sagaArray: CallEffect[] = [];

        if (pluginsInstances) {
            for (const key of Object.keys(pluginsInstances)) {
                if (pluginsNames.includes(key)) {
                    reducerObject = { ...reducerObject, [key]: pluginsInstances[key].getReduxReducer() };
                    sagaArray = [ ...sagaArray, call(pluginsInstances[key].getReduxSaga())];
                    // this.menuItems = [ ...this.menuItems, ...pluginsInstances[key].getMenu() ];
                }
                window.console.log(reducerObject);
            }

            this.pluginsReducer = combineReducers(Object.keys(reducerObject).length ? { ...reducerObject } : { initialReducer });
            this.rootPluginsSaga = function* rootPluginsSaga() {
                yield all([ ...sagaArray ]);
            };
        }
    }

    public getReduxReducer() {
        return this.pluginsReducer;
    }

    public getRootPluginsSaga() {
        return this.rootPluginsSaga;
    }

    // public getRoutes = (userLoading, isCurrentSession) => {
    //     return Object.keys(pluginsInstances).map(key => pluginsInstances[key].getRoutes(userLoading, isCurrentSession));
    // };

    // public getMenu = () => {
    //     return [ ...this.menuItems ];
    // };

    // public getMenuIcons = (name: string) => {
    //     return <>{Object.keys(pluginsInstances).map(key => pluginsInstances[key].getMenuIcons ? pluginsInstances[key].getMenuIcons(name) : null)}</>;
    // };

    // public getHeaderActions = () => {
    //     return Object.keys(pluginsInstances).map(key => pluginsInstances[key].getHeaderActions ? pluginsInstances[key].getHeaderActions() : null);
    // };

    // public getAPIUrl = () => {
    //     let PluginsAPI = {};
    //     for (const key of Object.keys(pluginsInstances)) {
    //         if (pluginsNames.includes(key) && pluginsInstances[key].hasCustomApi && pluginsInstances[key].hasCustomApi()) {
    //             pluginsAPI = { ...PluginsAPI, [key]: Tower.config[`${key}Url`] || ''};
    //         }
    //     }

    //     return PluginsAPI;
    // };

    // public getAPIList = (): string[] => {
    //     return pluginsInstances ? Object.keys(pluginsInstances).map(key => pluginsInstances[key].hasCustomApi && pluginsInstances[key].hasCustomApi() ? pluginsInstances[key] : null) : [];
    // };
}
