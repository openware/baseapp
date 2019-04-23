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
import {
    changeLanguage,
    logoutFetch,
    Market,
    RootState,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectUserInfo,
    selectUserLoggedIn,
    User,
    walletsReset,
} from '../../modules';

export interface ReduxProps {
    currentMarket: Market | undefined;
    address: string;
    isLoggedIn: boolean;
    lang: string;
    success?: boolean;
    user: User;
}

interface DispatchProps {
    changeLanguage: typeof changeLanguage;
    logout: typeof logoutFetch;
    walletsReset: typeof walletsReset;
}

export interface OwnProps {
    onLinkChange?: () => void;
    history: History;
}

type NavbarProps = OwnProps & ReduxProps & RouteProps & DispatchProps;


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

    public navItem = (address: string, onLinkChange?: () => void) => (values: string[], index: number) => {
        const [name, url] = values;
        const { isLoggedIn, currentMarket } = this.props;
        const cx = classnames('pg-navbar__content-item', {
            'pg-navbar__content-item--active': this.shouldUnderline(address, url),
            'pg-navbar__content-item-logging': isLoggedIn,
        });
        const handleLinkChange = () => {
            if (onLinkChange) {
                onLinkChange();
            }
        };
        const path = url.includes('/trading') && currentMarket ? `/trading/${currentMarket.id}` : url;
        return (
            <li onClick={handleLinkChange} key={index}>
                <Link className={cx} to={path}>
                    <FormattedMessage id={name} />
                </Link>
            </li>
        );
    };

    public render() {
        const { location, user, lang } = this.props;
        const { isOpenLanguage } = this.state;
        const address = location ? location.pathname : '';
        const languageName = lang.toUpperCase();
        const languageClassName = classnames('dropdown-menu-language-field', {
            'dropdown-menu-language-field-active': isOpenLanguage,
        });

        return (
            <div className={'pg-navbar'}>
                {user.email ? this.getProfile() : null}
                <ul className="pg-navbar__content">
                    {pgRoutes(!!user.email).map(this.navItem(address, this.props.onLinkChange))}
                </ul>
                <div className="pg-navbar__header-settings">
                    {user.email ? this.getUserEmailMenu() : null}
                    <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-toggle dropdown-menu-language-container">
                        <div onClick={this.toggleLanguageMenu} className={languageClassName}>
                            {languageName}
                            <img className="icon" src={require(`./${isOpenLanguage ? 'open' : 'close'}-icon.svg`)} />
                        </div>
                        {isOpenLanguage ? this.getLanguageMenu() : null}
                    </div>
                </div>
                <div className="pg-navbar__header-language" onClick={this.toggleLanguageMenu}>
                    <span>LANGUAGE</span>
                    <span>
                        {languageName}
                        <img className="icon" src={require(`./${isOpenLanguage ? 'open' : 'close'}-icon.svg`)} />
                    </span>
                    {isOpenLanguage ? this.getLanguageMenu() : null}
                </div>
            </div>
        );
    }

    private shouldUnderline = (address: string, url: string): boolean =>
        (url === '/trading/' && address.includes('/trading')) || address === url;

    private getProfile = () => {
        const { user } = this.props;
        return (
            <div className="pg-navbar__header-profile">
                <Link
                    className="pg-navbar__admin-logout"
                    to="/profile"
                    onClick={this.handleRouteChange('/profile')}
                >
                    <FormattedMessage id={'page.header.navbar.profile'} />
                </Link>
                <span>{user.email}</span>
                <img onClick={this.handleLogOut} className="pg-navbar__header-profile-logout" src={require(`./logout.svg`)} />
            </div>
        );
    };

    private getLanguageMenu = () => {
        return (
            <div className="dropdown-menu dropdown-menu-language" role="menu">
                {/* tslint:disable jsx-no-lambda */}
                <div className="dropdown-menu-item-lang" onClick={e => this.handleChangeLanguage('en')}>
                    EN
                </div>
                <div className="dropdown-menu-item-lang" onClick={e => this.handleChangeLanguage('ru')}>
                    RU
                </div>
                {/* tslin:enable jsx-no-lambda */}
            </div>
        );
    };

    private getUserEmailMenu = () => {
        const { isOpen } = this.state;
        const userClassName = classnames('navbar-user-menu', {
            'navbar-user-menu-active': isOpen,
        });

        return (
            <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-toggle">
                <div onClick={this.openMenu} className={userClassName}>
                    <img src={require(`./${isOpen ? 'open' : 'close'}-avatar.svg`)} />
                    <img className="icon" src={require(`./${isOpen ? 'open' : 'close'}-icon.svg`)} />
                </div>
                {isOpen ? this.getUserMenu() : null}
            </div>
        );
    };

    private getUserMenu = () => {
        return (
            <div className="dropdown-menu dropdown-menu-user" role="menu">
                <div className="dropdown-menu-item-user">
                    <Link
                        className="pg-navbar__admin-logout"
                        to="/profile"
                        onClick={this.handleRouteChange('/profile')}
                    >
                        <FormattedMessage id={'page.header.navbar.profile'} />
                    </Link>
                </div>
                <div className="dropdown-menu-item-user">
                    <a className="pg-navbar__admin-logout" onClick={this.handleLogOut}>
                        <FormattedMessage id={'page.header.navbar.logout'} />
                    </a>
                </div>
            </div>
        );
    };

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
        });
    };

    private openMenu = () => {
        this.setState({
            isOpen: !this.state.isOpen,
        }, () => {
            if (this.state.isOpen) {
                document.addEventListener('click', this.closeMenu);
            } else {
                document.removeEventListener('click', this.closeMenu);
            }
        });
    };

    private closeMenu = () => {
        this.setState({
            isOpen: false,
        }, () => {
            document.removeEventListener('click', this.closeMenu);
        });
    }

    private toggleLanguageMenu = () => {
        this.setState({
            isOpenLanguage: !this.state.isOpenLanguage,
        }, () => {
            if (this.state.isOpenLanguage) {
                document.addEventListener('click', this.closeLanguageMenu);
            } else {
                document.removeEventListener('click', this.closeLanguageMenu);
            }
        });
    }

    private closeLanguageMenu = () => {
        this.setState({
            isOpenLanguage: false,
        }, () => {
            document.removeEventListener('click', this.closeLanguageMenu);
        });
    }

    private handleChangeLanguage = (language: string) => {
        this.props.changeLanguage(language);
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        currentMarket: selectCurrentMarket(state),
        address: '',
        lang: selectCurrentLanguage(state),
        user: selectUserInfo(state),
        isLoggedIn: selectUserLoggedIn(state),
    });

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeLanguage: payload => dispatch(changeLanguage(payload)),
        logout: () => dispatch(logoutFetch()),
        walletsReset: () => dispatch(walletsReset()),
    });

// tslint:disable-next-line:no-any
const NavBar = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBarComponent) as any) as any;

export {
    NavBar,
};
