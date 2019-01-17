import * as React from 'react';
import { Wallets } from '../components/Wallets';
import { Titled } from '../decorators';

@Titled('Wallets')
class WalletsScreen extends React.Component {
    public render() {
        return (
            <Wallets />
        );
    }
}

export {
    WalletsScreen,
};
