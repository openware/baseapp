
export interface BaseappPluginInterface {
        // tslint:disable-next-line: no-any
    getReduxReducer: () => any;              /* root plugin's redux reducer */
    // tslint:disable-next-line: no-any
    getReduxSaga: () => any;                                        /* root plugin's redux saga */
    getRoutes: (userLoading, isCurrentSession) => JSX.Element[];    /* plugin's routes */
    getMenu: (isLoggedIn: boolean, isLight?: boolean) => string[];       /* plugin's menu items */
    getMenuIcons: (name: string, className?: string) => JSX.Element;                    /* plugin's menu icons */
    getTranslations: (lang: string) => Object;
    hasCustomApi: () => boolean;                                    /* plugin's custom API */
}

export class BaseappPlugin implements BaseappPluginInterface {
    // tslint:disable-next-line: no-any
    public getReduxReducer: () => any;
    // tslint:disable-next-line: no-any
    public getReduxSaga: () => any;
    public getRoutes: (userLoading, isCurrentSession) => JSX.Element[];
    public getMenu: (isLoggedIn: boolean, isLight?: boolean) => string[];
    public getMenuIcons: (name: string, className?: string) => JSX.Element;
    public getTranslations: (lang: string) => Object;
    public hasCustomApi: () => boolean;

    constructor(reduxReduser, reduxSaga, routes, menu, icons, translations, api) {
        this.getReduxReducer = () => reduxReduser;
        this.getReduxSaga = () => reduxSaga;
        this.getRoutes = routes;
        this.getMenu = menu;
        this.getMenuIcons = icons;
        this.getTranslations = translations;
        this.hasCustomApi = () => api;
    }
}
