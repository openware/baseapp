import { shallow } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from '../../modules';
import { CopyableTextField } from '../CopyableTextField';
import { DepositCrypto } from './';

const store = createStore(rootReducer);

describe('DepositCrypto', () => {
    let wrapper;
    const handleOnCopy = jest.fn();

    beforeEach(() => {
        wrapper = shallow(
            <Provider store={store}>
                <DepositCrypto
                    currency="eth"
                    text={'text123'}
                    data={'123123'}
                    dimensions={118}
                    error={'error123'}
                    disabled={false}
                    handleOnCopy={handleOnCopy}
                />,
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
