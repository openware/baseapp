import { Table } from '@openware/components';
import * as React from 'react';
import { connect } from 'react-redux';
import { selectUserData, UserData } from '../../modules/profile';

interface ReduxProps {
    userData: UserData;
}

type Props = ReduxProps;

const tableHeader = ['Date', 'Address IP', 'Location'];

class ProfileAccountActivityComponent extends React.Component<Props> {
    public render() {
        const { userData } = this.props;
        return (
            <div className="pg-profile-page__activity">
                <div className="pg-profile-page__activity-header">
                    <h3><span className="pg-profile-page__text-purple">Account</span> activity</h3>
                </div>
                <Table
                    header={tableHeader}
                    data={userData.accountActivity}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userData: selectUserData(state),
});

const ProfileAccountActivity = connect(mapStateToProps)(ProfileAccountActivityComponent);

export {
    ProfileAccountActivity,
};
