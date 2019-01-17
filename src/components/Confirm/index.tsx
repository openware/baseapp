import classnames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState, selectUserInfo, User } from '../../modules';
import { Documents } from './documents';
import { Identity } from './identity';
import { Phone } from './phone';

interface ReduxProps {
    userData: User;
}

interface ConfirmState {
    title: string;
    level: number;
    completedIdentity: boolean;
}

type Props = ReduxProps;

class ConfirmComponent extends React.Component<Props, ConfirmState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            title: '',
            level: 1,
            completedIdentity: false,
        };
    }

    public componentDidMount() {
        const { userData } = this.props;
        this.setState({
            level: userData.level,
        });
    }

    public render() {
        const { userData } = this.props;
        const { completedIdentity } = this.state;
        const currentProfileLevel = userData.level;
        const title = this.getCurrentTitleByLevel(currentProfileLevel);
        const cx = classnames('pg-confirm__progress-items', {
            'pg-confirm__progress-first': currentProfileLevel === 1,
            'pg-confirm__progress-second': currentProfileLevel === 2 && !completedIdentity,
            'pg-confirm__progress-third': currentProfileLevel === 2 && completedIdentity || currentProfileLevel === 3,
        });
        return (
            <div className="pg-confirm">
                <div className="pg-confirm__title">
                    <span className="pg-confirm__title-text">{title}</span> Verification
                </div>
                <div className="pg-confirm__progress">
                    <div className={cx}>
                        <div className="pg-confirm__progress-circle-1" />
                        <div className="pg-confirm__progress-line-1" />
                        <div className="pg-confirm__progress-circle-2" />
                        <div className="pg-confirm__progress-line-2" />
                        <div className="pg-confirm__progress-circle-3" />
                    </div>
                </div>
                <div className="pg-confirm__content">
                    {this.renderContent(currentProfileLevel)}
                </div>
            </div>
        );
    }

    private getCurrentTitleByLevel = (level: number) => {
        const { completedIdentity } = this.state;

        switch (level) {
            case 1: return 'Phone';
            case 2: return (completedIdentity ? 'Documents' : 'Identity');
            case 3: return 'Documents';
            default: return 'Something went wrong';
        }
    };

    private renderContent = (level: number) => {
        const { completedIdentity } = this.state;

        switch (level) {
            case 1: return <Phone />;
            case 2: return (!completedIdentity ? <Documents /> : <Identity />);
            case 3: return <Documents />;
            default: return 'Something went wrong';
        }
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    userData: selectUserInfo(state),
});

// tslint:disable-next-line
export const Confirm = connect(mapStateToProps)(ConfirmComponent) as any;
