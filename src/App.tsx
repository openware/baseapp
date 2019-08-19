import { History } from 'history';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { Router } from 'react-router';
import { GuardModal } from './components';
import { Alerts, ErrorWrapper, Footer, Header } from './containers';
import { GuardWrapper } from './containers/Guard';
import {
    closeGuardModal,
    licenseFetch,
    RootState,
    selectAppVersion,
    selectBuildExpire,
    selectGuardModalOpened,
    selectLicenseExpiration,
    selectTenkoPublicKey,
    selectToken,
    selectTokenFetching,
    setLicenseExpiration,
} from './modules';
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
    guardModal: boolean;
    version: string;
    buildExpire: string;
    tenkoKey: string;
    token: string;
    tokenFetching: boolean;
    expiresAt: number | null;
}

interface DispatchProps {
    closeGuardModal: typeof closeGuardModal;
    licenseFetch: typeof licenseFetch;
    setLicenseExpiration: typeof setLicenseExpiration;
}

type Props = AppProps & ReduxProps & DispatchProps;

class AppLayout extends React.Component<Props, {}, {}> {
    public render() {
        const {
            locale,
            history,
            guardModal,
            version,
            buildExpire,
            tenkoKey,
            token,
            tokenFetching,
            expiresAt,
        } = this.props;
        const { lang, messages } = locale;
        return (
            <IntlProvider locale={lang} messages={messages} key={lang}>
                <GuardWrapper
                    version={version}
                    buildExpire={buildExpire}
                    tenkoKey={tenkoKey}
                    licenseFetch={this.props.licenseFetch}
                    setLicenseExpiration={this.props.setLicenseExpiration}
                    token={token}
                    tokenFetching={tokenFetching}
                >
                    <Router history={history}>
                        <ErrorWrapper>
                            <Header/>
                            <Alerts/>
                            <Layout/>
                            <Footer buildExpire={expiresAt}/>
                        </ErrorWrapper>
                    </Router>
                    {guardModal && <GuardModal onClose={this.props.closeGuardModal}/>}
                </GuardWrapper>
            </IntlProvider>
        );
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        locale: state.public.i18n,
        guardModal: selectGuardModalOpened(state),
        version: selectAppVersion(state),
        buildExpire: selectBuildExpire(state),
        tenkoKey: selectTenkoPublicKey(state),
        token: selectToken(state),
        tokenFetching: selectTokenFetching(state),
        expiresAt: selectLicenseExpiration(state),
    });

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        closeGuardModal: () => dispatch(closeGuardModal()),
        licenseFetch: () => dispatch(licenseFetch()),
        setLicenseExpiration: payload => dispatch(setLicenseExpiration(payload)),
    });

// tslint:disable-next-line:no-any
const App = connect(mapStateToProps, mapDispatchToProps)(AppLayout) as any;

export {
    AppProps,
    App,
};
