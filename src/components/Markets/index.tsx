import classnames from 'classnames';
import * as React from 'react';

import { DEFAULT_MARKET_HEADERS } from '../../constants';
import { hasDuplicates } from '../../helpers';
import { FilterInput } from '../FilterInput';
import { CellData, Table } from '../Table';

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

    const { headers, title, filterPlaceholder = '', rowKeyIndex, selectedKey, data, filters } = props;

    const searchFilter = React.useCallback(
        (row: CellData[], key: string) => {
            setSearchKey(key);

            return (row[0] as string).toLowerCase().includes(searchKey.toLowerCase());
        },
        [searchKey]
    );

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

    const mapRows = React.useCallback(
        (cell: CellData) => {
            const isChangeValue = typeof cell === 'string' && (cell.charAt(0) === '-' || cell.charAt(0) === '+');

            return isChangeValue ? renderChange(cell as string) : cell;
        },
        [renderChange]
    );

    const filterType = React.useCallback(
        (headerKey: string, key: string) => (item: CellData[]) => {
            const typeIndex = (props.headers || DEFAULT_MARKET_HEADERS).indexOf(headerKey);

            return (item[typeIndex] as string).includes(key);
        },
        [props.headers]
    );

    const createUniqueCurrencies = React.useCallback((currencies: string[], market: string) => {
        const marketCurrencies = market.split('/').map((c: string) => c.trim());
        const uniqueCurrencies = marketCurrencies.filter((c) => !hasDuplicates(currencies, c));

        return currencies.concat(uniqueCurrencies);
    }, []);

    const transformCurrencyToFilter = React.useCallback(
        (currency: string) => ({
            name: currency,
            filter: filterType('Pair', currency),
        }),
        [filterType]
    );

    const getFilters = React.useCallback(() => {
        const currencyFilters =
            data && data.length > 0
                ? data
                      .map((market: React.ReactNode[]) => market[0] as string)
                      .reduce(createUniqueCurrencies, [])
                      .map(transformCurrencyToFilter)
                : [];

        return filters
            ? [
                  {
                      name: 'All',
                      filter: filterType('Pair', ''),
                  },
                  ...currencyFilters,
              ]
            : [];
    }, [createUniqueCurrencies, filterType, transformCurrencyToFilter, data, filters]);

    const getTableData = React.useCallback(() => {
        const fd = data.filter((w) => (w[0] as string).toLowerCase().includes(searchKey.toLowerCase()));

        return fd.map((row) => row.map(mapRows));
    }, [data, mapRows, searchKey]);

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
            <FilterInput data={props.data} filter={searchFilter} placeholder={filterPlaceholder} />
        </div>
    );
};
