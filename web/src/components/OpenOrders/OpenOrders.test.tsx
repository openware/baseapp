import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { OpenOrders, OpenOrdersProps } from '.';

const defaultProps: OpenOrdersProps = {
    data: [
        ['13:50', 'buy', '1,442.43', '4,323.04', ''],
        ['13:50', 'sell', '1,442.43', '44,323.12', ''],
        ['13:50', 'sell', '1,442.43', '4,323.23', ''],
        ['13:50', 'buy', '1,442.43', '543.33', ''],
    ],
    onCancel: jest.fn(),
};

const renderComponent = (props: Partial<OpenOrdersProps> = {}) =>
    render(
        <TestComponentWrapper>
            <OpenOrders {...{ ...defaultProps, ...props }} />
        </TestComponentWrapper>,
    );

describe('OpenOrders', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should render formatted price', () => {
        expect(renderComponent().container.querySelector('.cr-open-orders__price')).toBeInTheDocument();
    });
});
