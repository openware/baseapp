import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import {
    WalletList,
    WalletListProps,
} from '../../components';
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

    }, {
        active: false,
        locked: '100',
        currency: 'USD',
        name: 'United states Dollar',
        balance: '456',
        type: 'coin',
        fixed: 8,
        networks: [],
        account_type: '',
    }, {
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

const setup = (props: Partial<WalletListProps> = {}) =>
    shallow(<WalletList {...{ ...defaultProps, ...props }} />);

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
