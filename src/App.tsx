import { createBrowserHistory, History } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { gaTrackerKey } from '../src/api';
import { Alerts, ErrorWrapper, Footer, Header, Sidebar } from './containers';
import { RootState } from './modules';
import { Layout } from './routes';
import { languageMap } from './translations';

interface AppProps {
    history: History;
}

interface ReduxProps {
    lang: string;
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
        const { lang } = this.props;

        return (
            <IntlProvider locale={lang} messages={languageMap[lang]} key={lang}>
                <Router history={history}>
                    <ErrorWrapper>
                        <Header/>
                        <Sidebar/>
                        <Alerts/>
                        <Layout/>
                        <Footer/>
                    </ErrorWrapper>
                </Router>
            </IntlProvider>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        lang: state.public.i18n.lang,
    });

// tslint:disable-next-line:no-any
export const App = connect(mapStateToProps)(AppLayout) as any;
