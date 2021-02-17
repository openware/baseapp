import { shallow } from 'enzyme';
import React from 'react';
import { TestComponentWrapper } from 'lib/test';
import { IntlProps } from '../../';
import { EmailVerificationScreen } from '../EmailVerification';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <EmailVerificationScreen />
        </TestComponentWrapper>
    );

describe('EmailVerificationScreen', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
