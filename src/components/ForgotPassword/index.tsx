import { EmailForm } from '@openware/components';
import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
    intlShape,
} from 'react-intl';
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
    selectForgotPasswordSuccess,
} from '../../modules';

interface ReduxProps {
    success: boolean;
}

interface DispatchProps {
    forgotPassword: typeof forgotPassword;
}

type Props = RouterProps & ReduxProps & DispatchProps & InjectedIntlProps;

class ForgotPasswordComponent extends React.Component<Props> {
    //tslint:disable-next-line:no-any
    public static propTypes: React.ValidationMap<any> = {
        intl: intlShape.isRequired,
    };

    public render() {
        return (
            <div className="pg-forgot-password-screen">
                <div className="pg-forgot-password-screen__container">
                    <div className="pg-forgot-password___form">
                        <EmailForm
                            OnSubmit={this.handleChangeEmail}
                            title={this.props.intl.formatMessage({id: 'page.resendConfirmation'})}
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
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        forgotPassword: credentials => dispatch(forgotPassword(credentials)),
    });

// tslint:disable-next-line:no-any
const ForgotPassword = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(ForgotPasswordComponent) as any));

export {
    ForgotPassword,
};
