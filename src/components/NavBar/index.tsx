import classnames from 'classnames';
import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { pgRoutes } from '../../constants';
import { RootState } from '../../modules';
import { logoutFetch } from '../../modules/auth';
import {
    ContactError,
    selectSendEmailError,
    selectSendEmailSuccess,
    sendEmail,
} from '../../modules/contact';
import { selectUserInfo, selectUserLoggedIn } from '../../modules/profile';
import { walletsReset } from '../../modules/wallets';
import arrow = require('./down-arrow.svg');

// tslint:disable
export interface ReduxProps {
    address: string;
    error?: ContactError;
    isLoggedIn: boolean;
    success?: boolean;
    user: any;
}

interface DispatchProps {
    logout: typeof logoutFetch;
    sendEmail: typeof sendEmail;
    walletsReset: typeof walletsReset;
}

export interface OwnProps {
    onLinkChange?: () => void;
    history: any;
}
/* tslint:enable */

type NavbarProps = OwnProps & ReduxProps & RouteProps & DispatchProps;

const shouldUnderline = (
    address: string, url: string, index: number): boolean =>
    (url === '/trade' && address === '/trading') || address === url || (address === '/' && index === 0);

const navItem = (
    address: string, onLinkChange?: () => void,
) => (values: string[], index: number) => {
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
            <Link className={cx} to={url}>{name}</Link>
        </li>
    );
};

interface NavbarState {
    isOpen: boolean;
    email: string;
    message: string;
    name: string;
    recaptchaResponse: string;
    errorModal: boolean;
}

class NavBarComponent extends React.Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
      super(props);

      this.state = {
          isOpen: false,
          email: '',
          name: '',
          message: '',
          recaptchaResponse: '',
          errorModal: false,
      };
    }

    public componentDidUpdate(next: NavbarProps) {
        if (!this.props.isLoggedIn && next.isLoggedIn) {
            this.props.walletsReset();
            localStorage.clear();
            this.props.history.push('/trading');
        }
    }

    public render() {
        const { location, user } = this.props;
        const { isOpen } = this.state;
        const address = location ? location.pathname : '';
        const profileLink = '/profile';

        return (
            <div className={'pg-navbar'}>
                <ul className="pg-navbar__content">
                    {pgRoutes(!!user.email).map(navItem(address, this.props.onLinkChange))}
                </ul>
                {/* tslint:disable */}
                {user.email ?
                    <div>
                      <div className="pg-navbar__header-settings">
                        <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-toggle">
                          <div onClick={this.openMenu} className="email">
                            {NavBarComponent.getUserLabelFromEmail(user.email)}
                            <img className="icon" src={arrow} />
                          </div>
                          {isOpen ? (
                            <div className="dropdown-menu" role="menu">
                              <div className="dropdown-menu-item">
                                <Link
                                    className="pg-navbar__admin-logout"
                                    to={profileLink}
                                    onClick={this.handleRouteChange(profileLink)}
                                >
                                    Profile
                                </Link>
                              </div>
                              <div className="dropdown-menu-item">
                                <Link
                                    className="pg-navbar__admin-logout"
                                    to="/confirm"
                                    onClick={this.handleRouteChange('/confirm')}
                                >
                                    KYC
                                </Link>
                              </div>
                              <div className="dropdown-menu-item">
                                <a className="pg-navbar__admin-logout" onClick={this.handleLogOut}>Logout</a>
                              </div>
                            </div>) : null }
                        </div>
                      </div>
                    </div> : null}
                  {/* tslint:enable */}
            </div>
        );
    }

    private static getUserLabelFromEmail(email: string): string {
        return email.slice(0, 2);
    }

    private handleRouteChange = (to: string) => () => {
        this.setState({
           isOpen: false,
        }, () => {
            this.props.history.push(to);
        });
    }

    private handleLogOut = () => {
        this.setState({
            isOpen: false,
        }, () => {
            const twoFA = localStorage.getItem('2fa_status');
            const expiresAt = localStorage.getItem('expires_at');
            const profile = localStorage.getItem('profile');

            if (twoFA) { localStorage.removeItem('2fa_status'); }
            if (expiresAt) { localStorage.removeItem('expires_at'); }
            if (profile) { localStorage.removeItem('profile'); }

            this.props.logout();
        });
    };

    private openMenu = () => {
      this.setState(prev => ({
        isOpen: !prev.isOpen,
      }));
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        address: '',
        error: selectSendEmailError(state),
        success: selectSendEmailSuccess(state),
        user: selectUserInfo(state),
        isLoggedIn: selectUserLoggedIn(state),
    });

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        logout: () => dispatch(logoutFetch()),
        sendEmail: payload => dispatch(sendEmail(payload)),
        walletsReset: () => dispatch(walletsReset()),
    });

// tslint:disable-next-line:no-any
const NavBar = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBarComponent) as any) as any;

export {
    NavBar,
};
