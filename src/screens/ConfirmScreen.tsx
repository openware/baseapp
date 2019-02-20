import * as React from 'react';
import { Confirm } from '../containers/Confirm';
import { Titled } from '../decorators';

@Titled('Confirm')
export class ConfirmScreen extends React.Component {
    public render() {
        return (
            <Confirm />
        );
    }
}
