import cr from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { CustomInput } from '../../../components/CustomInput';
import { ProfileTwoFactorAuth } from '../../../containers/ProfileTwoFactorAuth';
import { selectUserInfo, toggle2faFetch } from '../../../modules/user/profile';
import { ProfileTwoFactorAuthScreen } from '../../../screens/ProfileTwoFactorAuthScreen';
import { Modal } from '../../components/Modal';
import { Subheader } from '../../components/Subheader';

export const ProfileAuthMobileScreen = () => {
    const [showModal, setShowModal] = React.useState(false);
    const [code2FA, setCode2FA] = React.useState('');
    const [code2FAFocus, setCode2FAFocus] = React.useState(false);
    const dispatch = useDispatch();
    const history = useHistory();
    const intl = useIntl();
    const user = useSelector(selectUserInfo);

    const handleDisable2FA = () => {
        dispatch(toggle2faFetch({
            code: code2FA,
            enable: false,
        }));
        setShowModal(false);
        setCode2FA('');
    };

    const handleNavigateTo2fa = (enable2fa: boolean) => {
        if (enable2fa) {
            history.push('/security/2fa', { enable2fa });
        } else {
            setShowModal(state => !state);
        }
    };

    const renderModalBody = () => {
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
                        handleFocusInput={() => setCode2FAFocus(true)}
                        handleChangeInput={setCode2FA}
                        inputValue={code2FA}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={true}
                    />
                </div>
            </div>
        );
    };

    const renderModalFooter = () => {
        const isValid2FA = code2FA.match('^[0-9]{6}$');

        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    block={true}
                    disabled={!isValid2FA}
                    onClick={handleDisable2FA}
                    size="lg"
                    variant="primary"
                >
                    {intl.formatMessage({id: 'page.body.profile.header.account.content.twoFactorAuthentication.disable'})}
                </Button>
            </div>
        );
    };

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.profile.kyc.title' })}
                backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
                onGoBack={() => history.push('/profile')}
            />
            <div className="cr-mobile-profile-auth">
                <div className="cr-mobile-profile-auth__enable">
                    <div className="cr-mobile-profile-auth__enable-label">
                        <ProfileTwoFactorAuth
                            is2faEnabled={user.otp}
                            navigateTo2fa={handleNavigateTo2fa}
                        />
                    </div>
                    {!user.otp ? <ProfileTwoFactorAuthScreen/> : null}
                </div>
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'page.body.profile.header.account.content.twoFactorAuthentication.modalHeader' })}>
                    {renderModalBody()}
                    {renderModalFooter()}
                </Modal>
            </div>
        </React.Fragment>
    );
};
