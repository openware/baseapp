import * as React from 'react';
import { passwordEntropyStep } from '../../api/config';
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

export const PasswordStrengthMeter: React.FunctionComponent<PasswordStrengthMeterProps> = props => {
    const passwordComplite = props.passwordErrorSecondSolved && props.passwordErrorFirstSolved && props.passwordErrorThirdSolved;
    const AVG_PASSWORD_ENTROPY = props.minPasswordEntropy + passwordEntropyStep();
    const STRONG_PASSWORD_ENTROPY = props.minPasswordEntropy + passwordEntropyStep() * 2;

    let passwordStrengthMeterLength = -1;

    if (props.currentPasswordEntropy < props.minPasswordEntropy) {
        passwordStrengthMeterLength = 0;
    }

    if ((props.currentPasswordEntropy < props.minPasswordEntropy && props.passwordErrorFirstSolved) || props.passwordErrorFirstSolved) {
        passwordStrengthMeterLength = 1;
    }

    if (passwordComplite) {
        if (props.currentPasswordEntropy >= props.minPasswordEntropy && props.currentPasswordEntropy < AVG_PASSWORD_ENTROPY) {
            passwordStrengthMeterLength = 2;
        }

        if (props.currentPasswordEntropy >= AVG_PASSWORD_ENTROPY && props.currentPasswordEntropy < STRONG_PASSWORD_ENTROPY) {
            passwordStrengthMeterLength = 3;
        }

        if (props.currentPasswordEntropy >= STRONG_PASSWORD_ENTROPY) {
            passwordStrengthMeterLength = 4;
        }
    }

    return (
        <div className="pg-password-strength">
            {props.passwordExist ? renderPasswordStrengthMeter(passwordStrengthMeterLength) : null}
            {renderPasswordStrengthTip(props, passwordStrengthMeterLength)}
        </div>
    );
};

const renderPasswordStrengthMeter = (passwordStrengthMeterLength: number) => (
    <div className="pg-password-strength-meter">
        <div className={`pg-password-strength-meter__block ${passwordStrengthClassName(passwordStrengthMeterLength)}`}></div>
    </div>
);

const renderPasswordStrengthTip = (props: PasswordStrengthMeterProps, passwordStrengthMeterLength: number) => (
    props.passwordPopUp ?
        <div className="pg-password-pop-up">
            <div className="pg-password-pop-up__strength">
                <div className="pg-password-pop-up__strength-title">
                    {props.translate('page.header.signUp.strength.password')}
                </div>
                <div className={`pg-password-pop-up__strength-status ${passwordStrengthClassName(passwordStrengthMeterLength)}`}>
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
        </div> : null
);

const passwordStrengthClassName = (passwordStrengthMeterLength: number) => {
    switch (passwordStrengthMeterLength) {
        case 0: return 'too-weak';
        case 1: return 'weak';
        case 2: return 'good';
        case 3: return 'strong';
        case 4: return 'very-strong';
        default: return 'too-weak';
    }
};

const passwordStrengthStatus = (passwordStrengthMeterLength: number, translate) => {
    switch (passwordStrengthMeterLength) {
        case 0: return translate('page.header.signUp.password.too.weak') || 'TOO WEAK';
        case 1: return translate('page.header.signUp.password.too.weak') || 'WEAK';
        case 2: return translate('page.header.signUp.password.good') || 'GOOD';
        case 3: return translate('page.header.signUp.password.strong') || 'STRONG';
        case 4: return translate('page.header.signUp.password.very.strong') || 'VERY STRONG';
        default: return translate('page.header.signUp.password.too.weak') || 'TOO WEAK';
    }
};
