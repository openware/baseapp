import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { RecentTrades } from '..';

const defaultProps: {
    recentTrades: any[];
    currentMarket: undefined;
    userLoggedIn: boolean;
    currentPrice: undefined;
} = {
    recentTrades: [],
    currentMarket: undefined,
    currentPrice: undefined,
    userLoggedIn: true,
};

const renderComponent = () =>
    render(
        <TestComponentWrapper>
            <RecentTrades {...{ ...defaultProps }} />
        </TestComponentWrapper>,
    );

describe('RecentTradesComponent', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
