import { shallow } from 'enzyme';
import React from 'react';

import { TestComponentWrapper } from 'lib/test';
import { SignInScreen } from '../SignInScreen';

const setup = () =>
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
