import { shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import React from 'react';
import { IntlProps } from '../../';
import { ForgotPasswordScreen } from '../ForgotPassword';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <ForgotPasswordScreen />
        </TestComponentWrapper>,
    );

describe('ForgotPasswordScreen', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
