import { createBrowserHistory, History } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Router } from 'react-router';
import { gaTrackerKey } from './api';
import { ErrorWrapper } from './containers';
import { SignInMobileScreen } from './mobile/screens/SignInScreen';
import * as mobileTranslations from './mobile/translations';
import {
    RootState,
    selectCurrentLanguage,
    selectMobileDeviceState,
    setMobileDevice,
} from './modules';
import { languageMap } from './translations';

interface AppProps {
    history: History;
}

interface ReduxProps {
    lang: string;
    isMobileDevice: boolean;
}

interface DispatchProps {
    setMobileDevice: typeof setMobileDevice;
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

type Props = AppProps & ReduxProps & DispatchProps;

/* Mobile components */
const MobileFooter = React.lazy(() => import('./mobile/components/Footer').then(({ Footer }) => ({ default: Footer })));
const MobileHeader = React.lazy(() => import('./mobile/components/Header').then(({ Header }) => ({ default: Header })));

/* Desktop components */
const AlertsContainer = React.lazy(() => import('./containers/Alerts').then(({ Alerts }) => ({ default: Alerts })));
const CustomizationContainer = React.lazy(() => import('./containers/Customization').then(({ Customization }) => ({ default: Customization })));
const FooterContainer = React.lazy(() => import('./containers/Footer').then(({ Footer }) => ({ default: Footer })));
const HeaderContainer = React.lazy(() => import('./containers/Header').then(({ Header }) => ({ default: Header })));
const SidebarContainer = React.lazy(() => import('./containers/Sidebar').then(({ Sidebar }) => ({ default: Sidebar })));
const LayoutContainer = React.lazy(() => import('./routes').then(({ Layout }) => ({ default: Layout })));


class AppLayout extends React.Component<Props, {}, {}> {
    public componentDidMount() {
        ReactGA.pageview(history.location.pathname);
        window.addEventListener('resize', this.handleChangeWindowWidth);
        this.handleChangeWindowWidth();
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.handleChangeWindowWidth);
    }


    public renderDeviceContainers() {
        const { isMobileDevice } = this.props;

        if (isMobileDevice) {
            return (
                <div className="pg-mobile-app">
                    <MobileHeader />
                    <SignInMobileScreen />
                    <MobileFooter />
                </div>
            );
        }

        return (
            <React.Fragment>
                <HeaderContainer/>
                <SidebarContainer/>
                <CustomizationContainer/>
                <AlertsContainer/>
                <LayoutContainer/>
                <FooterContainer/>
            </React.Fragment>
        );
    }

    public render() {
        const { lang } = this.props;

        return (
            <IntlProvider locale={lang} messages={this.getTranslations()} key={lang}>
                <Router history={history}>
                    <ErrorWrapper>
                        <React.Suspense fallback={null}>
                            {this.renderDeviceContainers()}
                        </React.Suspense>
                    </ErrorWrapper>
                </Router>
            </IntlProvider>
        );
    }

    private handleChangeWindowWidth = () => {
        const { isMobileDevice } = this.props;
        const height = window.innerHeight;
        const width = window.innerWidth;
        let updatedMobileDeviceState = false;

        if ((width && width < 768) || (height && height < 600)) {
            updatedMobileDeviceState = true;
        }

        if (isMobileDevice !== updatedMobileDeviceState) {
            this.props.setMobileDevice(updatedMobileDeviceState);
        }
    };

    private getTranslations = () => {
        const { lang, isMobileDevice } = this.props;

        if (isMobileDevice) {
            return  {
                ...languageMap[lang],
                ...mobileTranslations[lang],
            };
        }

        return languageMap[lang];
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    lang: selectCurrentLanguage(state),
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    setMobileDevice: payload => dispatch(setMobileDevice(payload)),
});

// tslint:disable-next-line:no-any
export const App = connect(mapStateToProps, mapDispatchToProps)(AppLayout) as any;
