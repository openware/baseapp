import { shallow } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer, Wallet } from '../../modules';
import { CopyableTextField } from '../CopyableTextField';
import { DepositCrypto } from './';

const store = createStore(rootReducer);

describe('DepositCrypto', () => {
    let wrapper;
    const handleOnCopy = jest.fn();
    const handleGenerateAddress = jest.fn();
    const wallet: Wallet = {
        currency: 'eth',
        name: '',
        fixed: 0,
        type: 'coin',
        account_type: '',
        networks: [],
    };

    beforeEach(() => {
        wrapper = shallow(
            <Provider store={store}>
                <DepositCrypto
                    dimensions={118}
                    error={'error123'}
                    handleGenerateAddress={handleGenerateAddress}
                    handleOnCopy={handleOnCopy}
                    text={'text123'}
                    wallet={wallet}
                    disabled={false}
                    network="erc-20"
                />
                ,
            </Provider>,
        );
    });

    it('should contains QRCode', () => {
        expect(wrapper.find('.qr-code-wrapper')).toBeTruthy();
    });

    it('should contains CopyableTextField', () => {
        expect(wrapper.find(CopyableTextField)).toBeTruthy();
    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
