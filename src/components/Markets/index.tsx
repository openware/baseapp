import classnames from 'classnames';
import * as React from 'react';
import { CellData, Table, FilterInput } from '../';

export interface MarketsProps {
    /**
     * List of markets data
     */
    data: CellData[][];
    /**
     * Row's unique key, could be a number - element's index in data
     */
    rowKeyIndex?: number;
    /**
     * Key of selected row, could be a string
     */
    selectedKey?: string;
    /**
     * Callback that is called when a market is selected
     */
    onSelect: (marketKey: string) => void;
    /**
     * Defines whether to show filters or not
     * @default true
     */
    filters?: boolean;
    /**
     * List of headers for table
     */
    headers?: string[];
    /**
     * Title of widget
     */
    title?: string;
    /**
     * Value for FilterInput placeholder
     */
    filterPlaceholder?: string;
}

export interface MarketsState {
    /**
     * Keeps filtered data
     */
    filteredData: CellData[][];
    /**
     * Keeps search key
     */
    searchKey: string;
}

export class Markets extends React.Component<MarketsProps, MarketsState> {
    constructor(props: MarketsProps) {
        super(props);

        this.state = {
            filteredData: props.data,
            searchKey: '',
        };
    }

    private defaultHeaders: string[] = ['Pair', 'Price', '24h Change'];

    public componentWillReceiveProps(nextProps: MarketsProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                filteredData: nextProps.data.filter(w => (w[0] as string).toLowerCase().includes(this.state.searchKey.toLowerCase())),
            });
        }
    }

    public render() {
        const { filteredData } = this.state;
        const { filters = true, headers, title, filterPlaceholder = '', rowKeyIndex, selectedKey } = this.props;
        let tableData = filteredData.length > 0
            ? filteredData
            : [['', '', '']];
        tableData = tableData.map(row => row.map(this.mapRows));
        return (
            <div className="cr-markets">
                <Table
                    data={tableData}
                    rowKeyIndex={rowKeyIndex}
                    selectedKey={selectedKey}
                    filters={filters ? this.filters : []}
                    header={headers ? headers : this.defaultHeaders}
                    onSelect={this.props.onSelect}
                    titleComponent={title ? title : 'Markets'}
                />
                <FilterInput
                    data={this.props.data}
                    onFilter={this.handleFilter}
                    filter={this.searchFilter}
                    placeholder={filterPlaceholder}
                />
            </div>
        );
    }

    public searchFilter = (row: CellData[], searchKey: string) => {
        this.setState({
            searchKey: searchKey,
        });
        return (row[0] as string).toLowerCase().includes(searchKey.toLowerCase());
    }

    public handleFilter = (result: object[]) => {
        this.setState({
            filteredData: [...result] as CellData[][],
        });
    }

    private renderChange(cell: string) {
        const isItChangeValue = (c: string) => {
            return c.search('\\+') ? 'negative' : 'positive';
        };

        const className = classnames('', {
            __positive: isItChangeValue(cell) === 'positive',
            __negative: isItChangeValue(cell) === 'negative',
        });

        return <span className={className}>{cell}</span>;
    }

    private mapRows = (cell: CellData) => {
        const isChangeValue = typeof(cell) === 'string' && (cell.charAt(0) === '-' || cell.charAt(0) === '+');
        return isChangeValue ? this.renderChange(cell as string) : cell;
    }

    private filterType = (headerKey: string, searchKey: string) => (item: CellData[]) => {
        const typeIndex = this.props.headers ? this.props.headers.indexOf(headerKey) : this.defaultHeaders.indexOf(headerKey);
        return (item[typeIndex] as string).includes(searchKey);
    };

    private get filters() {
        const { data } = this.props;

        const currencyFilters = data && data.length > 0
            ? this.props.data
                .map(this.getMarketFromDataRow)
                .reduce(this.createUniqueCurrencies, [])
                .map(this.transformCurrencyToFilter)
            : [];
        return [
            {
                name: 'All',
                filter: this.filterType('Pair', ''),
            },
            ...currencyFilters,
        ];
    }

    private getMarketFromDataRow = (market: React.ReactNode[]) => market[0] as string;

    private createUniqueCurrencies(currencies: string[], market: string) {
        const isCurrencyUnique = (currency: string) => !currencies.includes(currency);

        const marketCurrencies = market.split('/').map((c: string) => c.trim());
        const uniqueCurrencies = marketCurrencies.filter(isCurrencyUnique);

        return currencies.concat(uniqueCurrencies);
    }

    private transformCurrencyToFilter = (currency: string) => ({
        name: currency,
        filter: this.filterType('Pair', currency),
    });
}
