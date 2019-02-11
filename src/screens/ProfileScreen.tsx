import * as React from 'react';
import { Profile } from '../containers/Profile';
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
