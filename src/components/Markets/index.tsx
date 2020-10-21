import classnames from 'classnames';
import React, { ReactNode, useCallback} from 'react';
import { CellData, FilterInput, Table } from '../';
import { DEFAULT_MARKET_HEADERS } from '../../constants';
import { hasDuplicates } from '../../helpers';

interface Props {
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

function isItChangeValue(c: string): string  {
    return c.search('\\+') ? 'negative' : 'positive';
}

export const Markets: React.FC<Props> = ({ headers, title, onSelect, filterPlaceholder = '', rowKeyIndex, selectedKey, data, filters }) => {
    const [searchKey, setSearchKey] = React.useState('');

    const searchFilter = useCallback((row: CellData[], key: string) => {
        setSearchKey(key);

        return (row[0] as string).toLowerCase().includes(searchKey.toLowerCase());
    }, [searchKey]);

    const renderChange = useCallback((cell: string) => {
        return <span className={classnames({
            __positive: isItChangeValue(cell) === 'positive',
            __negative: isItChangeValue(cell) === 'negative',
        })}>{cell}</span>;
    }, []);

    const mapRows = useCallback((cell: CellData) => {
        const isChangeValue = typeof(cell) === 'string' && (cell.charAt(0) === '-' || cell.charAt(0) === '+');

        return isChangeValue ? renderChange(cell as string) : cell;
    }, [renderChange]);

    const filterType = useCallback((headerKey: string, key: string) => (item: CellData[]) => {
        const typeIndex = (headers || DEFAULT_MARKET_HEADERS).indexOf(headerKey);

        return (item[typeIndex] as string).includes(key);
    }, [headers]);

    const createUniqueCurrencies = useCallback((currencies: string[], market: string) => {
        const marketCurrencies = market.split('/').map((c: string) => c.trim());
        const uniqueCurrencies = marketCurrencies.filter(c => !hasDuplicates(currencies, c));

        return currencies.concat(uniqueCurrencies);
    }, []);

    const transformCurrencyToFilter = useCallback((currency: string) => ({
        name: currency,
        filter: filterType('Pair', currency),
    }), [filterType]);

    const getFilters = useCallback(() => {
        const currencyFilters = data && data.length > 0
            ? data
                .map((market: ReactNode[]) => market[0] as string)
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
    }, [createUniqueCurrencies, filterType, transformCurrencyToFilter, data, filters]);

    const getTableData = useCallback(() => {
        const fd = data.filter(w => (w[0] as string).toLowerCase().includes(searchKey.toLowerCase()));

        return fd.map(row => row.map(mapRows));
    }, [data, mapRows, searchKey]);

    return (
        <div className="cr-markets">
            <Table
                data={getTableData()}
                rowKeyIndex={rowKeyIndex}
                selectedKey={selectedKey}
                filters={getFilters()}
                header={headers || DEFAULT_MARKET_HEADERS}
                onSelect={onSelect}
                titleComponent={title || 'Markets'}
            />
            <FilterInput
                data={data}
                filter={searchFilter}
                placeholder={filterPlaceholder}
            />
        </div>
    );
};
