import { shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import React from 'react';
import { IntlProps } from '../../';
import { MaintenanceScreen } from '../MaintenanceScreen';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <MaintenanceScreen />
        </TestComponentWrapper>,
    );

describe('MaintenanceScreen', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
