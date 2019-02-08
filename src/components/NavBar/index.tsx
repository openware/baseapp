import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { pgRoutes } from '../../constants';
import { getLanguageName } from '../../helpers';
import {
    changeLanguage,
    ContactError,
    logoutFetch,
    RootState,
    selectCurrentLanguage,
    selectSendEmailError,
    selectSendEmailSuccess,
    selectUserInfo,
    selectUserLoggedIn,
    sendEmail,
    User,
    walletsReset,
} from '../../modules';
import arrow = require('./down-arrow.svg');

export interface ReduxProps {
    address: string;
    error?: ContactError;
    isLoggedIn: boolean;
    lang: string;
    success?: boolean;
    user: User;
}

interface DispatchProps {
    changeLanguage: typeof changeLanguage;
    logout: typeof logoutFetch;
    sendEmail: typeof sendEmail;
    walletsReset: typeof walletsReset;
}

export interface OwnProps {
    onLinkChange?: () => void;
    history: History;
}

type NavbarProps = OwnProps & ReduxProps & RouteProps & DispatchProps;

const shouldUnderline = (address: string, url: string, index: number): boolean =>
    (url === '/trade' && address === '/trading') || address === url || (address === '/' && index === 0);

const navItem = (address: string, onLinkChange?: () => void) => (values: string[], index: number) => {
    const [name, url] = values;
    const cx = classnames('pg-navbar__content-item', {
        'pg-navbar__content-item--active': shouldUnderline(address, url, index),
    });

    const handleLinkChange = () => {
        if (onLinkChange) {
            onLinkChange();
        }
    };

    return (
        <li onClick={handleLinkChange} key={index}>
            <Link className={cx} to={url}>
                <FormattedMessage id={name} />
            </Link>
        </li>
    );
};

interface NavbarState {
    isOpen: boolean;
    isOpenLanguage: boolean;
    email: string;
    message: string;
    name: string;
    recaptchaResponse: string;
    errorModal: boolean;
}

class NavBarComponent extends React.Component<NavbarProps, NavbarState> {
    public readonly state = {
        isOpen: false,
        isOpenLanguage: false,
        email: '',
        name: '',
        message: '',
        recaptchaResponse: '',
        errorModal: false,
    };

    public componentDidUpdate(next: NavbarProps) {
        if (!this.props.isLoggedIn && next.isLoggedIn) {
            this.props.walletsReset();
            localStorage.clear();
            this.props.history.push('/trading');
        }
    }

    public render() {
        const { location, user, lang } = this.props;
        const { isOpenLanguage } = this.state;
        const address = location ? location.pathname : '';
        const languageName = getLanguageName(lang.toLowerCase());

        return (
            <div className={'pg-navbar'}>
                <ul className="pg-navbar__content">
                    {pgRoutes(!!user.email).map(navItem(address, this.props.onLinkChange))}
                </ul>
                <div className="pg-navbar__header-settings">
                    {user.email ? this.getUserEmailMenu() : null}
                    <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-toggle">
                        <div onClick={this.toggleLanguageMenu} className="email">
                            {languageName}
                            <img className="icon" src={arrow} />
                        </div>
                        {isOpenLanguage ? this.getLanguageMenu() : null}
                    </div>
                </div>
            </div>
        );
    }

    private getLanguageMenu = () => {
        return (
            <div className="dropdown-menu" role="menu">
                {/* tslint:disable */}
                <div className="dropdown-menu-item-lang" onClick={e => this.handleChangeLanguage('en')}>
                    English
                </div>
                <div className="dropdown-menu-item-lang" onClick={e => this.handleChangeLanguage('ru')}>
                    Русский
                </div>
                {/* tslin:enable */}
            </div>
        );
    };

    private getUserEmailMenu = () => {
        const { user } = this.props;
        const { isOpen } = this.state;

        return (
            <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-toggle">
                <div onClick={this.openMenu} className="email">
                    {NavBarComponent.getUserLabelFromEmail(user.email).toUpperCase()}
                    <img className="icon" src={arrow} />
                </div>
                {isOpen ? this.getUserMenu() : null}
            </div>
        );
    };

    private getUserMenu = () => {
        return (
            <div className="dropdown-menu" role="menu">
                <div className="dropdown-menu-item">
                    <Link
                        className="pg-navbar__admin-logout"
                        to="/profile"
                        onClick={this.handleRouteChange('/profile')}
                    >
                        <FormattedMessage id={'page.header.navbar.profile'} />
                    </Link>
                </div>
                <div className="dropdown-menu-item">
                    <Link
                        className="pg-navbar__admin-logout"
                        to="/confirm"
                        onClick={this.handleRouteChange('/confirm')}
                    >
                        <FormattedMessage id={'page.header.navbar.kyc'} />
                    </Link>
                </div>
                <div className="dropdown-menu-item">
                    <a className="pg-navbar__admin-logout" onClick={this.handleLogOut}>
                        <FormattedMessage id={'page.header.navbar.logout'} />
                    </a>
                </div>
            </div>
        );
    };

    private static getUserLabelFromEmail(email: string): string {
        return email.slice(0, 2);
    }

    private handleRouteChange = (to: string) => () => {
        this.setState({ isOpen: false }, () => {
            this.props.history.push(to);
        });
    }

    private handleLogOut = () => {
        this.setState({
            isOpen: false,
        }, () => {
            this.props.logout();
            this.props.walletsReset();
            this.props.history.push('/trading');
        });
    };

    private openMenu = () => {
        this.setState(prev => ({
          isOpen: !prev.isOpen,
        }));
    };

    private toggleLanguageMenu = () => {
        this.setState(prev => ({
          isOpenLanguage: !prev.isOpenLanguage,
        }));
    }

    private handleChangeLanguage = (language: string) => {
        this.props.changeLanguage(language);
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        address: '',
        error: selectSendEmailError(state),
        lang: selectCurrentLanguage(state),
        success: selectSendEmailSuccess(state),
        user: selectUserInfo(state),
        isLoggedIn: selectUserLoggedIn(state),
    });

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeLanguage: payload => dispatch(changeLanguage(payload)),
        logout: () => dispatch(logoutFetch()),
        sendEmail: payload => dispatch(sendEmail(payload)),
        walletsReset: () => dispatch(walletsReset()),
    });

// tslint:disable-next-line:no-any
const NavBar = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBarComponent) as any) as any;

export {
    NavBar,
};
