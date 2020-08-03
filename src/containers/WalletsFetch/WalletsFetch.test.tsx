import { shallow } from 'enzyme';
import * as React from 'react';
import { WalletsFetch, WalletsFetchProps } from './index';

const defaults: WalletsFetchProps = {
    walletsFetch: jest.fn(),
};

const setup = (props: Partial<WalletsFetchProps> = {}) =>
    shallow(<WalletsFetch {...{...defaults, ...props}} />);

describe.skip('WalletsFetch component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = setup();
    });
    it('should render', () => {
        expect(wrapper).toBeDefined();

    });

    it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
