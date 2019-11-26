import { Button } from '@openware/components';
import * as React from 'react';

interface Props {
    title?: string;
    btnLabel?: string;
    createAccountLabel?: string;
    onSignInClick: () => void;
    onSignUpClick: () => void;
}

export class LoginBlur extends React.Component<Props> {
    public render() {
        const { title, btnLabel, createAccountLabel } = this.props;

        return (
            <div className="pg-blur">
                <div className="pg-blur__content">
                    {title ? <span className="pg-blur__content__login">{title}</span> : null}
                    <div className="pg-blur__content__button-wrapper">
                        <Button
                            label={btnLabel || 'Login'}
                            type="submit"
                            className={'cr-sign-in-form__button'}
                            onClick={this.props.onSignInClick}
                        />
                    </div>
                    <div className="pg-blur__content__create-account">
                            <div
                                className="cr-sign-in-form__bottom-section-password"
                                onClick={this.props.onSignUpClick}
                            >
                                {createAccountLabel || 'Create account'}
                            </div>
                        </div>
                </div>
            </div>
        );
    }
}
