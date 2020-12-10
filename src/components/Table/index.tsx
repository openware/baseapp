import classNames from 'classnames';
import * as React from 'react';

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

interface TableProps {
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
class Table extends React.Component<TableProps, TableState> {
    constructor(props: TableProps) {
        super(props);

        this.state = {
            activeFilter: undefined,
            resultData: undefined,
            selectedRowKey: props.selectedKey,
        };
    }

    public componentDidMount() {
        const { filters } = this.props;
        if (filters && filters.length > 0) {
            this.handleFilter(filters[0]);
        }
    }

    public componentWillReceiveProps(next: TableProps) {
        if (this.state.selectedRowKey !== next.selectedKey) {
            this.setState({selectedRowKey: next.selectedKey});
        }
    }

    public componentDidUpdate(prevProps: TableProps) {
        if (prevProps.data !== this.props.data && this.props.filters) {
            const activeFilter = this.props.filters.find(
                filter => filter.name === this.state.activeFilter,
            );

            if (activeFilter) {
                this.handleFilter(activeFilter);
            }
        }
    }

    public render() {
        const { data, header, titleComponent, filters = [], rowKeyIndex } = this.props;

        this.ensureDataIsValid(data);

        const cn = classNames('cr-table-header__content', {
            'cr-table-header__content-empty': !titleComponent && filters.length === 0,
        });

        return (
            <div className="cr-table-container">
                <div className={cn}>
                    {titleComponent ? this.renderTitleComponent() : null}
                    {filters.length
                        ?
                        <div className="cr-table__filters">{this.renderFilters()}</div>
                        : null}
                </div>
                <table className={'cr-table'}>
                    {header && header.length && this.renderHead(header)}
                    {this.renderBody(data, rowKeyIndex)}
                </table>
                {this.renderBackground(data)}
            </div>
        );
    }

    private renderTitleComponent() {
        const { titleComponent } = this.props;

        return <div className={'cr-title-component'}>{titleComponent}</div>;
    }

    private renderRowCells(row: CellData[]) {

        return row && row.length ?
            row.map((c, index: number) =>
                <td key={index} colSpan={row.length === 1 ? this.props.colSpan : undefined}>{c}</td>) : [];
    }

    private handleFilter(item: Filter) {
        const { data } = this.props;

        if (!item.filter) {
            this.setState({
                resultData: data,
            });

            return;
        }
        const resultData: CellData[][] = [...data].filter(item.filter);
        this.setState({
            activeFilter: item.name,
            resultData: resultData,
        });
    }

    private handleSelect = (key: string) => () => {
        const { onSelect } = this.props;

        if (onSelect) {
            this.setState({
                selectedRowKey: key,
            }, () => {
                if (onSelect) {
                    onSelect(key);
                }
            });
        }
    };

    private renderFilters() {
        const { filters = [] } = this.props;
        const { activeFilter } = this.state;

        const cn = (filterName: string) => classNames('cr-table__filter', {
            'cr-table__filter--active': activeFilter === filterName,
        });

        return filters.map((item: Filter) => {
            const handleFilterClick = () => {
                this.handleFilter(item);
            };

            return (
                <div
                    className={cn(item.name)}
                    key={item.name}
                    onClick={handleFilterClick}
                >
                    {item.name}
                </div>
            );
        });
    }

    private renderHead(row: CellData[]) {
        const cells = row.map((c, index) => c ?  <th key={index}>{c}</th> : <th key={index}>&nbsp;</th>);

        return (
            <thead className={'cr-table__head'}>
                <tr className={'cr-table__head-row'}>{cells}</tr>
            </thead>
        );
    }

    private renderRowBackground(i: number) {
        const { rowBackground, rowBackgroundColor = 'rgba(184, 233, 245, 0.7)' } = this.props;
        const rowBackgroundResult = rowBackground ? rowBackground(i) : {};
        const style = {
            ...rowBackgroundResult,
            backgroundColor: rowBackgroundColor,
        };

        return (rowBackground
            ? <span key={i} style={style} className="cr-table-background__row" />
            : null);
    }

    private renderBackground(rows: CellData[][]) {
        const { resultData } = this.state;
        const { rowBackground, side } = this.props;
        const dataToBeMapped = resultData || rows;
        const renderBackgroundRow = (r: CellData[], i: number) => this.renderRowBackground(i);

        const className = classNames('cr-table-background', {
            'cr-table-background--left': side === 'left',
            'cr-table-background--right': side === 'right',
        });

        return (
            <div className={className}>
                {rowBackground && dataToBeMapped.map(renderBackgroundRow)}
            </div>
        );
    }

    private renderBody(rows: CellData[][], rowKeyIndex: number | undefined) {
        const { resultData, selectedRowKey } = this.state;

        const rowClassName = (key: string) => classNames({
            'cr-table__row--selected': selectedRowKey === key,
        });

        const dataToBeMapped = resultData || rows;
        const rowElements = dataToBeMapped.map((r, i) => {
            const rowKey = String((rowKeyIndex !== undefined) ? r[rowKeyIndex] : i);

            return (
                <tr
                    className={rowClassName(rowKey)}
                    key={rowKey}
                    onClick={this.handleSelect(rowKey)}
                >
                    {this.renderRowCells(r)}
                </tr>
            );
        });

        return (
            <tbody className={'cr-table__body'}>
            {rowElements}
            </tbody>
        );
    }

    private ensureDataIsValid(data: CellData[][]) {
        const length = data[0].length;
        const len = data.length;
        for (let i = 0; i < len; i += 1) {
            if (data[i].length !== length) {
                throw Error('Array elements must have the same length');
            }
        }
    }
}

export {
    Table,
};
