import { shallow } from 'enzyme';
import React from 'react';

import { TestComponentWrapper } from 'lib/test';
import { IntlProps } from '../../';
import { MaintenanceScreen } from '../MaintenanceScreen';

const setup = (props: Partial<IntlProps> = {}) =>
    shallow(
        <TestComponentWrapper>
            <MaintenanceScreen {...props} />
        </TestComponentWrapper>
    );

describe('MaintenanceScreen', () => {
    it('should render', () => {
        const wrapper = setup().render();
        expect(wrapper).toMatchSnapshot();
    });
});
