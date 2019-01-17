import * as React from 'react';
import { Profile } from '../components/Profile';
import { Titled } from '../decorators';

@Titled('Profile')
class ProfileScreen extends React.Component {
    public render() {
        return (
            <Profile/>
        );
    }
}

export {
    ProfileScreen,
};
