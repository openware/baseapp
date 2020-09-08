# Tower Plugin

Developing a tower plugin allows you to use custom Tower with your stack

## Create a new plugin

1. Put plugin to `env.js` file
```javascript
    plugins: [
        {
            name: 'newTowerPluginName',
        }
    ],
```
2. Generate plugins template
```bash
yarn plugins:template newTowerPluginName
```
## Clone existing plugin

1. Edit `plugins.json` file in root Tower directory
```json
[
  {
    "name": "newTowerPluginName",
    "git": "github.com/openware/newTowerPluginName"
  }
]
```
2. Put plugin to `env.js` file
```javascript
    plugins: [
        {
            name: 'newTowerPluginName',
        }
    ],
```
3. Clone plugins files
```bash
yarn plugins:clone
```

# Tower Plugin Interface

Plugin should be an object of class ```TowerPlugin```

```typescript
export interface TowerPluginInterface {
    getReduxReducer: () => Reducer<CombinedState<{}>>;              /* root plugin's redux reducer */
    // tslint:disable-next-line: no-any
    getReduxSaga: () => any;                                        /* root plugin's redux saga */
    getRoutes: (userLoading, isCurrentSession) => JSX.Element[];    /* plugin's routes */
    getHeaderActions: () => HeaderActions;                          /* plugin's header actions like Filter, Refresh at the NavBar */
    getMenu: () => MenuItem[];                                      /* plugin's menu items */
    getMenuIcons: (name: string) => JSX.Element;                    /* plugin's menu icons */
    getAPI: () => string[];                                         /* plugin's custom API */
}
```

## Tower Plugin object

After generating a template in your plugin's name root folder ```tower/src/plugins``` there is ```index.ts``` file with plugin object.

Example:

```typescript
export * from './containers';
export * from './components';
export * from './modules';

export const IeoPlugin: TowerPluginInterface =
    new TowerPlugin(ieoPluginReducer, rootIEOPluginsSaga, ieoRoutes, ieoActions, ieoMenuItem, ieoMenuIcons, api);
```
Each prop of TowerPlugin constructor will be described further

## Redux State

In case your plugin can have several redux modules you should export root plugin's state from modules

Example:
```typescript
export interface IeoPluginState {
    ieoPlugin: StateIEO;
    currencies: CurrenciesState;
}
```
** State's name should have structure `${PluginNameInCamelCase}PluginState`

## Redux Reducer

Root plugin's reducer has the same structure as root redux state

Example:
```typescript
export const ieoPluginReducer = combineReducers({
    ieoPlugin: ieoReducer,
    currencies: currenciesReducer,
});
```
## Redux Saga

Root plugin's saga is generator function which consist of all plugin's sagas

Example:
```typescript
export function* rootIEOPluginsSaga() {
    yield all([
        call(rootIEOSaga),
        call(rootCurrenciesSaga),
    ]);
}
```
## Routes

As described earlier routes prop of TowerPlugin constructor is a constant which returns an array of JSX elements.

Here you define all routes you need for your plugin. If a route requires admin to be logged in to Tower use
```typescript
<PrivateRoute />
```
constant from `src/router/Router`

Example:
```jsx
export const ieoRoutes = (userLoading, isCurrentSession) => {
    return ([
            <PrivateRoute
                loading={userLoading}
                isLogged={isCurrentSession}
                exact={true}
                path="/tower/plugins/ieo/:id/edit"
                component={IEOTabs}
            />,
            <PrivateRoute
                loading={userLoading}
                isLogged={isCurrentSession}
                exact={true}
                path="/tower/plugins/ieo"
                component={IEO}
            />,
    ]);
};
```
Props `userLoading, isCurrentSession` will be transferred automatically to the function, don't worry about them.

* `UserLoading` will help your component to render Loading screen if the data about user hasn't loaded yet from the backend.

 * `isCurrentSession` shows to the component that user is logged in.

## Header Actions

For the case when your page needs ability to open Filter component, manual Refresh of the page or Export action create a constant of type HeaderActions:

```ts
export interface HeaderActions {
    pagesWithFilter?: string[];                     /* routes which requires filter icon */
    pagesWithRefresh?: string[];                    /* routes which requires refresh icon */
    pagesWithExport?: string[];                     /* routes which requires export icon */
    customHeaderActions?: JSX.Element;              /* custom header actions */
}
```
Example

```typescript
export const pagesWithFilter = ['/tower/plugins/ieo'];
export const pagesWithRefresh = ['/tower/plugins/ieo'];
export const pagesWithExport = ['/tower/plugins/ieo'];
```
Custom header actions is using for cases when you need to open a modal by clicking on Tower NavBar, redirect to `Add IEO` pages etc.

`customHeaderActions` is a JSX Element with
* an icon which you want to show near header action
* an action itself (opening a modal, redirect to a page)
* a route (page where you want to see that action in NavBar).

Example:
```tsx
import { createStyles, SvgIcon, Theme, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { History } from 'history';
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

const styles = () => createStyles({
    item: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 4,
        cursor: 'pointer',
        transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        padding: '5px 10px',
        borderRadius: 5,
        '&:hover': {
            backgroundColor: '#ffffff1a',
        },
    },
    itemText: {
        textTransform: 'uppercase',
        paddingLeft: 6,
        fontWeight: 'bold',
        fontSize: 12,
        letterSpacing: 0.4,
    },
});

interface RouterProps {
    history: History;
}

interface StyleProps extends WithStyles<typeof styles> {
    theme?: Theme;
}

type Props = StyleProps & RouterProps;

class IEOHeaderActionsComponent extends React.Component<Props> {
    public getAddPageIcon = () => (
        <SvgIcon width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10
                2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10 0C8.68678
                0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035
                2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957
                2.92893 17.0711C3.85752 17.9997 4.95991 18.7362 6.17317 19.2388C7.38642
                19.7413 8.68678 20 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464
                15.1957 20 12.6522 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7362
                4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268
                0.761205C12.6136 0.258658 11.3132 0 10 0ZM11 5H9V9H5V11H9V15H11V11H15V9H11V5Z"
                fill="white"
            />
        </SvgIcon>
    );

    public shouldShowAddIEO(location: string): boolean {
        return ['/tower/plugins/ieo'].includes(location);
    }

    public handleAddIEO() {
        this.props.history.push('/tower/plugins/ieo/add');
    }

    public render() {
        const { history, classes } = this.props;
        return (
            this.shouldShowAddIEO(history.location.pathname) && (
                <div className={classes.item} onClick={() => this.handleAddIEO()}>
                    {this.getAddPageIcon()} <span className={classes.itemText}>Add IEO</span>
                </div>
            )
        );
    }
}

export const IEOHeaderActions = compose(
    withRouter,
    withStyles(styles, { withTheme: true }),
)(IEOHeaderActionsComponent) as React.ComponentClass;
```
Let's put it all together to header action constant:
```typescript
export const ieoActions: HeaderActions = {
    pagesWithFilter,
    pagesWithRefresh,
    customHeaderActions: <IEOHeaderActions key="ieo"/>,
};
```
## Menu
To display plugin's page inside tower Side Bar create an array of `MenuItems`
```typescript
export interface MenuItem {
    key: string;                            /* a route to a page */
    value: string;                          /* menu item's name */
    isLink: boolean;                        /* if true means it opens the page by click, */
}                                           /* false - opens nested sidebar */
```
Example:
```typescript
export const ieoMenuItem: MenuItem[] = [
    { key: '/tower/plugins/ieo', value: 'IEO', isLink: true },
];
```
## Menu icons
If you want to express the meaning of menu item's by some nice icon create a constant which returns a specific icon by route.

Example:
```typescript
export const ieoMenuIcons = (name: string) => {
    switch (name) {
        case '/tower/plugins/ieo':
            return (
                <svg width="32" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="..." fill="#979797"/>
                </svg>
            );
        default: return;
    }
};
```

## Custom API
If you need to apply calls to custom API (besides Peatio, Barong, Applogic) create a boolean constant named api in ```constants.ts``` file

Example:
```typescript
export const api = true;
```

Put that constant to your plugin instance (as last parameter) to ```index.ts``` file

Example:
```typescript
export * from './containers';
export * from './components';
export * from './modules';

export const IeoPlugin: TowerPluginInterface =
    new TowerPlugin(ieoPluginReducer, rootIEOPluginsSaga, ieoRoutes, ieoActions, ieoMenuItem, ieoMenuIcons, api);
```

Following this steps you can use your custom API in saga. API name should be the same as plugin's name.

Redux Saga Example:
```typescript
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../../api';
import { buildQueryString } from '../../../../../helpers';
import { alertPush } from '../../../../../modules';
import {
    getListIEOData,
    ListIEOFetch,
} from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'ieo',
};

export function* getIEOSaga(action: ListIEOFetch) {
    try {
        const params = buildQueryString(action.payload);
        const { data, headers } = yield call(API.get(requestOptions), `/admin/ieo/sales?${params}`);
        yield put(getListIEOData({ list: data, total: headers.total }));
    } catch (error) {
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}

```

During deployment don't forget to set you API url in ```env.js``` file
Example
```
window.env = {
    ***
    ieoUrl: 'http://0.0.0.0:9002/api/v2/nodelogic',
    ***
}
```
# Custom Tower components

1. In order to use customised Tower component/container you need to develop a new plugin inside `src/plugins/` which contains root `index.ts`

Example:
```typescript
import { LoginBox } from './LoginBox/LoginBox';

export const CustomFactoryMap = {
    LoginBox,
};
```
Object CustomFactoryMap includes all your customised components.

*Plugin with custom components do not require any specific folders structure. The only requirement is exported CustomFactoryMap object.*

** **Important: When you override Tower components, you should name it strictly the same as basic Tower components.**
2. Push plugin's code to a separate github repo.
3. Configure [Assemble-line images file](https://github.com/openware/assembly-line/blob/master/images.yaml)

During the building process, your components from Tower plugin will override basic Tower component and app will use them instead of root components.
# Next Steps
 * Check that `index.ts` file of your plugin's root folder exports all component, containers, modules and your plugin Object of class `TowerPlugin`
 * Push your plugin folder to a separate github repo
 * Now you can return to basic Tower stable version
 * In order to build custom image you need to set configs to tower
## Configure tower to use custom plugins
Edit `plugins.json` file in root Tower directory
```json
[
  {
    "name": "auctions",
    "git": "github.com/openware/tower-plugin-auctions"
  }
]
```
1. Define plugins name (same as the folder which you developed previously inside `src/plugins/` directory.
2. Put a link to github repository which contains plugins files

Put plugin to `env.js` file
```javascript
    plugins: [
        {
            name: 'auctions',
        }
    ],
```

# Building an image
```bash
yarn build
```
This command will clone the github repository you specified in plugins.json file, generate TowerTemplate file and connect your plugin to basic tower components!
