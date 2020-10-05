import * as React from 'react';

export interface PasswordStrengthTipProps {
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
    passwordPopUp: boolean;
    translate: (id: string) => string;
}

const PasswordStrengthTipComponent = (props: PasswordStrengthTipProps) => (
    !(props.passwordErrorFirstSolved && props.passwordErrorSecondSolved && props.passwordErrorThirdSolved) ? <div className={'pg-password-strength-tip'}>
        <span className="pg-password-strength-tip-title">{props.translate('password.strength.tip.influence')}</span>
        {!props.passwordErrorFirstSolved && <span className="pg-password-strength-tip-text">{props.translate('password.strength.tip.number.characters')}</span>}
        {!props.passwordErrorSecondSolved && <span className="pg-password-strength-tip-text">{props.translate('password.strength.tip.letter')}</span>}
        {!props.passwordErrorThirdSolved && <span className="pg-password-strength-tip-text">{props.translate('password.strength.tip.digit')}</span>}
    </div> : null
);

export const PasswordStrengthTip = React.memo(PasswordStrengthTipComponent);
