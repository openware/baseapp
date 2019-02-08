import { History } from 'history';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { ErrorWrapper, Header } from './components';
import { RootState } from './modules';
import { Layout } from './routes';

interface Locale {
    lang: string;
    messages: object;
}

interface AppProps {
    history: History;
}

interface ReduxProps {
    locale: Locale;
}

type Props = AppProps & ReduxProps;

class AppLayout extends React.Component<Props, {}, {}> {
    public render() {
        const { locale, history } = this.props;
        const { lang, messages } = locale;
        return (
            <IntlProvider locale={lang} messages={messages} key={lang}>
                <Router history={history}>
                    <ErrorWrapper>
                        <Header />
                        <Layout />
                    </ErrorWrapper>
                </Router>
            </IntlProvider>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        locale: state.app.i18n,
    });

// tslint:disable-next-line:no-any
const App = connect(mapStateToProps, {} as any)(AppLayout) as any;

export {
    AppProps,
    App,
};
