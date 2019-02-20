import * as React from 'react';
import { ToggleTwoFactorAuth } from '../containers';
import { Titled } from '../decorators';

@Titled('Two factor authentication')
export class ProfileTwoFactorAuthScreen extends React.Component {
    public render() {
        return <ToggleTwoFactorAuth />;
    }
}
