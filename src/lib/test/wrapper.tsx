import React from 'react';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();

export const TestComponentWrapper: React.FC = ({ children }) => {
    return <Router history={browserHistory}>{children}</Router>;
};
