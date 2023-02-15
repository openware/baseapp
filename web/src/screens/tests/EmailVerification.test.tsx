import { shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import React from 'react';
import { IntlProps } from '../../';
import { EmailVerificationScreen } from '../EmailVerification';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <EmailVerificationScreen />
        </TestComponentWrapper>,
    );

describe('EmailVerificationScreen', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
