import { History } from 'history';
import * as React from 'react';
import { Router } from 'react-router';
import { ErrorWrapper } from './components/Errors';
import { Header } from './components/Header';
import { Layout } from './routes';

interface AppProps {
    history: History;
}

class App extends React.Component<AppProps, {}, {}> {
    public render() {
        const { history } = this.props;
        return (
            <Router history={history}>
                <ErrorWrapper>
                    <Header />
                    <Layout />
                </ErrorWrapper>
            </Router>
        );
    }
}

export {
    AppProps,
    App,
};
