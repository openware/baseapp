# Baseapp Plugin

Developing a baseapp plugin allows you to use custom Baseapp with your stack

## Create a new plugin

1. Put plugin to `env.js` file
```javascript
    plugins: [
        {
            name: 'newBaseappPluginName',
        }
    ],
```
2. Put plugin to `plugins.json` file
```json
[
  {
    "name": "newBaseappPluginName",
  }
]
```
3. Generate plugins template
```bash
yarn plugins:template newBaseappPluginName
```
## Clone existing plugin
1. Put plugin to `env.js` file
```javascript
    plugins: [
        {
            name: 'newBaseappPluginName',
        }
    ],
```

2. Edit `plugins.json` file in root Baseapp directory
```json
[
  {
    "name": "newBaseappPluginName",
    "git": "github.com/openware/newBaseappPluginName"
  }
]
```

3. Clone plugins files
```bash
yarn plugins:clone
```

# Baseapp Plugin Interface

Plugin should be an object of class ```BaseappPlugin```

```typescript
    getReduxReducer: () => Reducer<{}>;                               /* root plugin's redux reducer */
    getReduxSaga: () => any;                                          /* root plugin's redux saga */
    getRoutes: (userLoading, isCurrentSession) => JSX.Element[];      /* plugin's routes */
    getMenu: (isLoggedIn: boolean, isLight?: boolean) => string[];    /* plugin's menu items */
    getMenuIcons: (name: string, className?: string) => JSX.Element;  /* plugin's menu icons */
    getTranslations: (lang: string) => Object;                        /* plugin's translations object */
}
```

## Baseapp Plugin object

After generating a template in your plugin's name root folder ```baseapp/src/plugins``` there is ```index.ts``` file with plugin object.

Example:

```typescript
export * from './containers';
export * from './components';
export * from './modules';

export const IeoPlugin: BaseappPluginInterface =
    new BaseappPlugin(ieoPluginReducer, rootIEOPluginsSaga, ieoRoutes, ieoMenuItem, ieoMenuIcons, ieoTranslations);
```
Each prop of BaseappPlugin constructor will be described further

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

As described earlier routes prop of BaseappPlugin constructor is a constant which returns an array of JSX elements.

Here you define all routes you need for your plugin. If a route requires admin to be logged in to Baseapp use
```typescript
<PrivateRoute />
```
constant from `src/router/Router`

Example:
```jsx
export const ieoRoutes = (userLoading, isLoggedIn) => {
    return ([
            <PrivateRoute
                loading={userLoading}
                isLogged={isLoggedIn}
                path="/ieo/:id"
                component={IEOTabs}
            />
            <Route
                path="/ieo"
                component={IEOListScreen}
            />,
    ]);
};
```
Props `userLoading, isLoggedIn` will be transferred automatically to the function, don't worry about them.

* `UserLoading` will help your component to render Loading screen if the data about user hasn't loaded yet from the backend.

 * `isLoggedIn` shows to the component that user is logged in.

## Menu
To display plugin's page inside Side Bar create an array:

Example:
```typescript
export const ieoMenuItem = (isLoggedIn: boolean, isLight?: boolean) => [
    ['page.header.navbar.ieo', '/ieo',`ieo{isLight ? 'Light' : ''}`],
];
```
## Menu icons
If you want to express the meaning of menu item's by some nice icon create a constant which returns a specific icon by route.

Example:
```typescript
export const ieoMenuIcons = (name: string, className?: string) => {
    switch (name) {
        case 'ieo':
            return (
                <svg width="22" height="17" viewBox="0 0 22 17" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
                    ...
                </svg>
            );
        default: return null;
    }
};

```
## Translations
To apply translations of your plugin to Baseapp translations file you need to create a folder `/translations` which will contain file with different languages translations for example `en.ts` file:
```typescript
export const en = {
    ...
}
```
Then in root plugins `constants.tsx` file you should export a function
```typescript
export const ieoTranslations = (lang: string) => {
    const file = require(`./translations/${lang}`);

    return file[lang];
};
```

# Next Steps
 * Check that `index.ts` file of your plugin's root folder exports all component, containers, modules and your plugin Object of class `BaseappPlugin`
 * Push your plugin folder to a separate github repo
 * Now you can return to basic Baseapp stable version
 * In order to build custom image you need to set configs to baseapp
## Configure baseapp to use custom plugins
Edit `plugins.json` file in root Baseapp directory
```json
[
  {
    "name": "ieo",
    "git": "github.com/openware/baseapp-plugin-ieo"
  }
]
```
1. Define plugins name (same as the folder which you developed previously inside `src/plugins/` directory.
2. Put a link to github repository which contains plugins files

Put plugin to `env.js` file
```javascript
    plugins: [
        {
            name: 'ieo',
        }
    ],
```

# Building an image
```bash
yarn build
```
This command will clone the github repository you specified in plugins.json file, generate BaseappTemplate file and connect your plugin to basic Baseapp components!
