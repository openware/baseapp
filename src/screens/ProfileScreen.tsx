import * as React from 'react';
import { Profile } from '../containers/Profile';
import { Titled } from '../decorators';

@Titled('Profile')
export class ProfileScreen extends React.Component {
    public render() {
        return (
            <Profile/>
        );
    }
}
