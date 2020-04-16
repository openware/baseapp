import { createBrowserHistory, History } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { gaTrackerKey } from '../src/api';
import { ErrorWrapper } from './containers';
import { RootState } from './modules';

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

const AlertsContainer = React.lazy(() => import('./containers/Alerts').then(({ Alerts }) => ({ default: Alerts })));
const FooterContainer = React.lazy(() => import('./containers/Footer').then(({ Footer }) => ({ default: Footer })));
const HeaderContainer = React.lazy(() => import('./containers/Header').then(({ Header }) => ({ default: Header })));
const SidebarContainer = React.lazy(() => import('./containers/Sidebar').then(({ Sidebar }) => ({ default: Sidebar })));
const LayoutContainer = React.lazy(() => import('./routes').then(({ Layout }) => ({ default: Layout })));

class AppLayout extends React.Component<Props, {}, {}> {
    public componentDidMount() {
        ReactGA.pageview(history.location.pathname);
    }

    public render() {
        const {
            locale,
        } = this.props;
        const { lang, messages } = locale;

        return (
            <IntlProvider locale={lang} messages={messages} key={lang}>
                <Router history={history}>
                    <ErrorWrapper>
                        <React.Suspense fallback={null}>
                            <HeaderContainer/>
                            <SidebarContainer/>
                            <AlertsContainer/>
                            <LayoutContainer/>
                            <FooterContainer/>
                        </React.Suspense>
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
