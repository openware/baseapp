import { pluginsList } from '../api/config';

export const pluginsConstants = (isLight?: boolean) => {
    const availablePlugins = {
        ieo: ['page.header.navbar.ieo', '/ieo',`ieo${isLight ? 'Light' : ''}`],
    };

    return pluginsList().map(item => availablePlugins[item.name]);
};

export const ieoTypesList = (): string[] => pluginsList().find(item => item.name === 'ieo' && item.config.types);
export const metadataSettings = (): boolean => pluginsList().find(item => item.name === 'ieo' && item.config.metadata);
