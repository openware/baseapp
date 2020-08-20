import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';

import { store } from '../redux/store';
import { AppContent } from './content';

const AppComponent: React.FC = () => {
    return (
        <Provider store={store as any}>
            <AppContent />
        </Provider>
    );
};

export const App = hot(module)(AppComponent);
