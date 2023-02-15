import { shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import React from 'react';
import { ProfileScreen } from '../';

const setup = () =>
    shallow(
        <TestComponentWrapper>
            <ProfileScreen />
        </TestComponentWrapper>,
    );

describe('ProfileScreen test', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
