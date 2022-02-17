import { mount, shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import React from 'react';
import { WalletItem } from './';

const setup = (props: any) =>
    shallow(
        <TestComponentWrapper>
            <WalletItem {...props} />
        </TestComponentWrapper>
    );

describe('WalletItem #render', () => {
    it('uses styles by default', () => {
        const wrapper = setup({
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            active: false,
            fixed: 8,
            iconUrl: '',
            markets: [],
            tickers: {},
            currencies: [],
        }).render();
        expect(wrapper.find('div.cr-wallet-item')).toBeDefined();
    });

    it('displays codes, balances and locked', () => {
        const wrapper = setup({
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            active: false,
            fixed: 8,
            iconUrl: '',
            markets: [],
            tickers: {},
            currencies: [],
        }).render();
        expect(wrapper.find('.cr-wallet-item__description').text()).toContain('BTCBitcoin');
    });

    it('should not display locked balance if wallet does not have one', () => {
        const wrapper = setup({
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            active: false,
            fixed: 8,
            iconUrl: '',
            markets: [],
            tickers: {},
            currencies: [],
        }).render();
        const balanceElement = wrapper.find('.cr-wallet-item__balance');
        expect(balanceElement.attr('class')).not.toContain('cr-wallet-item__balance-locked');
    });

    it('should render when locked = 0', () => {
        const wrapper = setup({
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            active: false,
            fixed: 8,
            iconUrl: '',
            markets: [],
            tickers: {},
            currencies: [],
        }).render();
        expect(wrapper.find('.cr-wallet-item__balance-locked').text()).toEqual('');
    });

    it('should match snapshot', () => {
        const wrapper = setup({
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            active: false,
            fixed: 8,
            iconUrl: '',
            markets: [],
            tickers: {},
            currencies: [],
        }).render();
        expect(wrapper).toMatchSnapshot();
    });
});
