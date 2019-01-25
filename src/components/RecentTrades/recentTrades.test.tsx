import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {connect, Provider} from 'react-redux';
import { createStore } from 'redux';
import { RecentTrades } from '..';
import { Market, PublicTrade, rootReducer } from '../../modules';


interface RouterProps {
    recentTrades: PublicTrade[];
    currentMarket: Market;
}

const defaultProps: RouterProps = {
    recentTrades: [
        {
            id: 162413,
            price: '0.01',
            volume: '0.059',
            funds: '0.00059',
            market: 'bchbtc',
            created_at: '2018-12-18T14:21:23+01:00',
            maker_type: 'sell',
        },
        {
            id: 162412,
            price: '0.01',
            volume: '0.01',
            funds: '0.0001',
            market: 'bchbtc',
            created_at: '2018-12-18T14:21:23+01:00',
            maker_type: 'buy',
        },
        {
            id: 162411,
            price: '0.05',
            volume: '0.01',
            funds: '0.0005',
            market: 'bchbtc',
            created_at: '2018-12-18T14:21:23+01:00',
            maker_type: 'buy',
        },
    ],
    currentMarket: {
        name: 'XRP/BTC',
        id: 'xrpbtc',
    },
};

const store = createStore(rootReducer);

const Trades = connect()(RecentTrades);

describe('RecentTrades test', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render((<Provider store={store}><Trades {...defaultProps}/></Provider>), div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
