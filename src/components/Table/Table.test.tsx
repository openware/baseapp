import { mount, ReactWrapper, shallow } from 'enzyme';
import { TestComponentWrapper } from 'lib/test';
import * as React from 'react';
import { start } from 'repl';
import { spy } from 'sinon';
import { CellData, Filter, Table, TableProps, TableState } from '.';

const setup = (props: TableProps) =>
    shallow(
        <TestComponentWrapper>
            <Table {...props} />
        </TestComponentWrapper>
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
    const headerIndex = header.indexOf('Type');
    const filterMethod = (type: string) => (value: CellData[]) => value[headerIndex] === type;

    const filters: Filter[] = [
        {
            name: 'Bids',
            filter: filterMethod('Buy'),
        },
        {
            name: 'Asks',
            filter: filterMethod('Sell'),
        },
        {
            name: 'All',
            filter: () => true,
        },
    ];

    it('Snapshot', () => {
        const wrapper = setup({ header, data }).render();
        expect(wrapper).toMatchSnapshot();
    });

    it('always renders a table', () => {
        const wrapper = setup({ header, data }).render();
        const table = wrapper.find('table');
        const head = wrapper.find('thead');
        const body = wrapper.find('tbody');
        expect(table.length).toBe(1);
        expect(head.length).toBe(1);
        expect(body.length).toBe(1);
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
        const component = setup({
            data: dataForSelect,
            header: headerForSelect,
            rowKeyIndex: keyIndex,
            selectedKey: selectedKey,
        });
        let renderedComponent = component.render();
        const expected = `${selectedKey}`;
        const result = renderedComponent.find('.cr-table__row--selected').first().children().first().html();
        // expect((component.state() as TableState).selectedRowKey).toEqual(selectedKey);
        expect(expected).toBe(result);

        // const newSelectedKey = '2';
        // component.setProps({ selectedKey: newSelectedKey });
        // renderedComponent = component.render();
        // const nextExpected = `${newSelectedKey}`;
        // const nextResult = component.find('.cr-table__row--selected').first().children().first().html();
        // //expect(newSelectedKey).toEqual((component.state() as TableState).selectedRowKey);
        // expect(nextExpected).toBe(nextResult);
    });

    it('uses table styles by default', () => {
        const wrapper = setup({ data }).render();
        expect(wrapper.find('table.cr-table')).toBeDefined();
    });

    it('render thead styles by default', () => {
        const wrapper = setup({ header, data }).render();
        expect(wrapper.find('thead.cr-table__head')).toBeDefined();
    });

    it('render tbody styles by default', () => {
        const wrapper = setup({ data }).render();
        expect(wrapper.find('tbody.cr-table__body')).toBeDefined();
    });

    it('should render thead from header props array', () => {
        const wrapper = setup({ header, data }).render();
        const thElements = wrapper.find('thead').find('th');
        expect(thElements.length).toBe(data[0].length);
    });

    it('Check invalid data', () => {
        const fakeData = [
            ['Price', 'Time', 'Volume'],
            ['0', '12:20', '12', 'fake'],
        ];
        const wrapper = setup({ data: fakeData }).render();
        expect(wrapper).toMatchSnapshot('invalid data');
    });

    it.skip('should filter data due to passed filters', () => {
        const resultData = data.filter(filterMethod('Buy'));
        const component = setup({ filters, header, data });
        (component.state() as TableState).activeFilter = 'Buy';
        const tbElements = component.render().find('tbody').first().children();
        expect(tbElements.length).toBe(resultData.length);
    });

    it.skip('should filter data according to clicked filter', () => {
        const wrapper = mount(<Table filters={filters} header={header} data={data} />);
        const resultData = data.filter(filterMethod('Sell'));
        const filterButton = wrapper.find('.cr-table__filter').at(1);
        filterButton.simulate('click');

        const state: TableState = wrapper.state();
        const filteredStateLength = state.resultData ? state.resultData.length : 0;

        expect(filteredStateLength).toBe(resultData.length);
    });

    it.skip('should render selected row', () => {
        const onSelect = spy();
        const wrapper = setup({ filters, header, data, onSelect });

        wrapper.find('tbody tr').at(1).simulate('click');
        expect(onSelect.calledOnceWith(1));

        const selectedRow = wrapper.find('tbody tr').at(1);
        expect(selectedRow.hasClass('cr-table__row--selected')).toBeTruthy();
    });

    it('should render the same length of background rows as data', () => {
        const fullWidth = 100;
        const rowBackground: (row: number) => React.CSSProperties = (i: number) => ({
            width: `${i * fullWidth}%`,
        });
        const wrapper = setup({ data, rowBackground }).render();

        const backgroundRows = wrapper.find('.cr-table-background__row');
        expect(backgroundRows.length).toBe(data.length);
    });
});
