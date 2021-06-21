import React from 'react';
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
                    <div className="cr-sign-up-company__container__form__content__email">
                        {formatMessage({ id: 'page.body.signup.company.link.email' })}
                    </div>
                    <div className="cr-sign-up-company__container__form__content__button">
                        {formatMessage({ id: 'page.body.signup.company.button.email' })}
                    </div>
                    <div className="cr-sign-up-company__container__form__content__or">
                        {formatMessage({ id: 'page.body.signup.company.or' })}
                    </div>
                    <div className="cr-sign-up-company__container__form__content__button">
                        <span><TelegramIcon /></span>{formatMessage({ id: 'page.body.signup.company.button.telegram' })}
                    </div>
                </div>
            </div>
        </div>
    )
};

export const SignUpCompanyForm = React.memo(SignUpCompanyFormComponent);
