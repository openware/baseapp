import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Router } from 'react-router';
import { gaTrackerKey, useSharedLayout } from './api';
import { ErrorWrapper } from './containers';
import { useSetMobileDevice } from './hooks';
import * as mobileTranslations from './mobile/translations';
import { configsFetch, selectCurrentLanguage, selectMobileDeviceState } from './modules';
import { languageMap } from './translations';
import { SharedLayout } from './components';
import WebSocketProvider from './websocket/WebSocket';

const gaKey = gaTrackerKey();
const browserHistory = createBrowserHistory();

if (gaKey) {
    ReactGA.initialize(gaKey);
    browserHistory.listen((location) => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });
}

/* Mobile components */
const MobileHeader = React.lazy(() => import('./mobile/components/Header').then(({ Header }) => ({ default: Header })));
const MobileFooter = React.lazy(() => import('./mobile/components/Footer').then(({ Footer }) => ({ default: Footer })));

/* Desktop components */
const AlertsContainer = React.lazy(() => import('./containers/Alerts').then(({ Alerts }) => ({ default: Alerts })));
const CustomizationContainer = React.lazy(() =>
    import('./containers/Customization').then(({ Customization }) => ({ default: Customization }))
);
const P2PAlertsContainer = React.lazy(() => import('./containers/P2P/P2PAlerts').then(({ P2PAlerts }) => ({ default: P2PAlerts })));
const HeaderContainer = React.lazy(() => import('./containers/Header').then(({ Header }) => ({ default: Header })));
const SidebarContainer = React.lazy(() => import('./containers/Sidebar').then(({ Sidebar }) => ({ default: Sidebar })));
const LayoutContainer = React.lazy(() => import('./routes').then(({ Layout }) => ({ default: Layout })));

const getTranslations = (lang: string, isMobileDevice: boolean) => {
    if (isMobileDevice) {
        return {
            ...languageMap[lang],
            ...mobileTranslations[lang],
        };
    }

    return languageMap[lang];
};

const Layout = () => {
    const isMobileDevice = useSelector(selectMobileDeviceState);

    if (browserHistory.location.pathname === '/setup' || !isMobileDevice) {
        return (
            <React.Fragment>
                <SharedLayout>
                    {browserHistory.location.pathname.includes('/trading') && <HeaderContainer />}
                    <CustomizationContainer />
                    <AlertsContainer />
                    <P2PAlertsContainer />
                    <LayoutContainer />
                </SharedLayout>
            </React.Fragment>
        );
    }

    return (
        <div className="pg-mobile-app">
            <SharedLayout>
                <AlertsContainer/>
                <LayoutContainer/>
            </SharedLayout>
        </div>
    );
}

const RenderDeviceContainers = () => {
    const isMobileDevice = useSelector(selectMobileDeviceState);

    if (browserHistory.location.pathname === '/setup' || !isMobileDevice) {
        return (
            <React.Fragment>
                <HeaderContainer />
                <SidebarContainer />
                <CustomizationContainer />
                <AlertsContainer />
                <P2PAlertsContainer />
                <LayoutContainer />
            </React.Fragment>
        );
    }

    return (
        <div className="pg-mobile-app">
            <MobileHeader />
            <AlertsContainer/>
            <LayoutContainer/>
            <MobileFooter />
        </div>
    );
};

export const App = () => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(configsFetch());

        const rootElement = document.documentElement;
        const fontFamily = window.env?.fontFamily ? window.env?.fontFamily : `'IBM Plex Sans', sans-serif`;

        if (rootElement) {
            rootElement.style.setProperty('--font-family', fontFamily);
        };
    }, []);

    useSetMobileDevice();
    const lang = useSelector(selectCurrentLanguage);
    const isMobileDevice = useSelector(selectMobileDeviceState);

    return (
        <IntlProvider locale={lang} messages={getTranslations(lang, isMobileDevice)} key={lang}>
            <WebSocketProvider>
                <Router history={browserHistory}>
                    <ErrorWrapper>
                        <React.Suspense fallback={null}>
                            {useSharedLayout() ? <Layout /> : <RenderDeviceContainers />}
                        </React.Suspense>
                    </ErrorWrapper>
                </Router>
            </WebSocketProvider>
        </IntlProvider>
    );
};
