import { pluginsList } from '../api';
import { ieoRoutes } from './ieo';

export const renderPluginsRoutes = () => {
    const getRoutes = (plugin, index) => {
        switch (plugin) {
            case 'ieo':
                return ieoRoutes(index);
            default:
                return;
        }
    };

    return pluginsList().map((item, index) => getRoutes(item.name, index));
};
