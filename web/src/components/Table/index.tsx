import classNames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';

export type CellData = string | number | React.ReactNode | undefined;

export interface Filter {
    name: string;
    filter: (cell: CellData[]) => boolean;
}

export interface TableState {
    /**
     * Selected filter
     */
    activeFilter?: string;
    /**
     * Filtered data
     */
    resultData?: CellData[][];
    /**
     * Key of selected row
     */
    selectedRowKey?: string;
}

export interface TableProps {
    /**
     * Data which is used to render Table. The first element
     * of array is used to render table head unless `noHead`
     * is true. the rest is used to render Table body.
     *
     * All the elements of an array should have the same length.
     */
    data: CellData[][];
    /**
     * Renders table head.
     */
    header?: React.ReactNode[];
    /**
     *  Pair name & filter is used to filter table data depending on a filter
     */
    filters?: Filter[];
    /**
     * Row's unique key, could be a number - element's index in data
     */
    rowKeyIndex?: number;
    /**
     * Key of selected row, could be a string
     */
    selectedKey?: string;
    /**
     * Callback called when a row is selected
     */
    onSelect?: (key: string) => void;
    /**
     * Header which is displayed above the table
     */
    titleComponent?: React.ReactNode;
    /**
     * Defines whether row background shows or not, and calculates width of it
     */
    rowBackground?: (row: number) => React.CSSProperties;
    /**
     * Defines from what side row background starts `(left, right)`
     * @default 'left'
     */
    side?: 'left' | 'right';
    /**
     * Sets row background color
     */
    rowBackgroundColor?: string;
    /**
     * Sets colspan count for empty table
     */
    colSpan?: number;
}

/**
 * Cryptobase Table overrides default table
 */
export const Table: React.FC<TableProps> = (props: TableProps) => {
    const { formatMessage } = useIntl();
    const [activeFilter, setActiveFilter] = React.useState<TableState['activeFilter']>(undefined);
    const [resultData, setResultData] = React.useState<TableState['resultData']>(undefined);
    const [selectedRowKey, setSelectedRowKey] = React.useState<TableState['selectedRowKey']>(props.selectedKey);

    const {
        data,
        header,
        titleComponent,
        filters = [],
        rowKeyIndex,
        onSelect,
        rowBackground,
        side,
        rowBackgroundColor = 'rgba(184, 233, 245, 0.7)',
    } = props;

    const cn = React.useMemo(() => classNames('cr-table-header__content', {
        'cr-table-header__content-empty': !titleComponent && filters.length === 0,
    }), [titleComponent, filters.length]);

    const renderRowCells = React.useCallback((row: CellData[]) => {
        return row && row.length ?
            row.map((c, index: number) =>
                <td key={index} colSpan={row.length === 1 ? props.colSpan : undefined}>{c}</td>)
            : <td className="cr-table--no-data" colSpan={header && header.length}>{formatMessage({ id: 'page.noDataToShow' })}</td>;
    }, [header, props.colSpan, formatMessage]);

    const handleFilter = React.useCallback((item: Filter) => {
        if (!item.filter) {
            setResultData(props.data);

            return;
        }
        setActiveFilter(item.name);
        setResultData([...data].filter(item.filter));
    }, [data, props.data]);

    const handleSelect = React.useCallback((key: string) => () => {
        if (onSelect) {
            setSelectedRowKey(key);

            if (onSelect) {
                onSelect(key);
            }
        }
    }, [onSelect]);

    const renderFilters = React.useCallback(() => {
        const getClassName = (filterName: string) => classNames('cr-table__filter', {
            'cr-table__filter--active': activeFilter === filterName,
        });

        return filters.map((item: Filter) => (
            <div
                className={getClassName(item.name)}
                key={item.name}
                onClick={() => handleFilter(item)}
            >
                {item.name}
            </div>
        ));
    }, [activeFilter, filters, handleFilter]);

    const renderHead = React.useCallback((row: CellData[]) => {
        const cells = row.map((c, index) => c ?  <th key={index}>{c}</th> : <th key={index}>&nbsp;</th>);
        return (
            <thead className={'cr-table__head'}>
            <tr className={'cr-table__head-row'}>{cells}</tr>
            </thead>
        );
    }, []);

    const renderRowBackground = React.useCallback((i: number) => {
        const rowBackgroundResult = rowBackground ? rowBackground(i) : {};
        const style = {
            ...rowBackgroundResult,
            backgroundColor: rowBackgroundColor,
        };

        return (rowBackground
            ? <span key={i} style={style} className="cr-table-background__row" />
            : null);
    }, [rowBackground, rowBackgroundColor]);

    const renderBackground = React.useCallback((rows: CellData[][]) => {
        const dataToBeMapped = resultData || rows;
        const renderBackgroundRow = (r: CellData[], i: number) => renderRowBackground(i);

        const className = classNames('cr-table-background', {
            'cr-table-background--left': side === 'left',
            'cr-table-background--right': side === 'right',
        });

        return (
            <div className={className}>
                {rowBackground && dataToBeMapped.map(renderBackgroundRow)}
            </div>
        );
    }, [resultData, side, renderRowBackground, rowBackground]);

    const renderBody = React.useCallback((rows: CellData[][], rowKeyIndexValue: number | undefined) => {
        const rowClassName = (key: string) => classNames({
            'cr-table__row--selected': selectedRowKey === key,
        });

        const dataToBeMapped = resultData || rows;
        const rowElements = dataToBeMapped.map((r, i) => {
            const rowKey = String((rowKeyIndexValue !== undefined) ? r[rowKeyIndexValue] : i);

            return (
                <tr
                    className={rowClassName(rowKey)}
                    key={rowKey}
                    onClick={handleSelect(rowKey)}
                >
                    {renderRowCells(r)}
                </tr>
            );
        });

        return (
            <tbody className={'cr-table__body'}>
            {rowElements}
            </tbody>
        );
    }, [handleSelect, renderRowCells, resultData, selectedRowKey]);

    React.useEffect(() => {
        if (props.filters) {
            const newActiveFilter = props.filters.find(
                filter => filter.name === activeFilter,
            );

            if (newActiveFilter) {
                handleFilter(newActiveFilter);
            }
        }
    });

    React.useEffect(() => {
        setSelectedRowKey(props.selectedKey);
    }, [props.selectedKey]);


    return (
        <div className="cr-table-container">
            <div className={cn}>
                {titleComponent ? <div className={'cr-title-component'}>{props.titleComponent}</div> : null}
                {filters.length
                    ?
                    <div className="cr-table__filters">{renderFilters()}</div>
                    : null}
            </div>
            <table className={'cr-table'}>
                {header && header.length && renderHead(header)}
                {renderBody(data, rowKeyIndex)}
            </table>
            {renderBackground(data)}
        </div>
    );
};
