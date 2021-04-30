import { Reducer } from 'redux';

// tslint:disable-no-any
export interface BaseappPluginInterface {
    getReduxReducer: () => Reducer<{}>;                               /* root plugin's redux reducer */
    getReduxSaga: () => any;                                          /* root plugin's redux saga */
    getRoutes: (userLoading: boolean, isCurrentSession: boolean) => JSX.Element[];      /* plugin's routes */
    getMenu: (isLoggedIn: boolean, isLight?: boolean) => string[];    /* plugin's menu items */
    getMenuIcons: (name: string, className?: string) => JSX.Element;  /* plugin's menu icons */
    getTranslations: (lang: string) => Object;                        /* plugin's translations object */
}

export class BaseappPlugin implements BaseappPluginInterface {
    public getReduxReducer: () => Reducer<{}>;
    public getReduxSaga: () => any;
    public getRoutes: (userLoading: boolean, isCurrentSession: boolean) => JSX.Element[];
    public getMenu: (isLoggedIn: boolean, isLight?: boolean) => string[];
    public getMenuIcons: (name: string, className?: string) => JSX.Element;
    public getTranslations: (lang: string) => Object;

    constructor(reduxReduser, reduxSaga, routes, menu, icons, translations) {
        this.getReduxReducer = () => reduxReduser;
        this.getReduxSaga = () => reduxSaga;
        this.getRoutes = routes;
        this.getMenu = menu;
        this.getMenuIcons = icons;
        this.getTranslations = translations;
    }
}
