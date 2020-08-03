import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { LogoIcon } from '../../assets/images/LogoIcon';
import { Phone } from '../../containers';
import { Documents } from '../../containers/Confirm/Documents';
import { Identity } from '../../containers/Confirm/Identity';
import { setDocumentTitle } from '../../helpers';
import { IntlProps } from '../../index';
import {
    Label,
    labelFetch,
    RootState,
    selectCurrentColorTheme,
    selectLabelData,
    selectUserInfo,
    User,
} from '../../modules';

interface ReduxProps {
    colorTheme: string;
    userData: User;
    labels: Label[];
}

interface HistoryProps {
    history: History;
}

interface ConfirmState {
    title: string;
    level: number;
}

interface DispatchProps {
    labelFetch: typeof labelFetch;
}

type Props = ReduxProps & HistoryProps & DispatchProps & IntlProps;

class ConfirmComponent extends React.Component<Props, ConfirmState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            title: '',
            level: 1,
        };
    }

    public componentDidMount() {
        const { labels, userData } = this.props;

        setDocumentTitle('Confirm');
        this.props.labelFetch();
        this.setState({
            level: userData.level,
        });

        this.handleCheckPendingLabel(labels);
    }

    public componentWillReceiveProps(next: Props) {
        const { labels } = this.props;

        if (next.userData.level !== this.state.level) {
            this.setState({
                level: next.userData.level,
            });
        }

        if (next.labels && JSON.stringify(next.labels) !== JSON.stringify(labels)) {
            this.handleCheckPendingLabel(next.labels);
        }
    }

    public goBack = event => {
      event.preventDefault();
      this.props.history.goBack();
    };

    public render() {
        const {
            userData,
            labels,
        } = this.props;
        const isProfileVerified = labels.length && labels.find(l => l.key === 'profile' && l.value === 'verified' && l.scope === 'private');
        const currentProfileLevel = userData.level;
        const cx = classnames('pg-confirm__progress-items', {
            'pg-confirm__progress-first': currentProfileLevel === 1,
            'pg-confirm__progress-second': currentProfileLevel === 2 && !isProfileVerified,
            'pg-confirm__progress-third': currentProfileLevel === 2 && isProfileVerified,
        });

        if (currentProfileLevel === 3) {
            this.handleRedirectToProfile();
        }

        return (
            <div className="pg-wrapper">
                <div className="pg-logo">
                    <LogoIcon className="pg-logo__img" />
                </div>
                <div className="pg-confirm">
                    <div className="pg-confirm-box">
                        <div onClick={this.goBack} className="pg-confirm-box-close">
                            <CloseIcon className="close-icon" />
                        </div>
                        <div className="pg-confirm__progress">
                            <div className={cx}>
                                <div className="pg-confirm__progress-circle-1">
                                    <span className="pg-confirm__title-text pg-confirm__active-1">
                                    <FormattedMessage id="page.body.kyc.head.phone"/>
                                    </span>
                                </div>
                                <div className="pg-confirm__progress-line-1" />
                                <div className="pg-confirm__progress-circle-2">
                                    <span className="pg-confirm__title-text pg-confirm__active-2">
                                    <FormattedMessage id="page.body.kyc.head.identity"/>
                                    </span>
                                </div>
                                <div className="pg-confirm__progress-line-2" />
                                <div className="pg-confirm__progress-circle-3">
                                    <span className="pg-confirm__title-text pg-confirm__active-3">
                                    <FormattedMessage id="page.body.kyc.head.document"/>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="pg-confirm__content">
                            {this.renderContent(!!isProfileVerified)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private renderContent = (isProfileVerified: boolean) => {
        const { level } = this.state;

        switch (level) {
            case 1: return <Phone />;
            case 2: return isProfileVerified ? <Documents /> : <Identity />;
            case 3: return <Documents />;
            default: return 'Something went wrong';
        }
    };

    private handleRedirectToProfile = () => {
        this.props.history.push('/profile');
    };

    private handleCheckPendingLabel = (labels: Label[]) => {
        const isProfileSubmitted = labels.length && labels.find(l => l.key === 'profile' && l.value === 'submitted' && l.scope === 'private');
        const isDocumentPending = labels.length && labels.find(l => l.key === 'document' && l.value === 'pending' && l.scope === 'private');

        if (isProfileSubmitted || isDocumentPending) {
            this.handleRedirectToProfile();
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    userData: selectUserInfo(state),
    labels: selectLabelData(state),
});

const mapDispatchToProps = dispatch => ({
    labelFetch: () => dispatch(labelFetch()),
});

export const ConfirmScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(ConfirmComponent) as any; // tslint:disable-line
