import * as React from 'react';
import { Wallets } from '../containers/Wallets';
import { Titled } from '../decorators';

@Titled('Wallets')
export class WalletsScreen extends React.Component {
    public render() {
        return (
            <Wallets />
        );
    }
}
