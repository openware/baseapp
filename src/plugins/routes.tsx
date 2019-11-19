import * as React from 'react';
import { pluginsList } from '../api/config';
import { IEORoutes } from './ieo';

export const renderPluginsRoutes = () => {
    const getRoutes = (plugin, index) => {
        switch (plugin) {
            case 'ieo':
                return <IEORoutes key={index} />;
            default:
                return;
        }
    };

    return pluginsList().map((item, index) => getRoutes(item.name, index));
};
