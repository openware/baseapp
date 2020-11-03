import { mount, shallow } from 'enzyme';

import React from 'react';

import { TestComponentWrapper } from 'lib/test';
import { WalletItem, WalletItemProps } from './';

const setup = (props: WalletItemProps) =>
    shallow(
        <TestComponentWrapper>
            <WalletItem {...props} />
        </TestComponentWrapper>
    );

describe('WalletItem #render', () => {
    it('uses styles by default', () => {
        const wrapper = setup({
            address: 'aevrv',
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            locked: '3',
            fee: 0.3,
            type: 'fiat',
            active: false,
            fixed: 8,
        }).render();
        expect(wrapper.find('div.cr-wallet-item')).toBeDefined();
    });

    it('displays codes, balances and locked', () => {
        const wrapper = setup({
            address: 'aevrv',
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            locked: '3',
            fee: 0.3,
            type: 'fiat',
            active: false,
            fixed: 8,
        }).render();
        expect(wrapper.find('.cr-wallet-item__description').text()).toContain('BTCBitcoin');
    });

    it('should not display locked balance if wallet does not have one', () => {
        const wrapper = setup({
            address: 'aevrv',
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            locked: '3',
            fee: 0.3,
            type: 'fiat',
            active: false,
            fixed: 8,
        }).render();
        const balanceElement = wrapper.find('.cr-wallet-item__balance');
        expect(balanceElement.attr('class')).not.toContain('cr-wallet-item__balance-locked');
    });

    it('shows locked amount', () => {
        const wrapper = setup({
            address: 'aevrv',
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            locked: '3',
            fee: 0.3,
            type: 'fiat',
            active: false,
            fixed: 8,
        }).render();
        const className = wrapper.find('div').first().attr('class');
        expect(className).toContain('cr-wallet-item__info');
        expect(wrapper.find('.cr-wallet-item__amount-locked').text().trim()).toEqual('3.00000000');
    });

    it('should render when locked = 0', () => {
        const wrapper = setup({
            address: 'aevrv',
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            locked: '',
            fee: 0.3,
            type: 'fiat',
            active: false,
            fixed: 8,
        }).render();
        expect(wrapper.find('.cr-wallet-item__balance-locked').text()).toEqual('');
    });

    it('should match snapshot', () => {
        const wrapper = setup({
            address: 'aevrv',
            currency: 'BTC',
            name: 'Bitcoin',
            balance: '45',
            locked: '3',
            fee: 0.3,
            type: 'fiat',
            active: false,
            fixed: 8,
        }).render();
        expect(wrapper).toMatchSnapshot();
    });
});
