import * as React from 'react';
import { UserInfo } from '../../components';

const ProfileMobileScreenComponent = () => {
    return (
        <div className="pg-mobile-profile-screen">
            <UserInfo />
        </div>
    );
};

export const ProfileMobileScreen = React.memo(ProfileMobileScreenComponent);
