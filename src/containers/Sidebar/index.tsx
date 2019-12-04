import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import {  pgRoutes } from '../../constants';
import {
    changeLanguage,
    logoutFetch,
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectSidebarState,
    selectUserLoggedIn,
    toggleSidebar,
} from '../../modules';
import { Dropdown } from 'react-bootstrap';


interface State {
    isOpenLanguage: boolean;
}

interface DispatchProps {
    changeLanguage: typeof changeLanguage;
    toggleSidebar: typeof toggleSidebar;
    logoutFetch: typeof logoutFetch;
}

interface ReduxProps {
    lang: string;
    colorTheme: string;
    isLoggedIn: boolean;
    currentMarket: Market | undefined;
    isActive: boolean;
}

interface OwnProps {
    onLinkChange?: () => void;
    history: History;
}

type Props = OwnProps & ReduxProps & RouteProps & DispatchProps;


class SidebarContainer extends React.Component<Props, State> {
    public state = {
        isOpenLanguage: false,
    };

    public render() {
        const { isLoggedIn, colorTheme, isActive, lang } = this.props;
        const { isOpenLanguage } = this.state;

        const address = this.props.history.location ? this.props.history.location.pathname : '';
        const isLight = colorTheme === 'light';
        const lightBox = isLight ? 'light-box' : '';
        const languageName = lang.toUpperCase();

        const languageClassName = classnames('dropdown-menu-language-field', {
            'dropdown-menu-language-field-active': isOpenLanguage,
        });

        return (
            <div className={`pg-sidebar-wrapper ${lightBox} pg-sidebar-wrapper--${isActive ? 'active' : 'hidden'}`}>
                {this.renderProfileLink()}
                <div className="pg-sidebar-wrapper-nav">
                    {pgRoutes(isLoggedIn, isLight).map(this.renderNavItems(address))}
                </div>
                <div className="pg-sidebar-wrapper-lng">
                    <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-menu-language-container">
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id={languageClassName}>
                                <img src={require(`../../assets/images/sidebar/${lang}.svg`)} alt="flag"/>
                                <span className="dropdown-menu-language-selected">{languageName}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={e => this.handleChangeLanguage('en')}>
                                    <div className="dropdown-row">
                                        <img
                                            src={require('../../assets/images/sidebar/en.svg')}
                                            alt="usa"
                                        />
                                        <span>EN</span>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={e => this.handleChangeLanguage('ru')}>
                                    <div className="dropdown-row">
                                        <img
                                            src={require('../../assets/images/sidebar/ru.svg')}
                                            alt="rus"
                                        />
                                        <span>RU</span>
                                    </div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                {this.renderLogout()}
            </div>
        );
    }

    public renderNavItems = (address: string) => (values: string[], index: number) => {
        const { currentMarket } = this.props;

        const [name, url, img] = values;
        const handleLinkChange = () => this.props.toggleSidebar(false);
        const path = url.includes('/trading') && currentMarket ? `/trading/${currentMarket.id}` : url;
        const isActive = (url === '/trading/' && address.includes('/trading')) || address === url;
        return (
            <Link to={path} key={index} onClick={handleLinkChange} className={`${isActive && 'route-selected'}`}>
                <div className="pg-sidebar-wrapper-nav-item">
                    <div className="pg-sidebar-wrapper-nav-item-img-wrapper">
                        <img
                            className="pg-sidebar-wrapper-nav-item-img"
                            src={require(`../../assets/images/sidebar/${img}.svg`)}
                            alt="icon"
                        />
                    </div>
                    <p className="pg-sidebar-wrapper-nav-item-text">
                        <FormattedMessage id={name} />
                    </p>
                </div>
            </Link>
        );
    };

    public renderProfileLink = () => {
        const { isLoggedIn, colorTheme, location } = this.props;
        const isLight = colorTheme === 'light';
        const handleLinkChange = () => this.props.toggleSidebar(false);
        const address = location ? location.pathname : '';
        const isActive = address === '/profile';

        return isLoggedIn && (
            <div className="pg-sidebar-wrapper-profile">
                <Link to="/profile" onClick={handleLinkChange} className={`${isActive && 'route-selected'}`}>
                    <div className="pg-sidebar-wrapper-profile-link">
                        <img
                            className="pg-sidebar-wrapper-profile-link-img"
                            src={require(`../../assets/images/sidebar/profile${isLight ? 'Light' : '' }.svg`)}
                            alt="icon"
                        />
                        <p className="pg-sidebar-wrapper-profile-link-text">
                            <FormattedMessage id={'page.header.navbar.profile'} />
                        </p>
                    </div>
                </Link>
            </div>
        );
    };

    public renderLogout = () => {
        const { isLoggedIn, colorTheme } = this.props;
        const isLight = colorTheme === 'light';
        if (!isLoggedIn) {
            return null;
        }

        return (
            <div className="pg-sidebar-wrapper-logout">
                <div className="pg-sidebar-wrapper-logout-link" onClick={this.props.logoutFetch}>
                    <img
                        className="pg-sidebar-wrapper-logout-link-img"
                        src={require(`../../assets/images/sidebar/logout${isLight ? 'Light' : '' }.svg`)}
                        alt="icon"
                    />
                    <p className="pg-sidebar-wrapper-logout-link-text">
                        <FormattedMessage id={'page.body.profile.content.action.logout'} />
                    </p>
                </div>
            </div>
        );
    };

    // tslint:disable:jsx-no-lambda

    private handleChangeLanguage = (language: string) => {
        this.props.changeLanguage(language);
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    isLoggedIn: selectUserLoggedIn(state),
    currentMarket: selectCurrentMarket(state),
    lang: selectCurrentLanguage(state),
    isActive: selectSidebarState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeLanguage: payload => dispatch(changeLanguage(payload)),
        toggleSidebar: payload => dispatch(toggleSidebar(payload)),
        logoutFetch: () => dispatch(logoutFetch()),
    });

// tslint:disable no-any
const Sidebar = withRouter(connect(mapStateToProps, mapDispatchToProps)(SidebarContainer) as any) as any;

export {
    Sidebar,
};
