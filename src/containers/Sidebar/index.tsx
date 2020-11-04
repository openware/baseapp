import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Dropdown } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'redux';

import { languages } from '../../api/config';
import { LogoutIcon } from '../../assets/images/sidebar/LogoutIcon';
import { ProfileIcon } from '../../assets/images/sidebar/ProfileIcon';
import { SidebarIcons } from '../../assets/images/sidebar/SidebarIcons';
import { pgRoutes } from '../../constants';
import {
    changeLanguage,
    changeUserDataFetch,
    logoutFetch,
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectSidebarState,
    selectUserInfo,
    selectUserLoggedIn,
    toggleSidebar,
    User,
} from '../../modules';

import enIcon from 'src/assets/images/sidebar/en.svg';
import ruIcon from 'src/assets/images/sidebar/ru.svg';

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
    user: User;
}

interface OwnProps {
    onLinkChange?: () => void;
    history: History;
    changeUserDataFetch: typeof changeUserDataFetch;
}

type Props = OwnProps & ReduxProps & RouteProps & DispatchProps;

class SidebarContainer extends React.Component<Props, State> {
    public state = {
        isOpenLanguage: false,
    };

    public render() {
        const { isLoggedIn, isActive, lang } = this.props;
        const { isOpenLanguage } = this.state;

        const address = this.props.history.location ? this.props.history.location.pathname : '';
        const languageName = lang.toUpperCase();

        const languageClassName = classnames('dropdown-menu-language-field', {
            'dropdown-menu-language-field-active': isOpenLanguage,
        });

        const sidebarClassName = classnames('pg-sidebar-wrapper', {
            'pg-sidebar-wrapper--active': isActive,
            'pg-sidebar-wrapper--hidden': !isActive,
        });

        return (
            <div className={sidebarClassName}>
                {this.renderProfileLink()}
                <div className="pg-sidebar-wrapper-nav">{pgRoutes(isLoggedIn).map(this.renderNavItems(address))}</div>
                <div className="pg-sidebar-wrapper-lng">
                    <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-menu-language-container">
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id={languageClassName}>
                                <img src={this.getLanguageIcon(lang)} alt={lang} />
                                <span className="dropdown-menu-language-selected">{languageName}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>{this.getLanguageDropdownItems()}</Dropdown.Menu>
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

        const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
            'pg-sidebar-wrapper-nav-item-img--active': isActive,
        });

        return (
            <Link to={path} key={index} onClick={handleLinkChange} className={`${isActive && 'route-selected'}`}>
                <div className="pg-sidebar-wrapper-nav-item">
                    <div className="pg-sidebar-wrapper-nav-item-img-wrapper">
                        <SidebarIcons className={iconClassName} name={img} />
                    </div>
                    <p className="pg-sidebar-wrapper-nav-item-text">
                        <FormattedMessage id={name} />
                    </p>
                </div>
            </Link>
        );
    };

    public renderProfileLink = () => {
        const { isLoggedIn, location } = this.props;
        const handleLinkChange = () => this.props.toggleSidebar(false);
        const address = location ? location.pathname : '';
        const isActive = address === '/profile';

        const iconClassName = classnames('pg-sidebar-wrapper-nav-item-img', {
            'pg-sidebar-wrapper-nav-item-img--active': isActive,
        });

        return (
            isLoggedIn && (
                <div className="pg-sidebar-wrapper-profile">
                    <Link to="/profile" onClick={handleLinkChange} className={`${isActive && 'route-selected'}`}>
                        <div className="pg-sidebar-wrapper-profile-link">
                            <ProfileIcon className={iconClassName} />
                            <p className="pg-sidebar-wrapper-profile-link-text">
                                <FormattedMessage id={'page.header.navbar.profile'} />
                            </p>
                        </div>
                    </Link>
                </div>
            )
        );
    };

    public renderLogout = () => {
        const { isLoggedIn } = this.props;
        if (!isLoggedIn) {
            return null;
        }

        return (
            <div className="pg-sidebar-wrapper-logout">
                <div className="pg-sidebar-wrapper-logout-link" onClick={this.props.logoutFetch}>
                    <LogoutIcon className="pg-sidebar-wrapper-logout-link-img" />
                    <p className="pg-sidebar-wrapper-logout-link-text">
                        <FormattedMessage id={'page.body.profile.content.action.logout'} />
                    </p>
                </div>
            </div>
        );
    };

    public getLanguageDropdownItems = () => {
        return languages.map((l: string, index: number) => (
            <Dropdown.Item key={index} onClick={() => this.handleChangeLanguage(l)}>
                <div className="dropdown-row">
                    <img src={this.getLanguageIcon(l)} alt={l} />
                    <span>{l.toUpperCase()}</span>
                </div>
            </Dropdown.Item>
        ));
    };

    private getLanguageIcon = (name: string): string => {
        if (name === 'ru') {
            return ruIcon;
        } else {
            return enIcon;
        }
    };

    private handleChangeLanguage = (language: string) => {
        const { user, isLoggedIn } = this.props;

        if (isLoggedIn) {
            const data = user.data && JSON.parse(user.data);

            if (data && data.language && data.language !== language) {
                const payload = {
                    ...user,
                    data: JSON.stringify({
                        ...data,
                        language,
                    }),
                };

                this.props.changeUserDataFetch({ user: payload });
            }
        }

        this.props.changeLanguage(language);
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    isLoggedIn: selectUserLoggedIn(state),
    currentMarket: selectCurrentMarket(state),
    lang: selectCurrentLanguage(state),
    isActive: selectSidebarState(state),
    user: selectUserInfo(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, unknown> = (dispatch) => ({
    changeLanguage: (payload) => dispatch(changeLanguage(payload)),
    toggleSidebar: (payload) => dispatch(toggleSidebar(payload)),
    logoutFetch: () => dispatch(logoutFetch()),
    changeUserDataFetch: (payload) => dispatch(changeUserDataFetch(payload)),
});

export const Sidebar = compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(SidebarContainer) as React.ComponentClass;
