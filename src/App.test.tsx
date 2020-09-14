import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { App } from './App';
import { rootReducer } from './modules';
import { PluginsManager } from './plugins/PluginsManager';

jest.mock('react-ga');

const Plugins = new PluginsManager();
const store = createStore(rootReducer(Plugins.getReduxReducer()));

describe('App', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Provider store={store}><App /></Provider>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
