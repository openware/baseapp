import { shallow } from 'enzyme';
import React from 'react';

import { TestComponentWrapper } from 'lib/test';
import { IntlProps } from '../../';
import { SignUpScreen } from '../SignUpScreen';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <SignUpScreen {...props} />
        </TestComponentWrapper>
    );

describe('SignUpScreen', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
