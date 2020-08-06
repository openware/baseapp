import { History } from 'history';
import * as React from 'react';
import {Button, Spinner} from 'react-bootstrap';
import {
    injectIntl,
} from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { setDocumentTitle} from '../../helpers';
import { IntlProps } from '../../index';
import {
    emailVerificationFetch,
    RootState,
    selectCurrentLanguage, selectMobileDeviceState,
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
    isMobileDevice: boolean;
}

type Props = DispatchProps & ReduxProps & OwnProps & IntlProps;

class EmailVerificationComponent extends React.Component<Props> {
    public componentDidMount() {
        setDocumentTitle('Email verification');
        if (!this.props.location.state || !this.props.location.state.email) {
            this.props.history.push('/signin');
        }
    }

    public render() {
        const { emailVerificationLoading, isMobileDevice } = this.props;

        const title = this.props.intl.formatMessage({ id: 'page.header.signUp.modal.header' });
        const text = this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body' });
        const button = this.props.intl.formatMessage({ id: 'page.resendConfirmation' });

        return (
            <div className="pg-emailverification-container">
                <div className="pg-emailverification">
                    {!isMobileDevice && <div className="pg-emailverification-title">{title}</div>}
                    <div className="pg-emailverification-body">
                        <div className="pg-emailverification-body-text">{text}</div>
                        {
                            !isMobileDevice && (
                                <div className="pg-emailverification-body-container">
                                    {emailVerificationLoading ? <Spinner animation="border" variant="primary"/> :
                                        <button className="pg-emailverification-body-container-button"
                                                onClick={this.handleClick}>{button}</button>}
                                </div>)
                        }
                        {isMobileDevice &&
                            (<div className="pg-emailverification-body-container">
                              <Button
                                block={true}
                                type="button"
                                onClick={this.handleClick}
                                size="lg"
                                variant="primary"
                              >
                                  {this.props.intl.formatMessage({ id:  'page.mobile.reset.header' })}
                              </Button>
                            </div>)
                        }
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
    isMobileDevice: selectMobileDeviceState(state),
});

const mapDispatchToProps = {
    emailVerificationFetch,
};

export const EmailVerificationScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(EmailVerificationComponent) as React.ComponentClass;
