import * as React from 'react';
import { OpenOrdersTabComponent } from '../components/OpenOrdersTab';
import { Titled } from '../decorators';

@Titled('Orders')
class OpenOrdersScreen extends React.Component {
    public render() {
        return (
            <OpenOrdersTabComponent />
        );
    }
}

export {
    OpenOrdersScreen,
};
