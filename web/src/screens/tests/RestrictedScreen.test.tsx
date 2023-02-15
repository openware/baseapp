import { shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import React from 'react';
import { IntlProps } from '../../';
import { RestrictedScreen } from '../RestrictedScreen';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <RestrictedScreen />
        </TestComponentWrapper>,
    );

describe('RestrictedScreen', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
