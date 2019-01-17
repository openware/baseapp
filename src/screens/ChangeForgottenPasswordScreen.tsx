import * as React from 'react';
import { ChangeForgottenPassword } from '../components/ChangeForgottenPassword';
import { Titled } from '../decorators';

@Titled('Change forgotten password')
class ChangeForgottenPasswordScreen extends React.Component {
    public render() {
        return (
           <ChangeForgottenPassword />
        );
    }
}

export {
    ChangeForgottenPasswordScreen,
};
