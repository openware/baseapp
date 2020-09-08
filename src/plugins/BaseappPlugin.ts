
export interface HeaderActions {
    pagesWithFilter?: string[];                                     /* routes which requires filter icon */
    pagesWithRefresh?: string[];                                    /* routes which requires refresh icon */
    pagesWithExport?: string[];                                     /* routes which requires export icon */
    customHeaderActions?: JSX.Element;                              /* custom header actions */
}

export interface BaseappPluginInterface {
        // tslint:disable-next-line: no-any
    getReduxReducer: () => any;              /* root plugin's redux reducer */
    // tslint:disable-next-line: no-any
    getReduxSaga: () => any;                                        /* root plugin's redux saga */
    getRoutes: (userLoading, isCurrentSession) => JSX.Element[];    /* plugin's routes */
    getHeaderActions: () => HeaderActions;                          /* plugin's header actions like Filter, Refresh at the NavBar */
    getMenu: (isLoggedIn: boolean, isLight?: boolean) => string[];       /* plugin's menu items */
    getMenuIcons: (name: string) => JSX.Element;                    /* plugin's menu icons */
    hasCustomApi: () => boolean;                                    /* plugin's custom API */
}

export class BaseappPlugin implements BaseappPluginInterface {
    // tslint:disable-next-line: no-any
    public getReduxReducer: () => any;
    // tslint:disable-next-line: no-any
    public getReduxSaga: () => any;
    public getRoutes: (userLoading, isCurrentSession) => JSX.Element[];
    public getHeaderActions: () => HeaderActions;
    public getMenu: (isLoggedIn: boolean, isLight?: boolean) => string[];
    public getMenuIcons: (name: string) => JSX.Element;
    public hasCustomApi: () => boolean;

    constructor(reduxReduser, reduxSaga, routes, headerActions, menu, icons, api) {
        this.getReduxReducer = () => reduxReduser;
        this.getReduxSaga = () => reduxSaga;
        this.getRoutes = routes;
        this.getHeaderActions = () => headerActions;
        this.getMenu = menu;
        this.getMenuIcons = icons;
        this.hasCustomApi = () => api;
    }
}
