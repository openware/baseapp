import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { Table, TableProps } from '.';

const renderComponent = (props: TableProps) =>
    render(
        <TestComponentWrapper>
            <Table {...props} />
        </TestComponentWrapper>,
    );

describe('Table render', () => {
    const header = ['Price', 'Type', 'Volume'];
    const data = [
        ['0', 'Sell', '0.1'],
        ['0', 'Buy', '0.1'],
        ['0', 'Buy', '0.1'],
        ['0', 'Sell', '0.1'],
        ['0', 'Buy', '0.1'],
        ['0', 'Sell', '0.1'],
    ];

    it('Snapshot', () => {
        expect(renderComponent({ header, data }).container).toMatchSnapshot();
    });

    it('always renders a table', () => {
        renderComponent({ header, data });
        expect(screen.getByRole('table')).toBeInTheDocument();
        expect(screen.getAllByRole('rowgroup')).toHaveLength(2); // thead and tbody
    });

    it('should set selected row in props', () => {
        const headerForSelect = ['Key', 'Price', 'Type', 'Volume'];
        const dataForSelect = [
            ['1', '0', 'Sell', '0.1'],
            ['2', '0', 'Buy', '0.1'],
            ['3', '0', 'Buy', '0.1'],
            ['4', '0', 'Sell', '0.1'],
            ['5', '0', 'Buy', '0.1'],
            ['6', '0', 'Sell', '0.1'],
        ];
        const keyIndex = 0;
        const selectedKey = '4';
        const { container } = renderComponent({
            data: dataForSelect,
            header: headerForSelect,
            rowKeyIndex: keyIndex,
            selectedKey: selectedKey,
        });
        const expected = `${selectedKey}`;
        const result = container.querySelector('.cr-table__row--selected').firstElementChild.innerHTML;
        expect(expected).toBe(result);
    });

    it('uses table styles by default', () => {
        renderComponent({ data });
        expect(screen.getByRole('table')).toHaveClass('cr-table');
    });

    it('render thead styles by default', () => {
        renderComponent({ header, data });
        expect(screen.getAllByRole('rowgroup')[0]).toHaveClass('cr-table__head');
    });

    it('render tbody styles by default', () => {
        renderComponent({ header, data });
        expect(screen.getAllByRole('rowgroup')[1]).toHaveClass('cr-table__body');
    });

    it('should render thead from header props array', () => {
        renderComponent({ header, data });
        expect(screen.getAllByRole('columnheader')).toHaveLength(data[0].length);
    });

    it('Check invalid data', () => {
        const fakeData = [
            ['Price', 'Time', 'Volume'],
            ['0', '12:20', '12', 'fake'],
        ];
        expect(renderComponent({ data: fakeData }).container).toMatchSnapshot('invalid data');
    });

    it('should render the same length of background rows as data', () => {
        const fullWidth = 100;
        const rowBackground: (row: number) => React.CSSProperties = (i: number) => ({
            width: `${i * fullWidth}%`,
        });
        renderComponent({ data, rowBackground });

        expect(screen.getAllByRole('row')).toHaveLength(data.length);
    });
});
