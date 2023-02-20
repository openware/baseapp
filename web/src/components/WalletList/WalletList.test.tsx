import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { WalletList, WalletListProps } from '../../components';
import { Wallet } from '../../modules';

const onWalletSelectionChange = jest.fn();
const walletItems: Wallet[] = [
    {
        active: false,
        locked: '1',
        currency: 'BTC',
        name: 'Bitcoin',
        balance: '456',
        type: 'fiat',
        fixed: 8,
        networks: [],
        account_type: '',
    },
    {
        active: false,
        locked: '100',
        currency: 'USD',
        name: 'United states Dollar',
        balance: '456',
        type: 'coin',
        fixed: 8,
        networks: [],
        account_type: '',
    },
    {
        active: false,
        locked: '0.4',
        currency: 'BTC',
        name: 'Bitcoin - 2',
        balance: '2',
        type: 'fiat',
        fixed: 8,
        networks: [],
        account_type: '',
    },
];

const defaultProps: WalletListProps = {
    activeIndex: 0,
    onWalletSelectionChange: onWalletSelectionChange,
    walletItems: walletItems,
    onActiveIndexChange: jest.fn,
    currencies: [],
    tickers: {},
    markets: [],
};

const renderComponent = (props: Partial<WalletListProps> = {}) =>
    render(
        <TestComponentWrapper>
            <WalletList {...{ ...defaultProps, ...props }} />
        </TestComponentWrapper>,
    );

describe('WalletList', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = renderComponent();
    });

    it('should render', () => {
        expect(wrapper.container).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(wrapper.container.querySelector('.cr-wallet-list')).toBeInTheDocument();
    });

    it('should handle onWalletSelectionChange callback when an element is pressed', () => {
        fireEvent.click(screen.getAllByRole('listitem')[0]);
        expect(onWalletSelectionChange).toHaveBeenCalled();
        expect(onWalletSelectionChange).toHaveBeenCalledTimes(1);
    });
});
