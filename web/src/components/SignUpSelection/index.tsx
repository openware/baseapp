import React from 'react';
import { useIntl } from 'react-intl';
import { ChevronSetupIcon } from 'src/assets/images/ChevronSetupIcon';
import { CompanyIcon } from 'src/assets/images/CompanyIcon';
import { IndividualIcon } from 'src/assets/images/IndividualIcon';

export interface SignUpSelectionFormProps {
    handleSelectSignUpType: (type: string) => void;
}

const SignUpSelectionFormComponent: React.FC<SignUpSelectionFormProps> = ({
    handleSelectSignUpType,
}) => {
    const { formatMessage } = useIntl();

    return (
        <div className="cr-sign-up-selection-form">
            <div className="cr-sign-up-selection-form__title">
                {formatMessage({ id: 'page.body.signup.selection.title' })}
            </div>
            <div className="cr-sign-up-selection-form__subtitle">
                {formatMessage({ id: 'page.body.signup.selection.subtitle' })}
            </div>
            <div className="cr-sign-up-selection-form__selector" onClick={() => handleSelectSignUpType('individual')}>
                <div className="cr-sign-up-selection-form__selector__icon"><IndividualIcon/></div>
                <div className="cr-sign-up-selection-form__selector__title">{formatMessage({ id: 'page.body.signup.selection.individual' })}</div>
                <div className="cr-sign-up-selection-form__selector__arrow"><ChevronSetupIcon/></div>
            </div>
            <div className="cr-sign-up-selection-form__selector" onClick={() => handleSelectSignUpType('company')}>
                <div className="cr-sign-up-selection-form__selector__icon"><CompanyIcon/></div>
                <div className="cr-sign-up-selection-form__selector__title">{formatMessage({ id: 'page.body.signup.selection.company' })}</div>
                <div className="cr-sign-up-selection-form__selector__arrow"><ChevronSetupIcon/></div>
            </div>
        </div>
    )
};

export const SignUpSelectionForm = React.memo(SignUpSelectionFormComponent);
