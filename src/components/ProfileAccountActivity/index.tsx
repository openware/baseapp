import { Table } from '@openware/components';
import * as React from 'react';
import { connect } from 'react-redux';
import { localeFullDate } from '../../helpers';
import { Activity, selectUserActivity } from '../../modules/profile';

interface ReduxProps {
    userData?: Activity[];
}

type Props = ReduxProps;

const tableHeader = ['Date', 'Action', 'Result', 'Address IP', 'User Agent'];

class ProfileAccountActivityComponent extends React.Component<Props> {

    public componentWillReceiveProps(next: Props) {
        if (next.userData && (this.props.userData !== next.userData)) {
            const activity = this.getActivityData(next.userData);
            this.setState({
                activity,
            });
        }
    }

    public render() {
        const { userData } = this.props;
        return (
            <div className="pg-profile-page__activity">
                <div className="pg-profile-page-header">
                    <h3><span className="pg-profile-page__text-purple">Account</span> activity</h3>
                </div>
                <Table
                    header={tableHeader}
                    data={this.getActivityData(userData)}
                />
            </div>
        );
    }

    private getActivityData(userData?: Activity[]) {
        if (!userData) {
            return [[]];
        }
        return userData.reverse().map(row => {
            return [
                localeFullDate(row.created_at),
                row.action,
                row.result,
                row.user_ip,
                row.user_agent,
            ];
        });
    }
}

const mapStateToProps = state => ({
    userData: selectUserActivity(state),
});

const ProfileAccountActivity = connect(mapStateToProps)(ProfileAccountActivityComponent);

export {
    ProfileAccountActivity,
};
