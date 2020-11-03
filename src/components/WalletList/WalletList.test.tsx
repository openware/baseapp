import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';

import { WalletItemProps, WalletList, WalletListProps } from '../../components';

const onWalletSelectionChange = jest.fn();
const walletItems: WalletItemProps[] = [
    {
        active: false,
        address: 'something-0',
        locked: '1',
        fee: 0.123,
        currency: 'BTC',
        name: 'Bitcoin',
        balance: '456',
        type: 'fiat',
        fixed: 8,
    },
    {
        active: false,
        address: 'something-1',
        fee: 0.123,
        locked: '100',
        currency: 'USD',
        name: 'United states Dollar',
        balance: '456',
        type: 'coin',
        fixed: 8,
    },
    {
        active: false,
        address: 'something-2',
        fee: 0.3,
        locked: '0.4',
        currency: 'BTC',
        name: 'Bitcoin - 2',
        balance: '2',
        type: 'fiat',
        fixed: 8,
    },
];

const defaultProps: WalletListProps = {
    activeIndex: 0,
    onWalletSelectionChange: onWalletSelectionChange,
    walletItems: walletItems,
    onActiveIndexChange: jest.fn,
};

const setup = (props: Partial<WalletListProps> = {}) => shallow(<WalletList {...{ ...defaultProps, ...props }} />);

describe('WalletList', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(wrapper.hasClass('cr-wallet-list')).toBeTruthy();
    });

    it('should handle onWalletSelectionChange callback when an element is pressed', () => {
        const first = wrapper.find('[onClick]').first();
        first.simulate('click');
        expect(onWalletSelectionChange).toHaveBeenCalled();
        expect(onWalletSelectionChange).toHaveBeenCalledTimes(1);
    });
});
