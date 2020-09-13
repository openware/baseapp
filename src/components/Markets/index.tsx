import classnames from 'classnames';
import * as React from 'react';
import { CellData, FilterInput, Table } from '../';
import { DEFAULT_MARKET_HEADERS } from '../../constants';
import { isUniqueValue } from '../../helpers';

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
    const [searchKey, setSearchKey] = React.useState('');

    const searchFilter = React.useCallback((row: CellData[], key: string) => {
        setSearchKey(key);

        return (row[0] as string).toLowerCase().includes(searchKey.toLowerCase());
    }, [searchKey]);

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
        const typeIndex = (props.headers || DEFAULT_MARKET_HEADERS).indexOf(headerKey);

        return (item[typeIndex] as string).includes(key);
    };

    const createUniqueCurrencies = (currencies: string[], market: string) => {
        const marketCurrencies = market.split('/').map((c: string) => c.trim());
        const uniqueCurrencies = marketCurrencies.filter(c => isUniqueValue(currencies, c));

        return currencies.concat(uniqueCurrencies);
    };

    const transformCurrencyToFilter = (currency: string) => ({
        name: currency,
        filter: filterType('Pair', currency),
    });

    const getFilters = () => {
        const { data, filters } = props;

        const currencyFilters = data && data.length > 0
            ? data
                .map((market: React.ReactNode[]) => market[0] as string)
                .reduce(createUniqueCurrencies, [])
                .map(transformCurrencyToFilter)
            : [];

        return filters ? [
            {
                name: 'All',
                filter: filterType('Pair', ''),
            },
            ...currencyFilters,
        ] : [];
    };

    const getTableData = () => {
        const fd = props.data.filter(w => (w[0] as string).toLowerCase().includes(searchKey.toLowerCase()));

        return fd.map(row => row.map(mapRows));
    };

    const { headers, title, filterPlaceholder = '', rowKeyIndex, selectedKey } = props;

    return (
        <div className="cr-markets">
            <Table
                data={getTableData()}
                rowKeyIndex={rowKeyIndex}
                selectedKey={selectedKey}
                filters={getFilters()}
                header={headers || DEFAULT_MARKET_HEADERS}
                onSelect={props.onSelect}
                titleComponent={title || 'Markets'}
            />
            <FilterInput
                data={props.data}
                filter={searchFilter}
                placeholder={filterPlaceholder}
            />
        </div>
    );
};
