import cr from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    FormattedMessage,
    injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ProfileTwoFactorAuth } from '../';
import { IntlProps } from '../../';
import { isUsernameEnabled } from '../../api';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { ChangePassword, CustomInput, Modal } from '../../components';
import {
    entropyPasswordFetch,
    RootState,
    selectCurrentPasswordEntropy,
    selectUserInfo,
    User,
} from '../../modules';
import {
    changePasswordFetch,
    selectChangePasswordSuccess,
    toggle2faFetch,
} from '../../modules/user/profile';


interface ReduxProps {
    user: User;
    passwordChangeSuccess?: boolean;
    currentPasswordEntropy: number;
}

interface RouterProps {
    history: History;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DispatchProps {
    changePassword: typeof changePasswordFetch;
    clearPasswordChangeError: () => void;
    toggle2fa: typeof toggle2faFetch;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
}

interface ProfileProps {
    showModal: boolean;
}

interface State {
    showChangeModal: boolean;
    showModal: boolean;
    code2FA: string;
    code2FAFocus: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & ProfileProps & IntlProps & OnChangeEvent;

class ProfileAuthDetailsComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showChangeModal: false,
            showModal: false,
            code2FA: '',
            code2FAFocus: false,
        };
    }

    public componentWillReceiveProps(next: Props) {
        if (next.passwordChangeSuccess) {
            this.setState({ showChangeModal: false });
        }
    }

    public render() {
        const {
            user,
            currentPasswordEntropy,
        } = this.props;

        const modal = this.state.showChangeModal ? (
            <div className="cr-modal">
              <form className="cr-email-form">
                <div className="pg-change-password-screen">
                   <ChangePassword
                        handleChangePassword={this.props.changePassword}
                        title={this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.change' })}
                        closeModal={this.toggleChangeModal}
                        currentPasswordEntropy={currentPasswordEntropy}
                        fetchCurrentPasswordEntropy={this.props.fetchCurrentPasswordEntropy}
                    />
                </div>
              </form>
            </div>
        ) : null;

        return (
            <div className="pg-profile-page__box pg-profile-page__left-col__basic">
                <div className="pg-profile-page__box-header pg-profile-page__left-col__basic__info-row">
                    <div className="pg-profile-page__left-col__basic__info-row__block">
                        <div className="pg-profile-page__row pg-profile-page__details-user">
                            <p>{user.email}</p>
                        </div>
                        <div className="pg-profile-page__row">
                            <h2>UID: {user.uid}</h2>
                        </div>
                        {isUsernameEnabled() && user.username ? (
                            <div className="pg-profile-page__row">
                                <h2>{this.props.intl.formatMessage({ id: 'page.body.profile.header.account.username'})}: {user.username}
                                </h2>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="pg-profile-page__row">
                    <div>
                        <div className="pg-profile-page__label">
                            {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password'})}
                        </div>
                        <div>
                            ************
                        </div>
                    </div>
                    <Button
                        className="btn-block mt-3 mb-3 btn-lg btn btn-primary w-25"
                        onClick={this.toggleChangeModal}
                        size="lg"
                        variant="primary"
                    >
                        {this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password.button.change'})}
                    </Button>
                    {modal}
                </div>
                {this.renderProfileTwoFactor()}
                <Modal
                    className="pg-profile-page__disable-2fa-modal"
                    show={this.state.showModal}
                    header={this.renderModalHeader()}
                    content={this.renderModalBody()}
                    footer={this.renderModalFooter()}
                />
            </div>
        );
    }

    private renderProfileTwoFactor = () => {
        return (
            <React.Fragment>
                <div className="pg-profile-page__row">
                    <ProfileTwoFactorAuth is2faEnabled={this.props.user.otp} navigateTo2fa={this.handleNavigateTo2fa}/>
                </div>
            </React.Fragment>
        );
    };

    private renderModalHeader = () => {
        return (
            <div className="cr-email-form__options-group">
                <div className="cr-email-form__option">
                    <div className="cr-email-form__option-inner">
                        <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalHeader"/>
                        <div className="cr-email-form__cros-icon" onClick={this.closeModal}>
                            <CloseIcon className="close-icon" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    private renderModalBody = () => {
        const { code2FA, code2FAFocus } = this.state;

        const code2FAClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': code2FAFocus,
        });

        return (
            <div className="pg-exchange-modal-submit-body pg-exchange-modal-submit-body-2fa">
                <div className={code2FAClass}>
                    <CustomInput
                        type="text"
                        label="2FA code"
                        placeholder="2FA code"
                        defaultLabel=""
                        handleFocusInput={this.handleClickFieldFocus('code2FAFocus')}
                        handleChangeInput={this.handleChange2FACode}
                        inputValue={code2FA}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={true}
                    />
                </div>
            </div>
        );
    };

    private renderModalFooter = () => {
        const { code2FA } = this.state;
        const isValid2FA = code2FA.match('^[0-9]{6}$');

        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    block={true}
                    disabled={!isValid2FA}
                    onClick={this.handleDisable2FA}
                    size="lg"
                    variant="primary"
                >
                    {this.props.intl.formatMessage({id: 'page.body.profile.header.account.content.twoFactorAuthentication.disable'})}
                </Button>
            </div>
        );
    };

    private handleChange2FACode = (value: string) => {
        this.setState({
            code2FA: value,
        });
    };

    private handleDisable2FA = () => {
        this.props.toggle2fa({
            code: this.state.code2FA,
            enable: false,
        });
        this.closeModal();
        this.handleChange2FACode('');
    };

    private closeModal = () => {
        this.setState({
            showModal: false,
        });
      };

    private toggleChangeModal = () => {
        this.setState({
            showChangeModal: !this.state.showChangeModal,
        });
    };

    private handleNavigateTo2fa = (enable2fa: boolean) => {
        if (enable2fa) {
            this.props.history.push('/security/2fa', { enable2fa });
        } else {
            this.setState({
                showModal: !this.state.showModal,
            });
        }
    };

    private handleClickFieldFocus = (field: string) => () => {
        this.handleFieldFocus(field);
    };

    private handleFieldFocus = (field: string) => {
        // @ts-ignore
        this.setState(prev => ({
            [field]: !prev[field],
        }));
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
});

const mapDispatchToProps = dispatch => ({
    changePassword: ({ old_password, new_password, confirm_password }) =>
        dispatch(changePasswordFetch({ old_password, new_password, confirm_password })),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    fetchCurrentPasswordEntropy: payload => dispatch(entropyPasswordFetch(payload)),
});

const ProfileAuthDetailsConnected = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileAuthDetailsComponent));
// tslint:disable-next-line:no-any
const ProfileAuthDetails = withRouter(ProfileAuthDetailsConnected as any);

export {
    ProfileAuthDetails,
};
