import { render, screen } from '@testing-library/react';
import React from 'react';
import { spy } from 'sinon';
import { Order, OrderComponentProps } from './';

const defaultProps: OrderComponentProps = {
    onSubmit: spy(),
    priceMarketBuy: 5,
    priceMarketSell: 10,
    currentMarketAskPrecision: 4,
    currentMarketBidPrecision: 5,
    availableBase: 200,
    availableQuote: 12,
    from: 'btc',
    to: 'eth',
    asks: [['10', '1']],
    bids: [['10', '1']],
    currentMarketFilters: [],
    translate: jest.fn(),
    marketId: 'BTCUSD',
};

const renderComponent = (props: Partial<OrderComponentProps> = {}) =>
    render(<Order {...{ ...defaultProps, ...props }} />);

describe('Order', () => {
    it('should match snapshot', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('button should be disabled', async () => {
        renderComponent();
        expect(screen.getByRole('button', { name: 'sell' })).toBeDisabled();
    });
});
