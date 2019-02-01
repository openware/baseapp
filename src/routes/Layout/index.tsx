// tslint:disable
import { Loader } from '@openware/components';
import * as React from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { Route, Switch } from 'react-router';
import { withRouter, Redirect } from 'react-router-dom';
import { minutesUntilAutoLogout } from '../../api/config';
import {
    logoutFetch,
    RootState,
    selectUserLoggedIn,
    selectUserInfo,
    selectUserFetching,
    User,
    userFetch,
    walletsReset,
} from '../../modules';
import {
    OpenOrdersScreen,
    ProfileScreen,
    SignInScreen,
    SignUpScreen,
    VerificationScreen,
    TradingScreen,
    WalletsScreen,
    HistoryScreen,
    ConfirmScreen,
    FaqScreen,
    ProfileTwoFactorAuthScreen,
    ForgotPasswordScreen,
    ChangeForgottenPasswordScreen,
} from '../../screens';

interface ReduxProps {
    user: User;
    isLoggedIn: boolean;
    userLoading?: boolean;
}

interface DispatchProps {
    logout: typeof logoutFetch;
    userFetch: typeof userFetch;
    walletsReset: typeof walletsReset;
}

interface OwnProps {
    history: any;
}

type Props = ReduxProps & DispatchProps & OwnProps;

const renderLoader = () => (
    <div className="pg-loader-container">
        <Loader />
    </div>
);

const CHECK_INTERVAL = 15000;
const STORE_KEY =  'lastAction';

const PrivateRoute: React.SFC<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }
    return <Route {...rest} render={props => (
        isLogged ? <CustomComponent {...props} /> :
            <Redirect to={'/signin'} />
    )} />;
};

const PublicRoute: React.SFC<any> = ({ component: CustomComponent, loading, isLogged, ...rest }) => {
    if (loading) {
        return renderLoader();
    }
    return <Route {...rest} render={props => (
        !isLogged ? <CustomComponent {...props} /> :
            <Redirect to={'/wallets'} />
    )} />;
};

class LayoutComponent extends React.Component<Props> {
    timer: any;

    constructor(props: Props) {
        super(props);

        this.initListener();
    }

    public componentDidMount() {
        this.props.userFetch();
        this.initInterval();
        this.check();
    }

    public componentWillUnmount() {
        document.body.removeEventListener('click', () => {});
        document.body.removeEventListener('mouseover', () => {});
        document.body.removeEventListener('mouseout', () => {});
        document.body.removeEventListener('keydown', () => {});
        document.body.removeEventListener('keyup', () => {});
        document.body.removeEventListener('keypress', () => {});

        clearInterval(this.timer);
    }

    public render() {
        const { isLoggedIn, userLoading } = this.props;
        return (
            <div className="pg-layout">
                <Switch>
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signin" component={SignInScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/confirmation" component={VerificationScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/signup" component={SignUpScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/forgot_password" component={ForgotPasswordScreen} />
                    <PublicRoute loading={userLoading} isLogged={isLoggedIn} path="/accounts/password_reset" component={ChangeForgottenPasswordScreen} />
                    <Route exact path="/trading" component={TradingScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/orders" component={OpenOrdersScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/history" component={HistoryScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/confirm" component={ConfirmScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/profile" component={ProfileScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/wallets" component={WalletsScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/help" component={FaqScreen} />
                    <PrivateRoute loading={userLoading} isLogged={isLoggedIn} path="/security/2fa" component={ProfileTwoFactorAuthScreen} />
                    <Route path="**"
                           render={() => <Redirect to={'/trading'} />} />
                </Switch>
            </div>
        );
    }

    private getLastAction = () => {
        if (localStorage.getItem(STORE_KEY) !== null) {
            return parseInt(localStorage.getItem(STORE_KEY) || '0');
        }
        return 0;
    };

    private setLastAction = (lastAction: number) => {
        localStorage.setItem(STORE_KEY, lastAction.toString());
    }

    private initListener = () => {
        this.reset();
        document.body.addEventListener('click', () => this.reset());
        document.body.addEventListener('mouseover', ()=> this.reset());
        document.body.addEventListener('mouseout', () => this.reset());
        document.body.addEventListener('keydown', () => this.reset());
        document.body.addEventListener('keyup', () => this.reset());
        document.body.addEventListener('keypress', () => this.reset());
    }

    private reset = () => {
        this.setLastAction(Date.now());
    }

    private initInterval = () => {
        this.timer = setInterval(() => {
            this.check();
        }, CHECK_INTERVAL);
    }

    private check = () => {
        const { user } = this.props;
        const now = Date.now();
        const timeleft = this.getLastAction() + parseFloat(minutesUntilAutoLogout()) * 60 * 1000;
        const diff = timeleft - now;
        const isTimeout = diff < 0;
        if (isTimeout && user.email) {
          this.props.logout();
          this.props.walletsReset();
          localStorage.clear();
          this.props.history.push('/trading');
        }
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    user: selectUserInfo(state),
    isLoggedIn: selectUserLoggedIn(state),
    userLoading: selectUserFetching(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    logout: () => dispatch(logoutFetch()),
    userFetch: () => dispatch(userFetch()),
    walletsReset: () => dispatch(walletsReset()),
});

const Layout = withRouter(connect(mapStateToProps, mapDispatchToProps)(LayoutComponent) as any) as any;

export {
    Layout,
};
