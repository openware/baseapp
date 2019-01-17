import {
  Button,
  Input,
  Modal,
} from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { pgRoutes } from '../../constants';
import { EMAIL_REGEX } from '../../helpers';
import { RootState } from '../../modules';
import { logoutFetch } from '../../modules/auth';
import {
    ContactError,
    selectSendEmailError,
    selectSendEmailSuccess,
    sendEmail,
} from '../../modules/contact';
import { selectUserInfo, selectUserLoggedIn } from '../../modules/profile';
import close = require('./close.svg');
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
}

export interface OwnProps {
    onLinkChange?: () => void;
    history: any;
}
/* tslint:enable */

type NavbarProps = OwnProps & ReduxProps & RouteProps & DispatchProps;

const shouldUnderline = (
    address: string, url: string, index: number): boolean =>
    address === url || (address === '/' && index === 0);

const navItem = (
    address: string, onLinkChange?: () => void,
) => (values: string[], index: number) => {
    const [name, url] = values;
    const cx = classnames('pg-navbar__content-item', {
        'pg-navbar__content-item--active': shouldUnderline(address, url, index),
        'pg-navbar__trading': name === 'Advanced Trading',
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
    isOpenContact: boolean;
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
          isOpenContact: false,
          email: '',
          name: '',
          message: '',
          recaptchaResponse: '',
          errorModal: false,
      };
    }

    public render() {
        const { location, user } = this.props;
        const { isOpen, isOpenContact } = this.state;
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
                                <span
                                    className="pg-navbar__admin-logout"
                                    onClick={this.openContact}
                                >
                                    Contact
                                </span>
                                <Modal
                                    className="pg-contact-modal"
                                    show={isOpenContact}
                                    header={this.renderHeaderModal()}
                                    content={this.renderBodyModal()}
                                    footer={this.renderFooterModal()}
                                />
                              </div>
                              <div className="dropdown-menu-item">
                                <Link
                                    className="pg-navbar__admin-logout"
                                    to="/help"
                                    onClick={this.handleRouteChange('/help')}
                                >
                                    FAQ
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

    private openContact = () => {
      this.setState(prev => ({
        isOpenContact: !prev.isOpenContact,
      }));
    };

    private renderHeaderModal = () => {
        return (
          <div className="pg-contact-modal-header">
              <div className="pg-contact-modal-header__title">Contact Us</div>
              <div className="pg-contact-modal-header__close"><img onClick={this.openContact} src={close}/></div>
          </div>
        );
    };

    private renderBodyModal = () => {
        const { email, message, name, errorModal } = this.state;
        return (
          <div className="pg-contact-modal-body">
            <div className="pg-contact-modal-body__input">
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeValue={this.handleChangeEmail}
                />
                <Input
                    placeholder="Name"
                    value={name}
                    onChangeValue={this.handleChangeName}
                />
            </div>
            <div className="pg-contact-modal-body__text">
                <textarea value={message} onChange={this.handleChangeMessage} />
            </div>
            <ReCAPTCHA
              className="pg-contact-modal-body__recaptcha"
              sitekey="6LeBHl0UAAAAALq0JBMgY9_CnF35W797k7-q0edn"
              onChange={this.onChangeRecaptcha}
            />
            <div className="pg-contact-modal-body__error">
              {errorModal ? 'Something went wrong! Try again please!' : null}
            </div>
          </div>
        );
    };

    private onChangeRecaptcha = (value: string) => {
      this.setState({
        recaptchaResponse: value,
      });
    };

    private renderFooterModal = () => {
        return (
          <div className="pg-contact-modal-footer">
              <Button
                  className="pg-contact-modal-footer__button"
                  label="Send"
                  onClick={this.sendLetter}
              />
          </div>
        );
    };

    private handleChangeEmail = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangeName = (value: string) => {
        this.setState({
            name: value,
        });
    };

    private handleChangeMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            message: event.target.value,
        });
    };

    private sendLetter = () => {
      const { email, message, name, recaptchaResponse } = this.state;

      if (email.length && message.length && name.length && recaptchaResponse.length && email.match(EMAIL_REGEX)) {
        const requestProps = {
            sender_email: email,
            description: message,
            name: name,
            subject: `${name} for rubykube.io`,
            recaptcha_response: recaptchaResponse,
        };
        this.props.sendEmail(requestProps);
        this.openContact();
        this.setState({
          errorModal: false,
          email: '',
          message: '',
          recaptchaResponse: '',
          name: '',
        });
      } else {
        this.setState({
          errorModal: true,
        });
      }
    }
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
    });

// tslint:disable-next-line:no-any
const NavBar = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBarComponent) as any) as any;

export {
    NavBar,
};
