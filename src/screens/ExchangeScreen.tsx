import * as React from 'react';
import { Exchange } from '../components/Exchange';
import { Titled } from '../decorators';

@Titled('Buy/Sell')
class ExchangeScreen extends React.Component {
    public render() {
        return (
            <Exchange />
        );
    }
}

export {
    ExchangeScreen,
};
