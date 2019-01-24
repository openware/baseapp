import classnames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { RootState, selectUserInfo, User } from '../../modules';
import { Documents } from './documents';
import { Identity } from './identity';
import { Phone } from './phone';

interface ReduxProps {
    userData: User;
}

interface HistoryProps {
    history: History;
}

interface ConfirmState {
    title: string;
    level: number;
}

type Props = ReduxProps & HistoryProps;

class ConfirmComponent extends React.Component<Props, ConfirmState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            title: '',
            level: 1,
        };
    }

    public componentDidMount() {
        const { userData } = this.props;
        this.setState({
            level: userData.level,
        });
    }

    public goBack = event => {
      event.preventDefault();
      this.props.history.goBack();
    }

    public render() {
        const { userData } = this.props;
        const currentProfileLevel = userData.level;
        const cx = classnames('pg-confirm__progress-items', {
            'pg-confirm__progress-first': currentProfileLevel === 1,
            'pg-confirm__progress-second': currentProfileLevel === 2,
            'pg-confirm__progress-third': currentProfileLevel === 3,
        });
        return (
          <div className="pg-confirm">
            <div className="pg-confirm-box">
                <a href="#" onClick={this.goBack} className="pg-confirm-box-close" />
                <div className="pg-confirm__progress">
                    <div className={cx}>
                        <div className="pg-confirm__progress-circle-1">
                          <span className="pg-confirm__title-text pg-confirm__active-1">Phone Verification</span>
                        </div>
                        <div className="pg-confirm__progress-line-1" />
                        <div className="pg-confirm__progress-circle-2">
                          <span className="pg-confirm__title-text pg-confirm__active-2">Identity Verification</span>
                        </div>
                        <div className="pg-confirm__progress-line-2" />
                        <div className="pg-confirm__progress-circle-3">
                          <span className="pg-confirm__title-text pg-confirm__active-3">Document Verification</span>
                        </div>
                    </div>
                </div>
                <div className="pg-confirm__content">
                    {this.renderContent(currentProfileLevel)}
                </div>
            </div>
          </div>
        );
    }

    private renderContent = (level: number) => {
        switch (level) {
            case 1: return <Phone />;
            case 2: return <Identity />;
            case 3: return <Documents />;
            default: return 'Something went wrong';
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    userData: selectUserInfo(state),
});

// tslint:disable-next-line
export const Confirm = withRouter(connect(mapStateToProps)(ConfirmComponent) as any);
