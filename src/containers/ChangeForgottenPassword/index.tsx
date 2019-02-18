import {
  Button,
  Input,
} from '@openware/components';
import cr from 'classnames';
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
    password: string;
    passwordFocused: boolean;
    confirmToken: string;
    confirmPassword: string;
    confirmPasswordFocused: boolean;
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
            confirmToken: '',
            password: '',
            passwordFocused: false,
            confirmPassword: '',
            confirmPasswordFocused: false,
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
            passwordFocused,
            confirmPassword,
            confirmPasswordFocused,
        } = this.state;

        const passwordFocusedClass = cr('pg-change-forgotten-password-screen__container-form-body-item', {
            'pg-change-forgotten-password-screen__container-form-body-item--focused': passwordFocused,
        });

        const confirmPasswordFocusedClass = cr('pg-change-forgotten-password-screen__container-form-body-item', {
            'pg-change-forgotten-password-screen__container-form-body-item--focused': confirmPasswordFocused,
        });

        const updatePassword = e => this.handleChange('password', e);
        const updateConfirmPassword = e => this.handleChange('confirmPassword', e);
        return (
            <div className="pg-change-forgotten-password-screen">
                <div className="pg-change-forgotten-password-screen__container">
                    <div className="pg-change-forgotten-password-screen__container-form">
                        <div className="pg-change-forgotten-password-screen__container-form">
                            <div className="pg-change-forgotten-password-screen__container-form-header">
                                Reset Password
                            </div>
                            <form className="pg-change-forgotten-password-screen__container-form-body">
                                <fieldset className={passwordFocusedClass}>
                                    {password && <legend>New password</legend>}
                                    <div className="pg-change-forgotten-password-screen__container-form-body-item__input">
                                        <Input
                                            type="password"
                                            value={password}
                                            placeholder="New password"
                                            onChangeValue={updatePassword}
                                            onFocus={this.handleFieldFocus('password')}
                                            onBlur={this.handleFieldFocus('password')}
                                        />
                                    </div>
                                </fieldset>
                                <fieldset className={confirmPasswordFocusedClass}>
                                    {confirmPassword && <legend>Repeat password</legend>}
                                    <div className="pg-change-forgotten-password-screen__container-form-body-item__input">
                                        <Input
                                            type="password"
                                            value={confirmPassword}
                                            placeholder="Repeat password"
                                            onChangeValue={updateConfirmPassword}
                                            onFocus={this.handleFieldFocus('confirmPassword')}
                                            onBlur={this.handleFieldFocus('confirmPassword')}
                                        />
                                    </div>
                                </fieldset>
                            </form>
                            {error && <div className="pg-change-forgotten-password-screen__container-form-alert">Fields are empty or don`t matches</div>}
                            <div className="pg-change-password-screen__container-form-footer">
                                <Button
                                    className={updatePassword && updateConfirmPassword ? 'pg-change-forgotten-password-screen__container-form-footer-button pg-change-forgotten-password-screen__container-form-footer-button--disabled' : 'pg-change-forgotten-password-screen__container-form-footer-button'}
                                    label="Change"
                                    onClick={this.handleSendNewPassword}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private handleFieldFocus = (field: string) => {
        return () => {
            switch (field) {
                case 'password':
                    this.setState({
                        passwordFocused: !this.state.passwordFocused,
                    });
                    break;
                case 'confirmPassword':
                    this.setState({
                        confirmPasswordFocused: !this.state.confirmPasswordFocused,
                    });
                    break;
                default:
                    break;
            }
        };
    }

    private handleSendNewPassword = () => {
        const { password, confirmPassword, confirmToken } = this.state;
        if (password && password === confirmPassword) {
          this.setState({
              error: false,
          });
          this.props.changeForgotPasswordFetch({
            reset_password_token: confirmToken,
            password: password,
            confirm_password: confirmPassword,
          });
        } else {
          this.setState({
              error: true,
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
