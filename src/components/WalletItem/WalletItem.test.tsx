import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { WalletItem } from './';

describe('WalletItem', () => {
    describe('#render', () => {
        it('uses styles by default', () => {
            const wrapper = mount(
                <WalletItem
                    address={'aevrv'}
                    currency={'BTC'}
                    name={'Bitcoin'}
                    // tslint:disable-next-line:no-magic-numbers
                    balance={45}
                    // tslint:disable-next-line:no-magic-numbers
                    locked={3}
                    // tslint:disable-next-line:no-magic-numbers
                    fee={0.3}
                    type={'fiat'}
                    active={false}
                    // tslint:disable-next-line:no-magic-numbers
                    fixed={8}
                />,
            );
            const { className } = wrapper.find('div').first().props();
            expect(className).toContain('cr-wallet-item');
        });

        it('displays codes, balances and locked', () => {
            const wrapper = mount(
                <WalletItem
                    address={'aevrv'}
                    currency={'BTC'}
                    name={'Bitcoin'}
                    // tslint:disable-next-line:no-magic-numbers
                    balance={45}
                    // tslint:disable-next-line:no-magic-numbers
                    locked={3}
                    // tslint:disable-next-line:no-magic-numbers
                    fee={0.3}
                    type={'fiat'}
                    active={false}
                    // tslint:disable-next-line:no-magic-numbers
                    fixed={8}
                />,
            );
            expect(wrapper.find('.cr-wallet-item__description').text()).toContain('BTCBitcoin');
        });

        it('should not display locked balance if wallet does not have one', () => {
            const wrapper = shallow(
                <WalletItem
                    address={'aevrv'}
                    currency={'BTC'}
                    name={'Bitcoin'}
                    // tslint:disable-next-line:no-magic-numbers
                    balance={45}
                    // tslint:disable-next-line:no-magic-numbers
                    fee={0.3}
                    type={'fiat'}
                    active={false}
                    // tslint:disable-next-line:no-magic-numbers
                    fixed={8}
                />,
            );
            const balanceElement = wrapper.find('.cr-wallet-item__balance');
            expect(balanceElement.props().className)
                .not.toContain('cr-wallet-item__balance-locked');
        });

        it('shows locked amount', () => {
            const wrapper = mount(
                <WalletItem
                    address={'aevrv'}
                    currency={'BTC'}
                    name={'Bitcoin'}
                    // tslint:disable-next-line:no-magic-numbers
                    balance={45}
                    // tslint:disable-next-line:no-magic-numbers
                    locked={3}
                    // tslint:disable-next-line:no-magic-numbers
                    fee={0.3}
                    type={'fiat'}
                    active={true}
                    // tslint:disable-next-line:no-magic-numbers
                    fixed={8}
                />,
            );
            const { className } = wrapper.find('div').first().props();
            expect(className).toContain('cr-wallet-item--active');
            expect(wrapper.find('.cr-wallet-item__amount-locked').text().trim()).toEqual('3.00000000');
        });

        it('should render when locked = 0', () => {
            const wrapper = mount(
                <WalletItem
                    name={'Bitcoin'}
                    address={'aevrv'}
                    currency={'BTC'}
                    locked={0}
                    // tslint:disable-next-line:no-magic-numbers
                    fee={0.3}
                    type={'fiat'}
                    active={true}
                    // tslint:disable-next-line:no-magic-numbers
                    balance={45}
                    // tslint:disable-next-line:no-magic-numbers
                    fixed={8}
                />,
            );
            expect(wrapper.find('.cr-wallet-item__balance-locked').text()).toEqual('');
        });

        it('should match snapshot', () => {
            const wrapper = mount(
                <WalletItem
                    address={'aevrv'}
                    currency={'BTC'}
                    name={'Bitcoin'}
                    // tslint:disable-next-line:no-magic-numbers
                    balance={45}
                    // tslint:disable-next-line:no-magic-numbers
                    locked={3}
                    // tslint:disable-next-line:no-magic-numbers
                    fee={0.3}
                    type={'fiat'}
                    active={false}
                    // tslint:disable-next-line:no-magic-numbers
                    fixed={8}
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });
    });
});
