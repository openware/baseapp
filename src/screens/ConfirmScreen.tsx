import * as React from 'react';
import { Confirm } from '../components/Confirm';
import { Titled } from '../decorators';

@Titled('Confirm')
class ConfirmScreen extends React.Component {
    public render() {
        return (
            <Confirm />
        );
    }
}

export {
    ConfirmScreen,
};
