import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { App } from './App';
import { rootReducer } from './modules';

jest.mock('react-ga');

const store = createStore(rootReducer);
const history = createBrowserHistory();

describe('App', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Provider store={store}><App history={history} /></Provider>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
