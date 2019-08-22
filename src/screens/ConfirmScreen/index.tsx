import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import logo = require('../../assets/images/logo.svg');
import logoLight = require('../../assets/images/logoLight.svg');
import { Documents } from '../../containers/Confirm/Documents';
import { Identity } from '../../containers/Confirm/Identity';
import { Phone } from '../../containers/Confirm/Phone';
import { VersionGuardWrapper } from '../../decorators';
import { setDocumentTitle } from '../../helpers';
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

type Props = ReduxProps & HistoryProps & DispatchProps & InjectedIntlProps;

class ConfirmComponent extends React.Component<Props, ConfirmState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            title: '',
            level: 1,
        };
    }

    public componentDidMount() {
        setDocumentTitle('Confirm');
        this.props.labelFetch();
        const { userData } = this.props;
        this.setState({
            level: userData.level,
        });
    }

    public goBack = event => {
      event.preventDefault();
      this.props.history.goBack();
    };

    // tslint:disable:jsx-no-multiline-js
    public render() {
        const {
            colorTheme,
            userData,
            labels,
        } = this.props;
        const isIdentity = labels.find(w => w.key === 'profile' && w.value === 'verified');
        const currentProfileLevel = userData.level;
        const cx = classnames('pg-confirm__progress-items', {
            'pg-confirm__progress-first': currentProfileLevel === 1,
            'pg-confirm__progress-second': currentProfileLevel === 2 && !isIdentity,
            'pg-confirm__progress-third': currentProfileLevel === 3 || isIdentity,
        });
        return (
            <div className="pg-wrapper">
                <div className="pg-logo">
                    {colorTheme === 'light' ? (
                        <img src={logoLight} className="pg-logo__img" alt="Logo" />
                    ) : (
                        <img src={logo} className="pg-logo__img" alt="Logo" />
                    )}
                </div>
                <div className="pg-confirm">
                    <div className="pg-confirm-box">
                        <a
                            href="#"
                            onClick={this.goBack}
                            className="pg-confirm-box-close"
                        />
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
                            {VersionGuardWrapper(this.renderContent, Phone)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    //tslint:enable:jsx-no-multiline-js

    private renderContent = () => {
        const { labels, userData: { level } } = this.props;
        const isIdentity = labels.find(w => w.key === 'profile' && w.value === 'verified');
        switch (level) {
            case 1: return <Phone />;
            case 2: return isIdentity ? <Documents /> : <Identity />;
            case 3: return <Documents />;
            default: return 'Something went wrong';
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

// tslint:disable-next-line
export const ConfirmScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmComponent) as any));
