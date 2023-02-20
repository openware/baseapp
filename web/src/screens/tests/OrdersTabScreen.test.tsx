import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { OrdersTabScreen } from '../';
import { IntlProps } from '../../';

const renderComponent = (props: Partial<IntlProps> = {}) =>
    render(
        <TestComponentWrapper>
            <OrdersTabScreen />
        </TestComponentWrapper>,
    );

describe('OrdersTabScreen test', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
