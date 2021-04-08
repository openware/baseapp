import classnames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Route, RouterProps, Switch } from 'react-router';
import { Redirect, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { minutesUntilAutoLogout, sessionCheckInterval, showLanding, wizardStep } from '../../api';
import { ExpiredSessionModal } from '../../components';
import { WalletsFetch, CanCan } from '../../containers';
import { P2PTradesHistory } from '../../containers/P2P/TradesHistory';
import { applyCustomizationSettings, toggleColorTheme } from '../../helpers';
import {
    ChangeForgottenPasswordMobileScreen,
    ConfirmMobileScreen,
    EmailVerificationMobileScreen,
    ForgotPasswordMobileScreen,
    LandingScreenMobile,
    OrdersMobileScreen,
    ProfileAccountActivityMobileScreen,
    ProfileApiKeysMobileScreen,
    ProfileAuthMobileScreen,
    ProfileChangePasswordMobileScreen,
    ProfileLanguageMobileScreen,
    ProfileMobileScreen,
    ProfileThemeMobileScreen,
    ProfileVerificationMobileScreen,
    SelectedWalletMobileScreen,
    SignInMobileScreen,
    SignUpMobileScreen,
    TradingScreenMobile,
    WalletDeposit,
    WalletsMobileScreen,
    WalletWithdraw,
} from '../../mobile/screens';
import {
    logoutFetch,
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectMobileDeviceState,
    selectPlatformAccessStatus,
    selectUserFetching,
    selectUserInfo,
    selectUserLoggedIn,
    toggleChartRebuild,
    User,
    userFetch,
    walletsReset,
    AbilitiesInterface,
    selectAbilities,
} from '../../modules';
import {
    ChangeForgottenPasswordScreen,
    ConfirmScreen,
    DocumentationScreen,
    EmailVerificationScreen,
    ForgotPasswordScreen,
    HistoryScreen,
    InternalTransfer,
    LandingScreen,
    MagicLink,
    MaintenanceScreen,
    OrdersTabScreen,
    ProfileScreen,
    ProfileTwoFactorAuthScreen,
    RestrictedScreen,
    SignInScreen,
    SignUpScreen,
    TradingScreen,
    VerificationScreen,
    WalletsScreen,
    SetupScreen,
    QuickExchange,
    P2POffersScreen,
    P2PUserOffersScreen,
    CreateP2POfferScreen,
    P2PTransferOrderScreen,
} from '../../screens';

interface ReduxProps {
    colorTheme: string;
    currentMarket?: Market;
    user: User;
    isLoggedIn: boolean;
    isMobileDevice: boolean;
    userLoading?: boolean;
    platformAccessStatus: string;
    abilities: AbilitiesInterface;
}

interface DispatchProps {
    logout: typeof logoutFetch;
    userFetch: typeof userFetch;
    walletsReset: typeof walletsReset;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

interface LayoutState {
    isShownExpSessionModal: boolean;
}

interface OwnProps {
    toggleChartRebuild: typeof toggleChartRebuild;
}

export type LayoutProps = ReduxProps & DispatchProps & LocationProps & IntlProps & OwnProps;

const renderLoader = () => (
    <div className="pg-loader-container">
        <Spinner animation="border" variant="primary" />
    </div>
);

const STORE_KEY = 'lastAction';

//tslint:disable-next-line no-any
const PrivateRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }
    const renderCustomerComponent = props => <CustomComponent {...props} />;

    if (isLogged) {
        const { checkAbility, abilities, action, target } = rest;

        if (checkAbility && !CanCan.checkAbilityByAction(action, target, abilities)) {
            return (
                <Route path="**">
                    <Redirect to="/" />
                </Route>
            );
        }

        return <Route {...rest} render={renderCustomerComponent} />;
    }

    return (
        <Route {...rest}>
            <Redirect to={'/signin'} />
        </Route>
    );
};

//tslint:disable-next-line no-any
const PublicRoute: React.FunctionComponent<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }

    if (isLogged && rest['path'] !== '/setup') {
        return <Route {...rest}><Redirect to={'/wallets'} /></Route>;
    }

    const renderCustomerComponent = props => <CustomComponent {...props} />;

    return <Route {...rest} render={renderCustomerComponent} />;
};

class LayoutComponent extends React.Component<LayoutProps, LayoutState> {
    public static eventsListen = [
        'click',
        'keydown',
        'scroll',
        'resize',
        'mousemove',
        'TabSelect',
        'TabHide',
    ];

    public timer;
    public walletsFetchInterval;

    constructor(props: LayoutProps) {
        super(props);
        this.initListener();

        this.state = {
            isShownExpSessionModal: false,
        };
    }

    public componentDidMount() {
        if (
            !(this.props.location.pathname.includes('/magic-link')
            || this.props.location.pathname.includes('/404')
            || this.props.location.pathname.includes('/500'))
        ) {
            switch (this.props.platformAccessStatus) {
                case 'restricted':
                    this.props.history.replace('/404');
                    break;
                case 'maintenance':
                    this.props.history.replace('/500');
                    break;
                default:
                    const token = localStorage.getItem('csrfToken');

                    if (token) {
                        this.props.userFetch();
                        this.initInterval();
                        this.check();
                    }
            }
        }

        applyCustomizationSettings(null, this.props.toggleChartRebuild);
    }

    public componentWillReceiveProps(nextProps: LayoutProps) {
        if (
            !(nextProps.location.pathname.includes('/magic-link')
            || nextProps.location.pathname.includes('/404')
            || nextProps.location.pathname.includes('/500'))
            || this.props.platformAccessStatus !== nextProps.platformAccessStatus
        ) {
            switch (nextProps.platformAccessStatus) {
                case 'restricted':
                    this.props.history.replace('/404');
                    break;
                case 'maintenance':
                    this.props.history.replace('/500');
                    break;
                default:
                    break;
            }
        }

        if (!this.props.user.email && nextProps.user.email && !this.props.location.pathname.includes('/setup')) {
            this.props.userFetch();
        }
    }

    public componentDidUpdate(prevProps: LayoutProps) {
        const { isLoggedIn, userLoading } = this.props;

        if (!isLoggedIn && prevProps.isLoggedIn && !userLoading) {
            this.props.walletsReset();

            if (!this.props.location.pathname.includes('/trading')) {
                this.props.history.push('/trading/');
            }
        }
    }

    public componentWillUnmount() {
        for (const type of LayoutComponent.eventsListen) {
            document.body.removeEventListener(type, this.reset);
        }
        clearInterval(this.timer);
        clearInterval(this.walletsFetchInterval);
    }

    public translate = (key: string) => this.props.intl.formatMessage({id: key});

    public render() {
        const {
            colorTheme,
            isLoggedIn,
            isMobileDevice,
            userLoading,
            location,
            platformAccessStatus,
        } = this.props;
        const { isShownExpSessionModal } = this.state;
        const desktopCls = classnames('container-fluid pg-layout', {
            'trading-layout': location.pathname.includes('/trading'),
        });
        const mobileCls = classnames('container-fluid pg-layout pg-layout--mobile', {
            'pg-layout--mobile-setup': location.pathname.includes('/setup'),
        });
        toggleColorTheme(colorTheme);

        if (!platformAccessStatus.length) {
            return renderLoader();
        }

        if ((wizardStep() !== 'false') && this.props.location.pathname !== '/setup') {
            return (
                <div className={isMobileDevice ? mobileCls : desktopCls}>
                    <Route loading={userLoading} isLogged={isLoggedIn}><Redirect to={'/setup'} /></Route>
                </div>
            );
        }

        if (isMobileDevice) {
            return (
                <div className={mobileCls}>
                    <Switch>
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/setup" component={SetupScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signin" component={SignInMobileScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signup" component={SignUpMobileScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/forgot_password" component={ForgotPasswordMobileScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/password_reset" component={ChangeForgottenPasswordMobileScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/confirmation" component={VerificationScreen} />
                        <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/email-verification" component={EmailVerificationMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:currency/history" component={SelectedWalletMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:currency/deposit" component={WalletDeposit} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:currency/withdraw" component={WalletWithdraw} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/confirm" component={ConfirmMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets" component={WalletsMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders" component={OrdersMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/account-activity" component={ProfileAccountActivityMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/api-keys" component={ProfileApiKeysMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/language" component={ProfileLanguageMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/2fa" component={ProfileAuthMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/change-password" component={ProfileChangePasswordMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/verification" component={ProfileVerificationMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile/theme" component={ProfileThemeMobileScreen} />
                        <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile" component={ProfileMobileScreen} />
                        <Route exact={true} path="/trading/:market?" component={TradingScreenMobile} />
                        {showLanding() && <Route exact={true} path="/" component={LandingScreenMobile} />}
                        <Route path="**"><Redirect to="/trading/" /></Route>
                    </Switch>
                    {isLoggedIn && <WalletsFetch />}
                    {isShownExpSessionModal && this.handleRenderExpiredSessionModal()}
                </div>
            );
        }

        return (
            <div className={desktopCls}>
                <Switch>
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/setup" component={SetupScreen} />
                    <Route exact={true} path="/magic-link" component={MagicLink} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signin" component={SignInScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/confirmation" component={VerificationScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signup" component={SignUpScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/forgot_password" component={ForgotPasswordScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/password_reset" component={ChangeForgottenPasswordScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/email-verification" component={EmailVerificationScreen} />
                    <Route path="/404" component={RestrictedScreen} />
                    <Route path="/500" component={MaintenanceScreen} />
                    <Route exact={true} path="/trading/:market?" component={TradingScreen} />
                    {showLanding() && <Route exact={true} path="/" component={LandingScreen} />}
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders" component={OrdersTabScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/history" component={HistoryScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/confirm" component={ConfirmScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile" component={ProfileScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:routeTab/:currency/:action" component={WalletsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:routeTab/:currency" component={WalletsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets/:routeTab" component={WalletsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets" component={WalletsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/security/2fa" component={ProfileTwoFactorAuthScreen} />
                    <PrivateRoute exact={true} loading={userLoading} isLogged={isLoggedIn} path="/docs" component={DocumentationScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/internal-transfer" component={InternalTransfer} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/quick-exchange" component={QuickExchange} checkAbility={true} abilities={this.props.abilities} action="read" target="QuickExchange" />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/p2p/offers" component={P2PUserOffersScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/create-offer" component={CreateP2POfferScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/p2p/history" component={P2PTradesHistory} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/p2p/transfer/:id" component={P2PTransferOrderScreen} />
                    <Route exaxt={true} path="/p2p/:currency" component={P2POffersScreen} />
                    <Route exaxt={true} path="/p2p" component={P2POffersScreen} />
                    <Route path="**"><Redirect to="/trading/" /></Route>
                </Switch>
                {isLoggedIn && <WalletsFetch/>}
                {isShownExpSessionModal && this.handleRenderExpiredSessionModal()}
            </div>
        );
    }

    private getLastAction = () => {
        if (localStorage.getItem(STORE_KEY) !== null) {
            return parseInt(localStorage.getItem(STORE_KEY) || '0', 10);
        }

        return 0;
    };

    private setLastAction = (lastAction: number) => {
        localStorage.setItem(STORE_KEY, lastAction.toString());
    };

    private initListener = () => {
        this.reset();
        for (const type of LayoutComponent.eventsListen) {
            document.body.addEventListener(type, this.reset);
        }
    };

    private reset = () => {
        this.setLastAction(Date.now());
    };

    private initInterval = () => {
        this.timer = setInterval(() => {
            this.check();
        }, parseFloat(sessionCheckInterval()));
    };

    private check = () => {
        const { user } = this.props;
        const now = Date.now();
        const timeleft = this.getLastAction() + parseFloat(minutesUntilAutoLogout()) * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;
        if (isTimeout && user.email) {
            if (user.state === 'active') {
                this.handleChangeExpSessionModalState();
            }

            this.props.logout();
        }
    };

    private handleSubmitExpSessionModal = () => {
        const { history } = this.props;
        this.handleChangeExpSessionModalState();
        history.push('/signin');
    };

    private handleRenderExpiredSessionModal = () => (
        <ExpiredSessionModal
            title={this.translate('page.modal.expired.title')}
            buttonLabel={this.translate('page.modal.expired.submit')}
            handleChangeExpSessionModalState={this.handleChangeExpSessionModalState}
            handleSubmitExpSessionModal={this.handleSubmitExpSessionModal}
        />
    );

    private handleChangeExpSessionModalState = () => {
        this.setState({
            isShownExpSessionModal: !this.state.isShownExpSessionModal,
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    colorTheme: selectCurrentColorTheme(state),
    currentMarket: selectCurrentMarket(state),
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    isMobileDevice: selectMobileDeviceState(state),
    userLoading: selectUserFetching(state),
    platformAccessStatus: selectPlatformAccessStatus(state),
    abilities: selectAbilities(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    logout: () => dispatch(logoutFetch()),
    toggleChartRebuild: () => dispatch(toggleChartRebuild()),
    userFetch: () => dispatch(userFetch()),
    walletsReset: () => dispatch(walletsReset()),
});

export const Layout = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(LayoutComponent) as any;
