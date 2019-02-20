import * as React from 'react';
import { ForgotPassword } from '../containers/ForgotPassword';
import { Titled } from '../decorators';

@Titled('Forgot password')
export class ForgotPasswordScreen extends React.Component {
    public render() {
        return (
           <ForgotPassword />
        );
    }
}
