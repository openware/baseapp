import { History } from 'history';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setDocumentTitle } from '../../helpers';
import {
    emailVerificationFetch,
    RootState,
    selectCurrentLanguage,
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

type Props = DispatchProps & ReduxProps & OwnProps & InjectedIntlProps;

class EmailVerificationComponent extends React.Component<Props> {
    public componentDidMount() {
        setDocumentTitle('Email verification');
        if (!this.props.location.state || !this.props.location.state.email) {
            this.props.history.push('/signin');
        }
    }

    public render() {
        const { emailVerificationLoading } = this.props;

        const title = this.props.intl.formatMessage({ id: 'page.header.signUp.modal.header' });
        const text = this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body' });
        const button = this.props.intl.formatMessage({ id: 'page.resendConfirmation' });

        return (
            <div className="pg-emailverification-container">
                <div className="pg-emailverification">
                    <div className="pg-emailverification-title">{title}</div>
                    <div className="pg-emailverification-body">
                        <div className="pg-emailverification-body-text">{text}</div>
                        <div className="pg-emailverification-body-container">
                            {emailVerificationLoading ? <Spinner animation="border" variant="primary" /> : <button className="pg-emailverification-body-container-button" onClick={this.handleClick}>{button}</button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    private handleClick = () => {
        this.props.emailVerificationFetch({
          email: this.props.location.state.email,
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    emailVerificationLoading: selectSendEmailVerificationLoading(state),
    i18n: selectCurrentLanguage(state),
});

const mapDispatchProps = {
    emailVerificationFetch,
};

//tslint:disable-next-line:no-any
export const EmailVerificationScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(EmailVerificationComponent) as any));
