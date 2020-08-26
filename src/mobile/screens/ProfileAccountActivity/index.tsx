import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useUserActivityFetch } from '../../../hooks';
import { selectUserActivity } from '../../../modules';
import { Subheader, UserActivityItem } from '../../components';

const ProfileAccountActivityMobileScreenComponent: React.FC = () => {
    const intl = useIntl();
    const history = useHistory();
    const userActivity = useSelector(selectUserActivity);
    useUserActivityFetch({});

    return (
        <React.Fragment>
          <Subheader
            title={intl.formatMessage({ id: 'page.mobile.profile.accountActivity.title' })}
            backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
            onGoBack={() => history.push('/profile')}
          />
            <div className="pg-mobile-profile-account-activity-screen">
                <div className="pg-mobile-profile-account-activity-screen__list">
                    {userActivity.length ? (
                        userActivity.map((item, index) => <UserActivityItem key={index} item={item} />)
                    ) : (
                        <span className="no-data">{intl.formatMessage({id: 'page.noDataToShow'})}</span>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export const ProfileAccountActivityMobileScreen = React.memo(ProfileAccountActivityMobileScreenComponent);
