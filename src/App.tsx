import { History } from 'history';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { Alerts, ErrorWrapper, Footer, Header } from './containers';
import { GuardWrapper } from './containers/Guard';
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

                <GuardWrapper>
                    <Router history={history}>
                        <ErrorWrapper>
                            <Header/>
                            <Alerts/>
                            <Layout/>
                            <Footer/>
                        </ErrorWrapper>
                    </Router>
                </GuardWrapper>
            </IntlProvider>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        locale: state.public.i18n,
    });

// tslint:disable-next-line:no-any
const App = connect(mapStateToProps, {} as any)(AppLayout) as any;

export {
    AppProps,
    App,
};
