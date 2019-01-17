import * as React from 'react';
import { OpenOrdersTabComponent } from '../components/OpenOrdersTab';
import { Titled } from '../decorators';

@Titled('Open Orders')
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
