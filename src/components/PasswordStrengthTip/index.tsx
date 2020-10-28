import * as React from 'react';

export interface PasswordStrengthTipProps {
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
    passwordPopUp: boolean;
    translate: (id: string) => string;
}

const PasswordStrengthTipComponent: React.FC<PasswordStrengthTipProps> = ({
    passwordErrorFirstSolved,
    passwordErrorSecondSolved,
    passwordErrorThirdSolved,
    translate,
}) =>
    !(passwordErrorFirstSolved && passwordErrorSecondSolved && passwordErrorThirdSolved) ? (
        <div className={'pg-password-strength-tip'}>
            <span className="pg-password-strength-tip-title">{translate('password.strength.tip.influence')}</span>
            {!passwordErrorFirstSolved && (
                <span className="pg-password-strength-tip-text">
                    {translate('password.strength.tip.number.characters')}
                </span>
            )}
            {!passwordErrorSecondSolved && (
                <span className="pg-password-strength-tip-text">{translate('password.strength.tip.letter')}</span>
            )}
            {!passwordErrorThirdSolved && (
                <span className="pg-password-strength-tip-text">{translate('password.strength.tip.digit')}</span>
            )}
        </div>
    ) : null;

export const PasswordStrengthTip = React.memo(PasswordStrengthTipComponent);
