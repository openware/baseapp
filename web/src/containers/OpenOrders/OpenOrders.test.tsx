import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { OpenOrdersComponent } from '.';
import { Market } from '../../modules';
import { OrderCommon } from '../../modules/types';

const currentMarket: Market | undefined = {
    id: 'ethusd',
    name: 'ETH/USD',
    base_unit: 'eth',
    quote_unit: 'usd',
    min_price: '0.0',
    max_price: '0.0',
    min_amount: '0.0',
    amount_precision: 4,
    price_precision: 4,
};

const openOrdersData: OrderCommon[] = [
    {
        id: 131,
        side: 'sell',
        price: '104.4313',
        created_at: '2019-01-31T21:14:04+01:00',
        remaining_volume: '0',
        origin_volume: '10',
        executed_volume: '10',
        state: 'wait',
        market: 'ethusd',
    },
];

const defaultProps = {
    currentMarket,
    list: openOrdersData,
    fetching: false,
    cancelFetching: false,
    userLoggedIn: true,
};

const renderComponent = (props) =>
    render(
        <TestComponentWrapper>
            <OpenOrdersComponent {...{ ...defaultProps, ...props }} />
        </TestComponentWrapper>,
    );

describe('OpenOrders', () => {
    it('should render', () => {
        expect(renderComponent({}).container).toMatchSnapshot();
    });
});
