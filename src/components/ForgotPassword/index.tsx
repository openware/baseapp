import {
  Button,
  Input,
  Modal,
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
import {
    forgotPassword,
    RootState,
    selectForgotPasswordError,
    selectForgotPasswordSuccess,
} from '../../modules';

interface ForgotPasswordState {
    error: boolean;
    email: string;
    showModal: boolean;
}

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

class ForgotPasswordComponent extends React.Component<Props, ForgotPasswordState> {
    public state = {
        error: false,
        email: '',
        showModal: false,
    };

    public componentWillReceiveProps(next: Props) {
        if (next.success) {
            this.setState({ showModal: true });
        }
    }

    public render() {
        const { email, error } = this.state;
        const { backendError } = this.props;
        return (
            <div className="pg-forgot-password-screen">
                <div className="pg-forgot-password-screen__container">
                    <div className="pg-forgot-password-screen__container-header">
                        Forgot Password
                    </div>
                    <form className="pg-forgot-password-screen__container-body">
                        <fieldset className="pg-forgot-password-screen__container-body-item">
                            <legend>
                                Email
                            </legend>
                            <div className="pg-forgot-password-screen__container-body-item__input">
                                <Input value={email} onChangeValue={this.handleChangeEmail} />
                            </div>
                        </fieldset>
                    </form>
                    {error && <div className="pg-forgot-password-screen__container-alert">Wrong format of email</div>}
                    {backendError && <div className="pg-forgot-password-screen__container-alert">{backendError.message}</div>}
                    <div className="pg-forgot-password-screen__container-footer">
                        <Button
                            className="pg-forgot-password-screen__container-footer-button"
                            label="Send instructions"
                            onClick={this.handleSendPassword}
                        />
                        <Modal
                            show={this.state.showModal}
                            header={this.renderModalHeader()}
                            content={this.renderModalBody()}
                            footer={this.renderModalFooter()}
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
        } else {
          this.setState({
              error: true,
          });
        }
    }

    private renderModalHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                CHANGE FORGOTTEN PASSWORD
            </div>
        );
    };

    private renderModalBody = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                <h2>
                    To change forgotten  password look for an
                    email in your inbox that provides further
                    instruction. If you cannot find the email,
                    please check your spam email
                </h2>
            </div>
        );
    };

    private renderModalFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    className="pg-exchange-modal-submit-footer__button-inverse"
                    label="OK"
                    onClick={this.closeModal}
                />
            </div>
        );
    };

    private closeModal = () => {
        this.setState({showModal: false});
        this.props.history.push('/signin');
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
