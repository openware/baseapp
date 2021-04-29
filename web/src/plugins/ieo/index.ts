
import { BaseappPlugin, BaseappPluginInterface } from '../BaseappPlugin';
import { ieoMenuIcons, ieoMenuItem, ieoTranslations } from './constants';
import { ieoRoutes } from './containers';
import { ieoPluginReducer, rootIEOPluginsSaga } from './modules';

export * from './modules';
export * from './translations';

export const IeoPlugin: BaseappPluginInterface =
    new BaseappPlugin(ieoPluginReducer, rootIEOPluginsSaga, ieoRoutes, ieoMenuItem, ieoMenuIcons, ieoTranslations);
