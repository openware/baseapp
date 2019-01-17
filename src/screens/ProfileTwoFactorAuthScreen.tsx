import * as React from 'react';
import { ToggleTwoFactorAuth } from '../components';
import { Titled } from '../decorators';

@Titled('Two factor authentication')
class ProfileTwoFactorAuthScreen extends React.Component {
    public render() {
        return <ToggleTwoFactorAuth />;
    }
}

export {
    ProfileTwoFactorAuthScreen,
};
