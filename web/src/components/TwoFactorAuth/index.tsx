import cr from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { CustomInput } from '../';
import { CloseIcon } from '../../assets/images/CloseIcon';

export interface TwoFactorAuthProps {
    errorMessage?: string;
    isLoading?: boolean;
    onSubmit: () => void;
    title: string;
    label: string;
    buttonLabel: string;
    message: string;
    otpCode: string;
    error: string;
    codeFocused: boolean;
    handleOtpCodeChange: (otp: string) => void;
    handleChangeFocusField: () => void;
    handleClose2fa: () => void;
}

export const TwoFactorAuthComponent: React.FC<TwoFactorAuthProps> = ({
    errorMessage,
    isLoading,
    title,
    label,
    buttonLabel,
    message,
    error,
    otpCode,
    codeFocused,
    onSubmit,
    handleOtpCodeChange,
    handleChangeFocusField,
    handleClose2fa,
}) => {
    const handleEnterPress = React.useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter') {
                event.preventDefault();

                if (!isLoading && otpCode.match(`^[0-9]{6}$`)) {
                    onSubmit();
                }
            }
        },
        [onSubmit, otpCode, isLoading]
    );

    return (
        <div className="pg-2fa___form">
            <form>
                <div className="cr-email-form">
                    <div className="cr-email-form__options-group">
                        <div className="cr-email-form__option">
                            <div className="cr-email-form__option-inner">
                                {title || '2FA verification'}
                                <div className="cr-email-form__cros-icon" onClick={handleClose2fa}>
                                    <CloseIcon className="close-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cr-email-form__form-content">
                        <div className="cr-email-form__header">{message}</div>
                        <div
                            className={cr('cr-email-form__group', {
                                'cr-email-form__group--focused': codeFocused,
                            })}>
                            <CustomInput
                                type="text"
                                label={label || '6-digit Google Authenticator Code'}
                                placeholder={label || '6-digit Google Authenticator Code'}
                                defaultLabel="6-digit Google Authenticator Code"
                                handleChangeInput={handleOtpCodeChange}
                                inputValue={otpCode}
                                handleFocusInput={handleChangeFocusField}
                                classNameLabel="cr-email-form__label"
                                classNameInput="cr-email-form__input"
                                onKeyPress={handleEnterPress}
                                autoFocus={true}
                            />
                            {errorMessage && <div className="cr-email-form__error">{errorMessage}</div>}
                        </div>
                        <div
                            className={cr('cr-email-form__button-wrapper', {
                                'cr-email-form__button-wrapper--empty': !(errorMessage || error),
                            })}>
                            <Button
                                disabled={isLoading || !otpCode.match(`^[0-9]{6}$`)}
                                onClick={onSubmit}
                                size="lg"
                                variant="primary">
                                {isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Sign in'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export const TwoFactorAuth = React.memo(TwoFactorAuthComponent);
