import { Table } from '@openware/components';
import * as React from 'react';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeFullDate } from '../../helpers';
import {
    getUserActivity,
    RootState,
    selectUserActivity,
    UserActivityDataInterface,
} from '../../modules';

interface ReduxProps {
    userActivity?: UserActivityDataInterface[];
}

interface DispatchProps {
    getUserActivity: typeof getUserActivity;
}

type Props = ReduxProps & DispatchProps;

const tableHeader = ['Date', 'Action', 'Result', 'Address IP', 'User Agent'];

class ProfileAccountActivityComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.getUserActivity();
    }

    public render() {
        const { userActivity } = this.props;
        return (
            <div className="pg-profile-page__activity">
                <div className="pg-profile-page-header">
                    <h3><span className="pg-profile-page__text-purple">Account</span> activity</h3>
                </div>
                <Table
                    header={tableHeader}
                    data={userActivity ? this.getActivityData(userActivity) : [['', '', 'There is no date to show']]}
                />
            </div>
        );
    }

    private getActivityData(userData: UserActivityDataInterface[]) {
        return userData.map(item => {
            return [
                localeFullDate(item.created_at),
                item.action,
                item.result,
                item.user_ip,
                item.user_agent,
            ];
        });
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    userActivity: selectUserActivity(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        getUserActivity: () => dispatch(getUserActivity()),
    });

const ProfileAccountActivity = connect(mapStateToProps, mapDispatchToProps)(ProfileAccountActivityComponent);

export {
    ProfileAccountActivity,
};
