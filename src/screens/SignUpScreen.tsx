import * as React from 'react';
import { SignUp } from '../containers/SignUp';
import { Titled } from '../decorators';

@Titled('Sign Up')
class SignUpScreen extends React.Component {
    public render() {
        return (
            <SignUp />
        );
    }
}

export {
    SignUpScreen,
};
