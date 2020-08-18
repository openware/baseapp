import * as React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import { ProfileVerification } from '../../../containers/ProfileVerification';
import { Subheader } from '../../components/Subheader';

export const ProfileVerificationMobileScreen: React.FC = () => {
    const intl = useIntl();
    const history = useHistory();

    return (
        <React.Fragment>
            <Subheader
                title={intl.formatMessage({ id: 'page.body.profile.header.account.profile' })}
                backTitle={intl.formatMessage({ id: 'page.body.profile.header.account' })}
                onGoBack={() => history.push('/profile')}
            />
            <div className="cr-mobile-profile-verification">
                <ProfileVerification />
            </div>
        </React.Fragment>
    );
};
