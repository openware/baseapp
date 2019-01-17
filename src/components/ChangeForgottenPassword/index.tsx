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
import { changePassword } from '../../api';
import { RootState } from '../../modules';
import {
    changePasswordError,
    PasswordError,
    selectChangeForgottenPassport,
} from '../../modules/password';

interface ChangeForgottenPasswordState {
    error: boolean;
    errorMessage: string;
    password: string;
    confirmToken: string;
    confirmPassword: string;
    isLoading: boolean;
}

interface ReduxProps {
    changeForgottenPassword?: boolean;
}

interface DispatchProps {
    changePasswordError: typeof changePasswordError;
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

        this.setState({
            confirmToken: history.location.search.split('?reset_password_token=')[1],
        });
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
                    <div className="pg-forgot-password-screen__container-body">
                        <div className="pg-forgot-password-screen__container-body-item">
                            <p className="pg-forgot-password__text">New password</p>
                            <Input type="password" value={password} onChangeValue={updatePassword} />
                        </div>
                        <div className="pg-forgot-password-screen__container-body-item-2">
                            <p className="pg-forgot-password__text">Repeat password</p>
                            <Input type="password" value={confirmPassword} onChangeValue={updateConfirmPassword} />
                        </div>
                    </div>
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
          const requestOptions = {
              reset_password_token: confirmToken,
              password: password,
          };

          changePassword(requestOptions)
              .then(() => {
                  this.setState({
                      isLoading: false,
                  });
                  this.props.history.push('/signin');
              })
              .catch(() => {
                  this.setState({
                      errorMessage: 'Something went wrong. Try again.',
                      isLoading: false,
                  });
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
    changeForgottenPassword: selectChangeForgottenPassport(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changePasswordError: (error: PasswordError) => dispatch(changePasswordError(error)),
    });

// tslint:disable-next-line:no-any
const ChangeForgottenPassword = withRouter(connect(mapStateToProps, mapDispatchProps)(ChangeForgottenPasswordComponent) as any);

export {
    ChangeForgottenPassword,
};
