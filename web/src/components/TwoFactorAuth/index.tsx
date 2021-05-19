import * as React from 'react';
import { Button } from 'react-bootstrap';
import { CodeVerification } from '../';
import { CloseIcon } from '../../assets/images/CloseIcon';

export interface TwoFactorAuthProps {
    isMobile?: boolean;
    isLoading?: boolean;
    onSubmit: () => void;
    title: string;
    buttonLabel: string;
    message: string;
    otpCode: string;
    handleOtpCodeChange: (otp: string) => void;
    handleClose2fa: () => void;
}

export const TwoFactorAuthComponent: React.FC<TwoFactorAuthProps> = ({
    isMobile,
    isLoading,
    title,
    message,
    otpCode,
    buttonLabel,
    onSubmit,
    handleOtpCodeChange,
    handleClose2fa,
}) => {
    const handleEnterPress = React.useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' && otpCode.length >= 6) {
                event.preventDefault();
                onSubmit();
            }
        },
        [onSubmit, otpCode]
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
                        <div className="cr-email-form__group">
                            <CodeVerification
                                code={otpCode}
                                onChange={handleOtpCodeChange}
                                onSubmit={handleEnterPress}
                                codeLength={6}
                                type="text"
                                placeholder="X"
                                inputMode="decimal"
                                showPaste2FA={true}
                                isMobile={isMobile}
                            />
                        </div>
                        <div className="cr-email-form__button-wrapper">
                            <Button
                                disabled={isLoading || otpCode.length < 6}
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
