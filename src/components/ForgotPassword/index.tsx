import { EmailForm } from '@openware/components';
import * as React from 'react';
import {
  connect,
  MapDispatchToPropsFunction,
  MapStateToProps,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    forgotPassword,
    RootState,
    selectForgotPasswordError,
    selectForgotPasswordSuccess,
} from '../../modules';

interface ReduxProps {
    success: boolean;
    backendError?: {
        code: number;
        message: string;
    };
}

interface DispatchProps {
    forgotPassword: typeof forgotPassword;
}

type Props = RouterProps & ReduxProps & DispatchProps;

class ForgotPasswordComponent extends React.Component<Props> {
    public render() {
        const { backendError } = this.props;
        return (
            <div className="pg-forgot-password-screen">
                <div className="pg-forgot-password-screen__container">
                    <div className="pg-forgot-password___form">
                        <EmailForm
                            OnSubmit={this.handleChangeEmail}
                            title="Resend Confirmation"
                            errorMessage={(backendError && backendError.message) ? backendError.message : ''}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private handleChangeEmail = (email: string) => {
        this.props.forgotPassword({email});
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    success: selectForgotPasswordSuccess(state),
    backendError: selectForgotPasswordError(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        forgotPassword: credentials => dispatch(forgotPassword(credentials)),
    });

// tslint:disable-next-line:no-any
const ForgotPassword = withRouter(connect(mapStateToProps, mapDispatchProps)(ForgotPasswordComponent) as any);

export {
    ForgotPassword,
};
