import cr from 'classnames';
import React, { FormEvent } from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { EMAIL_REGEX } from '../../helpers';
import { GeetestCaptchaResponse } from '../../modules';
import { selectMobileDeviceState } from '../../modules/public/globalSettings';
import { CustomInput } from '../CustomInput';

export interface EmailFormProps {
    title?: string;
    buttonLabel?: string;
    errorMessage?: string;
    isLoading?: boolean;
    OnSubmit: () => void;
    className?: string;
    emailLabel?: string;
    email: string;
    message: string;
    emailError: string;
    emailFocused: boolean;
    placeholder?: string;
    validateForm: () => void;
    handleInputEmail: (value: string) => void;
    handleFieldFocus: () => void;
    handleReturnBack: () => void;
    captchaType?: 'recaptcha' | 'geetest' | 'none';
    renderCaptcha?: JSX.Element | null;
    reCaptchaSuccess?: boolean;
    geetestCaptchaSuccess?: boolean;
    captcha_response?: string | GeetestCaptchaResponse;
}

export const EmailForm: React.FC<EmailFormProps> = (props) => {
    const isMobileDevice = useSelector(selectMobileDeviceState);

    const {
        title,
        buttonLabel,
        isLoading,
        emailLabel,
        message,
        email,
        emailFocused,
        emailError,
        captchaType,
        geetestCaptchaSuccess,
        reCaptchaSuccess,
    } = props;

    const handleCancel = () => {
        props.handleReturnBack();
    };

    const handleSubmitForm = () => {
        props.OnSubmit();
    };

    const isValidForm = () => {
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid;
    };

    const isButtonDisabled = (): boolean => {
        if (isLoading || !email.match(EMAIL_REGEX)) {
            return true;
        }

        if (captchaType === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }

        if (captchaType === 'geetest' && !geetestCaptchaSuccess) {
            return true;
        }

        return false;
    };

    const handleClick = (e: FormEvent<HTMLInputElement>) => {
        if (e) {
            e.preventDefault();
        }
        if (!isValidForm()) {
            props.validateForm();
        } else {
            handleSubmitForm();
        }
    };

    const emailFormClass = cr('cr-email-form', {
        'cr-email-form--extended': captchaType && captchaType !== 'none',
    });

    const emailGroupClass = cr('cr-email-form__group', {
        'cr-email-form__group--focused': emailFocused,
    });

    return (
        <form>
            <div className={emailFormClass}>
                {!isMobileDevice && (
                    <div className="cr-email-form__options-group">
                        <div className="cr-email-form__option">
                            <div className="cr-email-form__option-inner">
                                {title || 'Forgot password'}
                                <div className="cr-email-form__cros-icon" onClick={handleCancel}>
                                    <CloseIcon className="close-icon" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="cr-email-form__form-content">
                    <div className="cr-email-form__header">{message}</div>
                    <div className={emailGroupClass}>
                        <CustomInput
                            type="email"
                            label={emailLabel || 'Email'}
                            placeholder={emailLabel || 'Email'}
                            defaultLabel="Email"
                            handleChangeInput={props.handleInputEmail}
                            inputValue={email}
                            handleFocusInput={props.handleFieldFocus}
                            classNameLabel="cr-email-form__label"
                            classNameInput="cr-email-form__input"
                            autoFocus={!isMobileDevice}
                        />
                        {emailError && <div className="cr-email-form__error">{emailError}</div>}
                    </div>
                    {props.renderCaptcha}
                    <div className="cr-email-form__button-wrapper">
                        <Button
                            block={true}
                            type="button"
                            disabled={isButtonDisabled()}
                            onClick={(e) => handleClick(e as any)}
                            size="lg"
                            variant="primary">
                            {isLoading ? 'Loading...' : buttonLabel ? buttonLabel : 'Send'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};
