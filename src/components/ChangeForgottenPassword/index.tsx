import {
  Button,
  Input,
  Loader,
} from '@openware/components';
import * as React from 'react';
import {
  connect,
  MapDispatchToPropsFunction,
  MapStateToProps,
} from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import {
    changeForgotPasswordFetch,
    RootState,
    selectChangeForgotPasswordSuccess,
} from '../../modules';

interface ChangeForgottenPasswordState {
    error: boolean;
    errorMessage: string;
    password: string;
    confirmToken: string;
    confirmPassword: string;
    isLoading: boolean;
}

interface ReduxProps {
    changeForgotPassword?: boolean;
}

interface DispatchProps {
    changeForgotPasswordFetch: typeof changeForgotPasswordFetch;
}

interface HistoryProps {
    history: {
      location: {
        search: string;
      };
    };
}

type Props = RouterProps & DispatchProps & HistoryProps & ReduxProps;

class ChangeForgottenPasswordComponent extends React.Component<Props, ChangeForgottenPasswordState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            error: false,
            errorMessage: '',
            confirmToken: '',
            password: '',
            isLoading: false,
            confirmPassword: '',
        };
    }

    public componentDidMount() {
        const { history } = this.props;
        const token = new URLSearchParams(history.location.search).get('reset_token');
        if (token) {
            this.setState({
                confirmToken: token,
            });
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (next.changeForgotPassword && (!this.props.changeForgotPassword)) {
            this.props.history.push('/signin');
        }
    }

    public render() {
        const {
            error,
            password,
            confirmPassword,
            errorMessage,
            isLoading,
        } = this.state;
        const updatePassword = e => this.handleChange('password', e);
        const updateConfirmPassword = e => this.handleChange('confirmPassword', e);
        return (
            <div className="pg-forgot-password-screen">
                <div className="pg-forgot-password-screen__container">
                    <div className="pg-forgot-password-screen__container-header">
                        Forgot Password
                    </div>
                    <form className="pg-forgot-password-screen__container-body">
                        <fieldset className="pg-forgot-password-screen__container-body-item">
                            <legend>
                                New password
                            </legend>
                            <div className="pg-forgot-password-screen__container-body-item__input">
                                <Input type="password" value={password} onChangeValue={updatePassword} />
                            </div>
                        </fieldset>
                        <fieldset className="pg-forgot-password-screen__container-body-item">
                            <legend>
                                Repeat password
                            </legend>
                            <div className="pg-forgot-password-screen__container-body-item__input">
                                <Input type="password" value={confirmPassword} onChangeValue={updateConfirmPassword} />
                            </div>
                        </fieldset>
                    </form>
                    <div className="pg-forgot-password-screen__container-alert">
                        {error ? 'Passwords do not match' : null}
                        {errorMessage}
                    </div>
                    {isLoading ? <Loader/> : null}
                    <div className="pg-forgot-password-screen__container-footer">
                        <Button
                            disabled={isLoading}
                            className="pg-forgot-password-screen__container-footer-button"
                            label="Change"
                            onClick={this.handleSendNewPassword}
                        />
                    </div>
                </div>
            </div>
        );
    }

    private handleSendNewPassword = () => {
        const { password, confirmPassword, confirmToken } = this.state;
        if (password === confirmPassword) {
          this.setState({
              error: false,
              errorMessage: '',
              isLoading: true,
          });
          this.props.changeForgotPasswordFetch({
            reset_password_token: confirmToken,
            password: password,
            confirm_password: confirmPassword,
          });
        } else {
          this.setState({
              error: true,
              errorMessage: '',
          });
        }
    };

    private handleChange = (key: string, value: string) => {
      // @ts-ignore
      this.setState({
        [key]: value,
      });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    changeForgotPassword: selectChangeForgotPasswordSuccess(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeForgotPasswordFetch: credentials => dispatch(changeForgotPasswordFetch(credentials)),
    });

// tslint:disable-next-line:no-any
const ChangeForgottenPassword = withRouter(connect(mapStateToProps, mapDispatchProps)(ChangeForgottenPasswordComponent) as any);

export {
    ChangeForgottenPassword,
};
