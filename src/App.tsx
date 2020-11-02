import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { Route, Router, Switch } from 'react-router';
import { gaTrackerKey } from './api';
import { ErrorWrapper } from './containers';
import { useSetMobileDevice } from './hooks';
import * as mobileTranslations from './mobile/translations';
import { selectCurrentLanguage, selectMobileDeviceState } from './modules';
import { SignInScreen } from './screens';
import { languageMap } from './translations';

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
const MobileFooter = React.lazy(() => import('./mobile/components/Footer').then(({ Footer }) => ({ default: Footer })));
const MobileHeader = React.lazy(() => import('./mobile/components/Header').then(({ Header }) => ({ default: Header })));

/* Desktop components */
const AlertsContainer = React.lazy(() => import('./containers/Alerts').then(({ Alerts }) => ({ default: Alerts })));
const CustomizationContainer = React.lazy(() =>
    import('./containers/Customization').then(({ Customization }) => ({ default: Customization }))
);
const FooterContainer = React.lazy(() => import('./containers/Footer').then(({ Footer }) => ({ default: Footer })));
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

const RenderDeviceContainers = () => {
    const isMobileDevice = useSelector(selectMobileDeviceState);

    if (isMobileDevice) {
        return (
            <div className="pg-mobile-app">
                <MobileHeader />
                <AlertsContainer />
                <LayoutContainer />
                <MobileFooter />
            </div>
        );
    }

    return (
        <React.Fragment>
            <HeaderContainer />
            <SidebarContainer />
            <CustomizationContainer />
            <AlertsContainer />
            <LayoutContainer />
            <FooterContainer />
        </React.Fragment>
    );
};

export const App = () => {
    const lang = useSelector(selectCurrentLanguage);
    const isMobileDevice = useSelector(selectMobileDeviceState);
    return (
        <IntlProvider
            {...{ locale: lang }}
            defaultLocale={lang}
            messages={getTranslations(lang, isMobileDevice)}
            key={lang}>
            <Router history={browserHistory}>
                <Switch>
                    <Route exact={true} path="/" component={SignInScreen} />
                </Switch>
            </Router>
        </IntlProvider>
    );

    // useSetMobileDevice();
    // const lang = useSelector(selectCurrentLanguage);
    // const isMobileDevice = useSelector(selectMobileDeviceState);

    // return (
    //     <IntlProvider locale={lang} messages={getTranslations(lang, isMobileDevice)} key={lang}>
    //         <Router history={browserHistory}>
    //             <ErrorWrapper>
    //                 <React.Suspense fallback={null}>
    //                     <RenderDeviceContainers />
    //                 </React.Suspense>
    //             </ErrorWrapper>
    //         </Router>
    //     </IntlProvider>
    // );
};
