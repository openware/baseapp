import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { WalletItem } from './';

const defaults = {
    currency: 'BTC',
    name: 'Bitcoin',
    balance: '45',
    active: false,
    fixed: 8,
    iconUrl: '',
    markets: [],
    tickers: {},
    currencies: [],
};

const renderComponent = (props: any = {}) =>
    render(
        <TestComponentWrapper>
            <WalletItem {...{ ...defaults, ...props }} />
        </TestComponentWrapper>,
    );

describe('WalletItem #render', () => {
    it('should match snapshot', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('uses styles by default', () => {
        expect(renderComponent().container.querySelector('.cr-wallet-item')).toBeInTheDocument();
    });

    it('displays codes, balances and locked', () => {
        renderComponent();
        expect(screen.getByText('BTC')).toBeInTheDocument();
        expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });

    it('should not display locked balance if wallet does not have one', () => {
        const { container } = renderComponent();
        expect(container.querySelector('.cr-wallet-item__balance')).toBeInTheDocument();
        expect(container.querySelector('.cr-wallet-item__balance-locked')).not.toBeInTheDocument();
    });
});
