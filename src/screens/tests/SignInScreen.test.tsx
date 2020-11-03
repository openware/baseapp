import { shallow } from 'enzyme';
import React from 'react';

import { TestComponentWrapper } from 'lib/test';
import { IntlProps } from '../../';
import { SignInScreen } from '../SignInScreen';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <SignInScreen />
        </TestComponentWrapper>
    );

describe('SignInScreen', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
