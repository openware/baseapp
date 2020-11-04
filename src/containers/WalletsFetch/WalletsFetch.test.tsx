import { shallow } from 'enzyme';

import React from 'react';

import { TestComponentWrapper } from 'lib/test';

import { WalletsFetch, WalletsFetchProps } from './';
const setup = (props: Partial<WalletsFetchProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <WalletsFetch {...props} />
        </TestComponentWrapper>
    );

describe('WalletsFetch component', () => {
    it('should match snapshot', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });
});
