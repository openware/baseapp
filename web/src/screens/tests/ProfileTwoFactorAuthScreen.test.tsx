import { shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import React from 'react';
import { ProfileTwoFactorAuthScreen } from '../';
import { IntlProps } from '../../';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <ProfileTwoFactorAuthScreen />
        </TestComponentWrapper>,
    );

describe('ProfileTwoFactorAuthScreen test', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
