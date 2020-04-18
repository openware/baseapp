import classnames from 'classnames';
import * as React from 'react';
import { GridItem, GridItemProps } from '../';
import { MarketDepthsComponent } from '../../containers/MarketDepth';
import { MarketsComponent } from '../../containers/Markets';
import { OpenOrdersComponent } from '../../containers/OpenOrders';
import { OrderComponent } from '../../containers/Order';
import { OrderBook } from '../../containers/OrderBook';
import { RecentTrades } from '../../containers/RecentTrades';
import { TradingChart } from '../../containers/TradingChart';

/* tslint:disable-next-line */
const { WidthProvider, Responsive } = require('react-grid-layout');

export interface GridGeneralInterface {
    lg: number;
    md: number;
    sm: number;
    xs: number;
    xxs: number;
}

export interface LayoutGridGeneralInterface {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
}

export interface LayoutGrid {
    lg: LayoutGridGeneralInterface[];
    md: LayoutGridGeneralInterface[];
    sm: LayoutGridGeneralInterface[];
}

export interface GridChildInterface {
    i: number;
    render: () => React.ReactNode | GridChildInterface;
    title?: string;
}

export interface GridProps {
    /**
     * Property with breakpoints for Grid component
     */
    breakpoints: GridGeneralInterface;
    /**
     * Additional class name. By default element receives `cr-grid` class
     * @default empty
     */
    className?: string;
    /**
     * Property with cols for Grid component
     */
    cols: GridGeneralInterface;
    /**
     * Array of layouts of objects for Grid component
     */
    layouts: LayoutGrid;
    /**
     * Function for getting event of changing layout
     */
    onLayoutChange: (layout, layouts) => void;
    /**
     * Value for rowHeight for Grid Component
     */
    rowHeight: number;
    /**
     * A CSS selector for elements that will act as the draggable handle
     */
    draggableHandle?: string;
    handleResize?: (
        layout: LayoutGrid,
        oldItem: React.FunctionComponent<GridItemProps>,
        newItem: React.FunctionComponent<GridItemProps>,
        placeholder: React.FunctionComponent<GridItemProps>,
        e: React.MouseEvent,
        element: HTMLElement,
    ) => void;
    orderComponentResized: number;
    orderBookComponentResized: number;
}

const ReactGridLayout = WidthProvider(Responsive);

export const Grid: React.FunctionComponent<GridProps> = props => {
    const {
        className,
        draggableHandle,
        rowHeight,
        breakpoints,
        cols,
        layouts,
        onLayoutChange,
        orderComponentResized,
        orderBookComponentResized,
        handleResize,
    } = props;
    const cx = classnames('cr-grid', className);
    const margin = 5;
    const children = React.useMemo(() => {
        const data = [
            {
                i: 1,
                render: () => <OrderComponent size={orderComponentResized} />,
            },
            {
                i: 2,
                render: () => <TradingChart />,
            },
            {
                i: 3,
                render: () => <OrderBook size={orderBookComponentResized} />,
            },
            {
                i: 4,
                render: () => <MarketDepthsComponent />,
            },
            {
                i: 5,
                render: () => <OpenOrdersComponent/>,
            },
            {
                i: 6,
                render: () => <RecentTrades/>,
            },
            {
                i: 7,
                render: () => <MarketsComponent/>,
            },
        ];

        // @ts-ignore
        return data.map((child: GridChildInterface) => (
            <div key={child.i}>
                {child.title ? <GridItem title={child.title}>{child.render ? child.render() : `Child Body ${child.i}`}</GridItem>
                    : <GridItem>{child.render ? child.render() : `Child Body ${child.i}`}</GridItem>}
            </div>
        ));
    }, [orderComponentResized, orderBookComponentResized]);

    return (
        <div data-react-toolbox="grid" className={cx}>
            <div className="cr-grid__grid-wrapper">
                <ReactGridLayout
                  breakpoints={breakpoints}
                  cols={cols}
                  draggableHandle={draggableHandle}
                  rowHeight={rowHeight}
                  layouts={layouts}
                  onLayoutChange={onLayoutChange}
                  margin={[margin, margin]}
                  onResize={handleResize}
                >
                    {children}
                </ReactGridLayout>
            </div>
        </div>
    );
};
