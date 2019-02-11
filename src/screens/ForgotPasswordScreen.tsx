import * as React from 'react';
import { ForgotPassword } from '../containers/ForgotPassword';
import { Titled } from '../decorators';

@Titled('Forgot password')
class ForgotPasswordScreen extends React.Component {
    public render() {
        return (
           <ForgotPassword />
        );
    }
}

export {
    ForgotPasswordScreen,
};
