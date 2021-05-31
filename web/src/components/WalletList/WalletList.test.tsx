import { mount, shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { TestComponentWrapper } from 'lib/test';
import { WalletList, WalletListProps } from '../../components';
import { Wallet } from '../../modules';

const onWalletSelectionChange = jest.fn();
const walletItems: Wallet[] = [
    {
        account_type: '',
        active: false,
        locked: '1',
        fee: 0.123,
        currency: 'BTC',
        name: 'Bitcoin',
        balance: '456',
        type: 'fiat',
        fixed: 8,
        explorerTransaction: 'https://testnet.blockchain.info/tx/#{txid}',
        explorerAddress: 'https://testnet.blockchain.info/address/#{address}'
    }, {
        account_type: '',
        active: false,
        fee: 0.123,
        locked: '100',
        currency: 'USD',
        name: 'United states Dollar',
        balance: '456',
        type: 'coin',
        fixed: 8,
    }, {
        account_type: '',
        active: false,
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
    currencies: [],
    tickers: {},
    markets: [],
};

const setup = (props: Partial<WalletListProps> = {}) =>
    shallow(<TestComponentWrapper><WalletList {...{ ...defaultProps, ...props }} /></TestComponentWrapper>);

describe('WalletList', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(wrapper.render().hasClass('cr-wallet-list')).toBeTruthy();
    });

    it('should handle onWalletSelectionChange callback when an element is pressed', () => {
        const wrapper = mount(<WalletList {...{ ...defaultProps}} />);
        const first = wrapper.find('[onClick]').first();
        first.simulate('click');
        expect(onWalletSelectionChange).toHaveBeenCalled();
        expect(onWalletSelectionChange).toHaveBeenCalledTimes(1);
    });
});
