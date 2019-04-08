import { CellData } from '@openware/components';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { History, HistoryProps } from '.';

const data: CellData[][] = [
    ['10:40', 'Market', 'BTC/USDT', 'Buy', '9.400,0', '0, 4005', '3.459'],
    ['10:40', 'Market', 'BTC/USDT', 'Buy', '9.400,0', '0, 4005', '3.459'],
    ['10:40', 'Market', 'BTC/USDT', 'Buy', '9.400,0', '0, 4005', '3.459'],
];

const defaultProps: HistoryProps = {
    data,
};

const setup = (props: Partial<HistoryProps> = {}) =>
    shallow(<History {...{ ...defaultProps, ...props }} />);

describe('History', () => {
    let wrapper: ShallowWrapper<History>;

    beforeEach(() => {
       wrapper = setup();
    });

    it('should render', () => {
        expect(wrapper).toMatchSnapshot();
    });

    it('should render custom action cell', () => {
        const renderedBuyAction = (
            <span className="cr-history-action cr-history-action--buy">bid</span>
        );

        const renderedSellAction = (
            <span className="cr-history-action cr-history-action--sell">ask</span>
        );

        const instance = wrapper.instance() as History;

        expect(instance.renderAction('bid')).toEqual(renderedBuyAction);
        expect(instance.renderAction('ask')).toEqual(renderedSellAction);
    });
});
