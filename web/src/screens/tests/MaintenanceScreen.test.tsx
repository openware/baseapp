import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { IntlProps } from '../../';
import { MaintenanceScreen } from '../MaintenanceScreen';

const renderComponent = (props: Partial<IntlProps> = {}) =>
    render(
        <TestComponentWrapper>
            <MaintenanceScreen />
        </TestComponentWrapper>,
    );

describe('MaintenanceScreen', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
