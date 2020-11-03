import * as React from 'react';

import { passwordEntropyStep } from '../../api';
import { PasswordStrengthTip } from '../PasswordStrengthTip';

export interface PasswordStrengthMeterProps {
    currentPasswordEntropy: number;
    minPasswordEntropy: number;
    passwordExist: boolean;
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
    passwordPopUp: boolean;
    translate: (id: string) => string;
}

const renderPasswordStrengthMeter = (passwordStrengthMeterLength: number) => (
    <div className="pg-password-strength-meter">
        <div
            className={`pg-password-strength-meter__block ${passwordStrengthClassName(
                passwordStrengthMeterLength
            )}`}></div>
    </div>
);

const renderPasswordStrengthTip = (props: PasswordStrengthMeterProps, passwordStrengthMeterLength: number) =>
    props.passwordPopUp ? (
        <div className="pg-password-pop-up">
            <div className="pg-password-pop-up__strength">
                <div className="pg-password-pop-up__strength-title">
                    {props.translate('page.header.signUp.strength.password')}
                </div>
                <div
                    className={`pg-password-pop-up__strength-status ${passwordStrengthClassName(
                        passwordStrengthMeterLength
                    )}`}>
                    {passwordStrengthStatus(passwordStrengthMeterLength, props.translate)}
                </div>
            </div>
            <PasswordStrengthTip
                passwordErrorFirstSolved={props.passwordErrorFirstSolved}
                passwordErrorSecondSolved={props.passwordErrorSecondSolved}
                passwordErrorThirdSolved={props.passwordErrorThirdSolved}
                passwordPopUp={props.passwordPopUp}
                translate={props.translate}
            />
        </div>
    ) : null;

const passwordStrengthClassName = (passwordStrengthMeterLength: number) => {
    switch (passwordStrengthMeterLength) {
        case 0:
            return 'too-weak';
        case 1:
            return 'weak';
        case 2:
            return 'good';
        case 3:
            return 'strong';
        case 4:
            return 'very-strong';
        default:
            return 'too-weak';
    }
};

const passwordStrengthStatus = (passwordStrengthMeterLength: number, translate) => {
    switch (passwordStrengthMeterLength) {
        case 0:
            return translate('page.header.signUp.password.too.weak') || 'TOO WEAK';
        case 1:
            return translate('page.header.signUp.password.too.weak') || 'WEAK';
        case 2:
            return translate('page.header.signUp.password.good') || 'GOOD';
        case 3:
            return translate('page.header.signUp.password.strong') || 'STRONG';
        case 4:
            return translate('page.header.signUp.password.very.strong') || 'VERY STRONG';
        default:
            return translate('page.header.signUp.password.too.weak') || 'TOO WEAK';
    }
};

const PasswordStrengthMeterComponent: React.FC<PasswordStrengthMeterProps> = (props) => {
    const {
        passwordErrorSecondSolved,
        passwordErrorFirstSolved,
        passwordErrorThirdSolved,
        minPasswordEntropy,
        currentPasswordEntropy,
        passwordExist,
    } = props;

    const passwordComplite = passwordErrorSecondSolved && passwordErrorFirstSolved && passwordErrorThirdSolved;
    const AVG_PASSWORD_ENTROPY = minPasswordEntropy + passwordEntropyStep();
    const STRONG_PASSWORD_ENTROPY = minPasswordEntropy + passwordEntropyStep() * 2;

    let passwordStrengthMeterLength = -1;

    if (currentPasswordEntropy < minPasswordEntropy) {
        passwordStrengthMeterLength = 0;
    }

    if ((currentPasswordEntropy < minPasswordEntropy && passwordErrorFirstSolved) || passwordErrorFirstSolved) {
        passwordStrengthMeterLength = 1;
    }

    if (passwordComplite) {
        if (currentPasswordEntropy >= minPasswordEntropy && currentPasswordEntropy < AVG_PASSWORD_ENTROPY) {
            passwordStrengthMeterLength = 2;
        }

        if (currentPasswordEntropy >= AVG_PASSWORD_ENTROPY && currentPasswordEntropy < STRONG_PASSWORD_ENTROPY) {
            passwordStrengthMeterLength = 3;
        }

        if (currentPasswordEntropy >= STRONG_PASSWORD_ENTROPY) {
            passwordStrengthMeterLength = 4;
        }
    }

    return (
        <div className="pg-password-strength">
            {passwordExist ? renderPasswordStrengthMeter(passwordStrengthMeterLength) : null}
            {renderPasswordStrengthTip(props, passwordStrengthMeterLength)}
        </div>
    );
};

export const PasswordStrengthMeter = React.memo(PasswordStrengthMeterComponent);
