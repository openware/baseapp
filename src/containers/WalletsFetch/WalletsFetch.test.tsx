import { shallow } from 'enzyme';

import React from 'react';

import { TestComponentWrapper } from 'lib/test';

import { WalletsFetch, WalletsFetchProps } from './';

// jest.mock('react-redux', () => {
//     const ActualReactRedux = jest.requireActual('react-redux');
//     return {
//         ...ActualReactRedux,
//     };
// });

const setup = (props: Partial<WalletsFetchProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <WalletsFetch {...props} />
        </TestComponentWrapper>
    );

describe('WalletsFetch component', () => {
    it('should match snapshot', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
