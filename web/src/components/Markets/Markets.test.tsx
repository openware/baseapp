import { render } from '@testing-library/react';
import React from 'react';
import { spy } from 'sinon';
import { TestComponentWrapper } from 'src/lib/test';
import { Markets, MarketsProps } from '.';

const data = [
    ['ETH/BTC', '0.223100', '+50.00%'],
    ['ETH/LTC', '0.223100', '+25.00%'],
    ['LTC/BTC', '0.223100', '-5.00%'],
];
const onSelect = spy();

const defaultProps: MarketsProps = {
    data,
    onSelect,
};

const renderComponent = (props?: Partial<MarketsProps>) =>
    render(
        <TestComponentWrapper>
            <Markets {...{ ...defaultProps, ...props }} />
        </TestComponentWrapper>,
    );

describe('Markets', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should render empty data', () => {
        expect(renderComponent({ data: [] }).container).toMatchSnapshot();
    });

    it('should set selected market in props', () => {
        const keyIndex = 0;
        const selectedKey = 'ETH/LTC';

        const { container } = renderComponent({
            data,
            rowKeyIndex: keyIndex,
            selectedKey,
            onSelect,
        });

        const resultSelectedRow = '<td>ETH/LTC</td><td>0.223100</td><td><span class="__positive">+25.00%</span></td>';
        expect(resultSelectedRow).toBe(container.querySelector('.cr-table__row--selected').innerHTML);
    });
});
