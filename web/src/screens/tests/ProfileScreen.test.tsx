import { shallow } from 'enzyme';
import React from 'react';
import { TestComponentWrapper } from 'lib/test';
import { ProfileScreen } from '../';

const setup = () =>
    shallow(
        <TestComponentWrapper>
            <ProfileScreen />
        </TestComponentWrapper>
    );

describe('ProfileScreen test', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
