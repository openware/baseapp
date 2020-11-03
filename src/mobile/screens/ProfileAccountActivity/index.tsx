import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { Pagination } from '../../../components';
import { useUserActivityFetch } from '../../../hooks';
import {
    RootState,
    selectUserActivity,
    selectUserActivityCurrentPage,
    selectUserActivityFirstElemIndex,
    selectUserActivityLastElemIndex,
    selectUserActivityNextPageExists,
} from '../../../modules';
import { Subheader, UserActivityItem } from '../../components';

const DEFAULT_LIMIT = 10;

const ProfileAccountActivityMobileScreenComponent: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState(0);
    const intl = useIntl();
    const history = useHistory();
    const page = useSelector(selectUserActivityCurrentPage);
    const userActivity = useSelector(selectUserActivity);
    const firstElemIndex = useSelector((state: RootState) => selectUserActivityFirstElemIndex(state, DEFAULT_LIMIT));
    const lastElemIndex = useSelector((state: RootState) => selectUserActivityLastElemIndex(state, DEFAULT_LIMIT));
    const nextPageExists = useSelector((state: RootState) => selectUserActivityNextPageExists(state, DEFAULT_LIMIT));
    useUserActivityFetch({ page: currentPage, limit: DEFAULT_LIMIT });

    const onClickPrevPage = () => {
        setCurrentPage(Number(page) - 1);
    };
    const onClickNextPage = () => {
        setCurrentPage(Number(page) + 1);
    };

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
                        <span className="no-data">{intl.formatMessage({ id: 'page.noDataToShow' })}</span>
                    )}
                    <Pagination
                        firstElemIndex={firstElemIndex}
                        lastElemIndex={lastElemIndex}
                        page={currentPage}
                        nextPageExists={nextPageExists}
                        onClickPrevPage={onClickPrevPage}
                        onClickNextPage={onClickNextPage}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};

export const ProfileAccountActivityMobileScreen = React.memo(ProfileAccountActivityMobileScreenComponent);
