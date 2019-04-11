import { GridItem, GridItemProps } from '@openware/components';
import classnames from 'classnames';
import * as React from 'react';

/* tslint:disable-next-line */
const { WidthProvider, Responsive } = require('react-grid-layout');

interface GridGeneralInterface {
  lg: number;
  md: number;
  sm: number;
  xs: number;
  xxs: number;
}

interface LayoutGridGeneralInterface {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
}

interface LayoutGrid {
  lg: LayoutGridGeneralInterface[];
  md: LayoutGridGeneralInterface[];
  sm: LayoutGridGeneralInterface[];
}

interface GridChildInterface {
  i: number;
  render: () => React.ReactNode | GridChildInterface;
  title?: string;
}

interface GridProps {
  /**
   * Property with breakpoints for Grid component
   */
  breakpoints: GridGeneralInterface;
  /**
   * Property for children nodes for Grid component. These nodes are GridItems
   */
  children: GridChildInterface[];
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
}

const ReactGridLayout = WidthProvider(Responsive);

/* tslint:disable jsx-no-multiline-js */
const generateChildren = (children: GridProps['children'], layouts: LayoutGrid) => {
  return (children || layouts.lg).map((child: GridChildInterface) => (
    <div key={child.i}>
      {child.title ? <GridItem title={child.title}>{child.render ? child.render() : `Child Body ${child.i}`}</GridItem>
      : <GridItem>{child.render ? child.render() : `Child Body ${child.i}`}</GridItem>}
    </div>
  ));
};

const Grid: React.FunctionComponent<GridProps> = props => {
  const {
    children,
    className,
    draggableHandle,
    rowHeight,
    breakpoints,
    cols,
    layouts,
    onLayoutChange,
    handleResize,
  } = props;
  const cx = classnames('cr-grid', className);
  const margin = 5;
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
          {generateChildren(children, layouts)}
        </ReactGridLayout>
      </div>
    </div>
  );
};

export {
  Grid,
  GridProps,
  GridChildInterface,
  GridGeneralInterface,
  LayoutGrid,
  LayoutGridGeneralInterface,
};
