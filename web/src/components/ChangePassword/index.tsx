import cr from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { passwordMinEntropy } from '../../api/config';
import { CloseIcon } from '../../assets/images/CloseIcon';
import {
    PASSWORD_REGEX,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
} from '../../helpers';
import { CustomInput } from '../CustomInput';
import { PasswordStrengthMeter } from '../index';

export const ChangePasswordComponent = props => {
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmationPassword, setConfirmationPassword] = React.useState('');
    const [oldPasswordFocus, setOldPasswordFocus] = React.useState(false);
    const [newPasswordFocus, setNewPasswordFocus] = React.useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = React.useState(false);
    const [passwordErrorFirstSolved, setPasswordErrorFirstSolved] = React.useState(false);
    const [passwordErrorSecondSolved, setPasswordErrorSecondSolved] = React.useState(false);
    const [passwordErrorThirdSolved, setPasswordErrorThirdSolved] = React.useState(false);
    const [passwordPopUp, setPasswordPopUp] = React.useState(false);

    const intl = useIntl();

    const handleChangePassword = () => {
        const payload = props.hideOldPassword
        ? {
            password: newPassword,
            confirm_password: confirmationPassword,
        } : {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmationPassword,
        };

        props.handleChangePassword(payload);

        setOldPassword('');
        setNewPassword('');
        setConfirmationPassword('');
        setOldPasswordFocus(false);
        setNewPasswordFocus(false);
        setConfirmPasswordFocus(false);
    };

    const handleEnterPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (isValidForm()) {
                handleChangePassword();
            }
        }
    };

    const handleChangeNewPassword = (value: string) => {
        if (passwordErrorFirstSolution(value) && !passwordErrorFirstSolved) {
            setPasswordErrorFirstSolved(true);
        } else if (!passwordErrorFirstSolution(value) && passwordErrorFirstSolved) {
            setPasswordErrorFirstSolved(false);
        }

        if (passwordErrorSecondSolution(value) && !passwordErrorSecondSolved) {
            setPasswordErrorSecondSolved(true);
        } else if (!passwordErrorSecondSolution(value) && passwordErrorSecondSolved) {
            setPasswordErrorSecondSolved(false);
        }

        if (passwordErrorThirdSolution(value) && !passwordErrorThirdSolved) {
            setPasswordErrorThirdSolved(true);
        } else if (!passwordErrorThirdSolution(value) && passwordErrorThirdSolved) {
            setPasswordErrorThirdSolved(false);
        }

        setNewPassword(value);
        setTimeout(() => {
            props.fetchCurrentPasswordEntropy({ password: value });
        }, 500);
    };

    const handleFocusNewPassword = () => {
        setNewPasswordFocus(!newPassword);
        setPasswordPopUp(!passwordPopUp);
    };

    const translate = (key: string) => intl.formatMessage({id: key});

    const isValidForm = () => {
        const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = newPassword === confirmationPassword;
        const isOldPasswordValid = (!props.hideOldPassword && oldPassword) || true;

        return isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid;
    };

    const renderHeader = () => (
        <div className="cr-email-form__options-group">
            <div className="cr-email-form__option">
                <div className="cr-email-form__option-inner">
                    {props.title}
                    {props.closeModal && (
                        <div className="cr-email-form__cros-icon" onClick={props.closeModal}>
                            <CloseIcon className="close-icon" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderBody = () => {
        const oldPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': oldPasswordFocus,
        });

        const newPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': newPasswordFocus,
        });

        const confirmPasswordClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': confirmPasswordFocus,
        });

        return (
            <div className="pg-mobile-change-password__body" onKeyPress={handleEnterPress}>
                {!props.hideOldPassword && (
                    <div className={oldPasswordClass}>
                        <CustomInput
                            type="password"
                            label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.old' })}
                            placeholder={oldPasswordFocus ? '' : intl.formatMessage({
                                id: 'page.body.profile.header.account.content.password.old',
                            })}
                            defaultLabel="Old password"
                            handleChangeInput={setOldPassword}
                            inputValue={oldPassword}
                            handleFocusInput={() => setOldPasswordFocus(!oldPasswordFocus)}
                            classNameLabel="cr-email-form__label"
                            classNameInput="cr-email-form__input"
                            autoFocus={true}
                            labelVisible={oldPasswordFocus}
                        />
                    </div>
                )}
                <div className={newPasswordClass}>
                    <CustomInput
                        type="password"
                        label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.new' })}
                        placeholder={newPasswordFocus ? '': intl.formatMessage({
                            id: 'page.body.profile.header.account.content.password.new',
                        })}
                        defaultLabel="New password"
                        handleChangeInput={handleChangeNewPassword}
                        inputValue={newPassword}
                        handleFocusInput={handleFocusNewPassword}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={false}
                        labelVisible={newPasswordFocus}
                    />
                    {newPassword ? (
                        <PasswordStrengthMeter
                            minPasswordEntropy={passwordMinEntropy()}
                            currentPasswordEntropy={props.currentPasswordEntropy}
                            passwordExist={newPassword !== ''}
                            passwordErrorFirstSolved={passwordErrorFirstSolved}
                            passwordErrorSecondSolved={passwordErrorSecondSolved}
                            passwordErrorThirdSolved={passwordErrorThirdSolved}
                            passwordPopUp={passwordPopUp}
                            translate={translate}
                        />
                    ) : null}
                </div>
                <div className={confirmPasswordClass}>
                    <CustomInput
                        type="password"
                        label={intl.formatMessage({ id: 'page.body.profile.header.account.content.password.conf' })}
                        placeholder={confirmPasswordFocus ? '' : intl.formatMessage({
                            id: 'page.body.profile.header.account.content.password.conf',
                        })}
                        defaultLabel="Password confirmation"
                        handleChangeInput={setConfirmationPassword}
                        inputValue={confirmationPassword}
                        handleFocusInput={() => setConfirmPasswordFocus(!confirmPasswordFocus)}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={false}
                        labelVisible={confirmPasswordFocus}
                    />
                </div>
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="pg-mobile-change-password__footer">
                <Button
                    block={true}
                    disabled={!isValidForm()}
                    onClick={handleChangePassword}
                    size="lg"
                    variant="primary"
                >
                    {intl.formatMessage({id: 'page.body.profile.header.account.content.password.button.change'})}
                </Button>
            </div>
        );
    };

    return (
        <div className="pg-mobile-change-password">
            {props.title && renderHeader()}
            <div className="pg-mobile-change-password__wrapper">
                {renderBody()}
                {renderFooter()}
            </div>
        </div>
    );
};

export const ChangePassword = React.memo(ChangePasswordComponent);
