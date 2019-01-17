import {
  Button,
  Input,
} from '@openware/components';
import * as React from 'react';
import {
  connect,
  MapDispatchToPropsFunction,
  MapStateToProps,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { EMAIL_REGEX } from '../../helpers';
import { RootState } from '../../modules';
import {
    forgotPassword,
    forgotPasswordError,
    PasswordError,
    selectForgotPasswordRequireVerification,
} from '../../modules/password';

interface ForgotPasswordState {
    error: boolean;
    email: string;
}

interface ReduxProps {
    forgotPasswordRequireVerification?: boolean;
}

interface DispatchProps {
    forgotPassword: typeof forgotPassword;
    forgotPasswordError: typeof forgotPasswordError;
}

type Props = RouterProps & ReduxProps & DispatchProps;

class ForgotPasswordComponent extends React.Component<Props, ForgotPasswordState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            error: false,
            email: '',
        };
    }

    public render() {
        const { email, error } = this.state;
        return (
            <div className="pg-forgot-password-screen">
                <div className="pg-forgot-password-screen__container">
                    <div className="pg-forgot-password-screen__container-header">
                        Forgot Password
                    </div>
                    <div className="pg-forgot-password-screen__container-body">
                        <div className="pg-forgot-password-screen__container-body-item">
                            Email
                            <Input value={email} onChangeValue={this.handleChangeEmail} />
                        </div>
                    </div>
                    <div className="pg-forgot-password-screen__container-alert">
                        {error ? 'Wrong format of email' : null}
                    </div>
                    <div className="pg-forgot-password-screen__container-footer">
                        <Button
                            className="pg-forgot-password-screen__container-footer-button"
                            label="Send instructions"
                            onClick={this.handleSendPassword}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private handleChangeEmail = (value: string) => {
        this.setState({
            email: value,
        });
    }

    private handleSendPassword = () => {
        const { email } = this.state;

        if (email.match(EMAIL_REGEX)) {
            this.setState({
              error: false,
            });
            this.props.forgotPassword({email});
            this.props.history.push('/signin');
        } else {
          this.setState({
              error: true,
          });
        }
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    forgotPasswordRequireVerification: selectForgotPasswordRequireVerification(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        forgotPassword: credentials => dispatch(forgotPassword(credentials)),
        forgotPasswordError: (error: PasswordError) => dispatch(forgotPasswordError(error)),
    });

// tslint:disable-next-line:no-any
const ForgotPassword = withRouter(connect(mapStateToProps, mapDispatchProps)(ForgotPasswordComponent) as any);

export {
    ForgotPassword,
};
