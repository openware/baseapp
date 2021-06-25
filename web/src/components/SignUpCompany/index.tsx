import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { TelegramIcon } from 'src/assets/images/TelegramIcon';

export interface SignUpCompanyFormProps {
    handleGoBack: () => void;
}

const SignUpCompanyFormComponent: React.FC<SignUpCompanyFormProps> = ({
    handleGoBack,
}) => {
    const { formatMessage } = useIntl();
    const emailLink = window.env.organization?.signup_email || '';
    const telegramLink = window.env.organization?.signup_telegram || '';

    const handleClickMail = useCallback(() => {
        window.location.href = `mailto:${emailLink}`;
    }, [emailLink]);

    const handleClickTelegram = useCallback(() => {
        window.open(telegramLink, '_blank');
    }, [telegramLink]);

    return (
        <div className="cr-sign-up-company__container">
            <div className="cr-sign-up-company__container__form">
                <div className="cr-sign-up-company__container__form__header">
                    {formatMessage({ id: 'page.body.signup.company.title' })}
                    <span className="close-icon" onClick={handleGoBack}><CloseIcon /></span>
                </div>
                <div className="cr-sign-up-company__container__form__content">
                    <div className="cr-sign-up-company__container__form__content__description">
                        {formatMessage({ id: 'page.body.signup.company.description' })}
                    </div>
                    <a className="cr-sign-up-company__container__form__content__email" href={`mailto:${emailLink}`}>
                        {emailLink}
                    </a>
                    <div className="cr-sign-up-company__container__form__content__button" onClick={handleClickMail}>
                        {formatMessage({ id: 'page.body.signup.company.button.email' })}
                    </div>
                    <div className="cr-sign-up-company__container__form__content__or">
                        {formatMessage({ id: 'page.body.signup.company.or' })}
                    </div>
                    <div className="cr-sign-up-company__container__form__content__button" onClick={handleClickTelegram}>
                        <span><TelegramIcon /></span>{formatMessage({ id: 'page.body.signup.company.button.telegram' })}
                    </div>
                </div>
            </div>
        </div>
    )
};

export const SignUpCompanyForm = React.memo(SignUpCompanyFormComponent);
