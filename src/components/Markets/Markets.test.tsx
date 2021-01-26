import { mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import * as React from 'react';
import { spy } from 'sinon';
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

const setup = (props?: Partial<MarketsProps>) =>
    shallow(
        <TestComponentWrapper>
            <Markets {...{ ...defaultProps, ...props }} />
        </TestComponentWrapper>
    );

describe('Markets', () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper.render()).toMatchSnapshot();
    });

    it('should render empty data', () => {
        wrapper = setup({ data: [] });
        expect(wrapper).toMatchSnapshot();
    });

    it('should set selected market in props', () => {
        const keyIndex = 0;
        const selectedKey = 'ETH/LTC';

        const component = setup({
            data,
            rowKeyIndex: keyIndex,
            selectedKey,
            onSelect,
        }).render();

        const resultSelectedRow = '<td>ETH/LTC</td><td>0.223100</td><td><span class="__positive">+25.00%</span></td>';
        const expectedSelectedRow = component.find('.cr-table__row--selected').first().html();
        console.log(expectedSelectedRow);
        expect(resultSelectedRow).toBe(expectedSelectedRow);
    });
});
