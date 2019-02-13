import { Loader } from '@openware/components';
import { History } from 'history';
import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    emailVerificationFetch,
    RootState,
    selectSendEmailVerificationLoading,
} from '../../modules';

interface OwnProps {
    history: History;
    location: {
        state: {
            email: string;
        };
    };
}

interface DispatchProps {
    emailVerificationFetch: typeof emailVerificationFetch;
}

interface ReduxProps {
    emailVerificationLoading: boolean;
}

type Props = DispatchProps & ReduxProps & OwnProps;

class EmailVerificationComponent extends React.Component<Props> {

    public componentDidMount() {
        if (!this.props.location.state || !this.props.location.state.email) {
            this.props.history.push('/signin');
        }
    }
    public render() {
        const { emailVerificationLoading } = this.props;

        const title = 'verify your email address';
        const text = 'To complete the registration look for an email in your inbox that provides futher instructions. If you cannot find the email, please check your spam email';
        const button = 'Resend confirmation letter';
        return (
            <div className="pg-emailverification-container">
                <div className="pg-emailverification">
                    <div className="pg-emailverification-title">{title}</div>
                    <div className="pg-emailverification-body">
                        <div className="pg-emailverification-body-text">{text}</div>
                        <div className="pg-emailverification-body-container">
                            {emailVerificationLoading ? <Loader /> : <button className="pg-emailverification-body-container-button" onClick={this.handleClick}>{button}</button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private handleClick = () => {
        window.console.log(this.props.location.state.email);
        this.props.emailVerificationFetch(this.props.location.state.email);
    }
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    emailVerificationLoading: selectSendEmailVerificationLoading(state),
});

const mapDispatchProps = {
    emailVerificationFetch,
};

//tslint:disable-next-line:no-any
export const EmailVerification = withRouter(connect(mapStateToProps, mapDispatchProps)(EmailVerificationComponent) as any);
