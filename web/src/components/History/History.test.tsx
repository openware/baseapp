import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { History, HistoryProps } from '.';
import { CellData } from '../';

const data: CellData[][] = [
    ['10:40', 'Market', 'BTC/USDT', 'Buy', '9.400,0', '0, 4005', '3.459'],
    ['10:40', 'Market', 'BTC/USDT', 'Buy', '9.400,0', '0, 4005', '3.459'],
    ['10:40', 'Market', 'BTC/USDT', 'Buy', '9.400,0', '0, 4005', '3.459'],
];

const defaultProps: HistoryProps = {
    data,
};

const renderComponent = (props: Partial<HistoryProps> = {}) =>
    render(
        <TestComponentWrapper>
            <History {...{ ...defaultProps, ...props }} />
        </TestComponentWrapper>,
    );

describe('History', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
