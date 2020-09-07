import classnames from 'classnames';
import * as React from 'react';
import { CellData, FilterInput, Table } from '../';

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

export const Markets = (props: MarketsProps) => {
    const [filteredData, setFilteredData] = React.useState<CellData[][]>([]);
    const [searchKey, setSearchKey] = React.useState('');

    const defaultHeaders: string[] = React.useMemo(() => ['Pair', 'Price', '24h Change'], []);

    const searchFilter = React.useCallback((row: CellData[], key: string) => {
        setSearchKey(key);

        return (row[0] as string).toLowerCase().includes(searchKey.toLowerCase());
    }, [searchKey]);

    const handleFilter = (result: object[]) => {
        setFilteredData([...result] as CellData[][]);
    };

    const renderChange = React.useCallback((cell: string) => {
        const isItChangeValue = (c: string) => {
            return c.search('\\+') ? 'negative' : 'positive';
        };

        const className = classnames('', {
            __positive: isItChangeValue(cell) === 'positive',
            __negative: isItChangeValue(cell) === 'negative',
        });

        return <span className={className}>{cell}</span>;
    }, []);

    const mapRows = React.useCallback((cell: CellData) => {
        const isChangeValue = typeof(cell) === 'string' && (cell.charAt(0) === '-' || cell.charAt(0) === '+');

        return isChangeValue ? renderChange(cell as string) : cell;
    }, [renderChange]);

    const filterType = (headerKey: string, key: string) => (item: CellData[]) => {
        const typeIndex = props.headers ? props.headers.indexOf(headerKey) : defaultHeaders.indexOf(headerKey);

        return (item[typeIndex] as string).includes(key);
    };

    const createUniqueCurrencies = (currencies: string[], market: string) => {
        const isCurrencyUnique = (currency: string) => !currencies.includes(currency);

        const marketCurrencies = market.split('/').map((c: string) => c.trim());
        const uniqueCurrencies = marketCurrencies.filter(isCurrencyUnique);

        return currencies.concat(uniqueCurrencies);
    };

    const transformCurrencyToFilter = (currency: string) => ({
        name: currency,
        filter: filterType('Pair', currency),
    });

    const filtersFn = () => {
        const { data } = props;

        const currencyFilters = data && data.length > 0
            ? data
                .map(getMarketFromDataRow)
                .reduce(createUniqueCurrencies, [])
                .map(transformCurrencyToFilter)
            : [];

        return [
            {
                name: 'All',
                filter: filterType('Pair', ''),
            },
            ...currencyFilters,
        ];
    };

    const getMarketFromDataRow = (market: React.ReactNode[]) => market[0] as string;

    const { filters = true, headers, title, filterPlaceholder = '', rowKeyIndex, selectedKey } = props;

    let tableData = filteredData.length > 0
        ? filteredData
        : [['', '', '']];

    tableData = tableData.map(row => row.map(mapRows));

    // TODO: Refactor this logic
    React.useEffect(() => {
        setFilteredData(props.data.filter(w => (w[0] as string).toLowerCase().includes(searchKey.toLowerCase())));
    }, [props.data, searchKey]);

    return (
        <div className="cr-markets">
            <Table
                data={tableData}
                rowKeyIndex={rowKeyIndex}
                selectedKey={selectedKey}
                filters={filters ? filtersFn() : []}
                header={headers || defaultHeaders}
                onSelect={props.onSelect}
                titleComponent={title || 'Markets'}
            />
            <FilterInput
                data={props.data}
                onFilter={handleFilter}
                filter={searchFilter}
                placeholder={filterPlaceholder}
            />
        </div>
    );
};
