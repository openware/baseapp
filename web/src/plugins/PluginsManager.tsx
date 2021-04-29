import * as React from 'react';
import { combineReducers } from 'redux';
import { all, call, CallEffect } from 'redux-saga/effects';
import { pluginsList } from '../api/config';
import { pluginsInstances } from './PluginsTemplate';

const pluginsNames = pluginsList().map(item => item.name);

export class PluginsManager {
    public pluginsReducer;
    public rootPluginsSaga;

    constructor() {
        const initialReducer = (state = []) => state;
        let reducerObject = { initialReducer };
        let sagaArray: CallEffect[] = [];

        if (pluginsInstances) {
            for (const key of Object.keys(pluginsInstances)) {
                if (pluginsNames.includes(key)) {
                    reducerObject = { ...reducerObject, [key]: pluginsInstances[key].getReduxReducer() };
                    sagaArray = [ ...sagaArray, call(pluginsInstances[key].getReduxSaga())];
                }
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

    public getRoutes = (userLoading, isCurrentSession) => {
        return Object.keys(pluginsInstances).map(key => pluginsInstances[key].getRoutes(userLoading, isCurrentSession));
    };

    public getMenu = (isLoggedIn: boolean, isLight?: boolean): string[][] => {
        let menuItems: string[][] = [];
        if (pluginsInstances) {
            for (const key of Object.keys(pluginsInstances)) {
                menuItems = [ ...menuItems, ...pluginsInstances[key].getMenu(isLoggedIn, isLight) ];
            }
        }

        return menuItems;
    };

    public getMenuIcons = (name: string, className?: string) => {
        return <>{Object.keys(pluginsInstances).map(key => pluginsInstances[key].getMenuIcons ? pluginsInstances[key].getMenuIcons(name, className) : null)}</>;
    };

    public getTranslations = (lang: string) => {
        let translations = {};

        for (const key of Object.keys(pluginsInstances)) {
            if (pluginsNames.includes(key)) {
                translations = { ...translations, ...pluginsInstances[key].getTranslations(lang)};
            }
        }

        return translations;
    };
}
