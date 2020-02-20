import { createBrowserHistory, History } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { Alerts, ErrorWrapper, Footer, Header, Sidebar } from './containers';
import { RootState } from './modules';
import { Layout } from './routes';
import { gaTrackerKey } from '../src/api';

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

const gaKey = gaTrackerKey();
const history = createBrowserHistory();

if (gaKey) {
    ReactGA.initialize(gaKey);
    history.listen(location => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });
}

type Props = AppProps & ReduxProps;

class AppLayout extends React.Component<Props, {}, {}> {
    public componentDidMount() {
        ReactGA.pageview(history.location.pathname);
    }

    public render() {
        const {
            locale,
        } = this.props;
        const { lang, messages } = locale;
        const shouldRenderFooter = window.location.pathname !== '/';

        return (
            <IntlProvider locale={lang} messages={messages} key={lang}>
                <Router history={history}>
                    <ErrorWrapper>
                        <Header/>
                        <Sidebar/>
                        <Alerts/>
                        <Layout/>
                        {shouldRenderFooter ? <Footer/> : null}
                    </ErrorWrapper>
                </Router>
            </IntlProvider>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        locale: state.public.i18n,
    });

// tslint:disable-next-line:no-any
export const App = connect(mapStateToProps)(AppLayout) as any;
