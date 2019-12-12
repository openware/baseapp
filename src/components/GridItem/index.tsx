import classnames from 'classnames';
import * as React from 'react';
import { GridChildInterface } from '../';

export interface GridItemProps {
  /*
  * Children node for GridItem component
  */
  children: React.ReactNode | GridChildInterface;
  /**
   * Additional class name. By default element receives `cr-grid-item` class
   * @default empty
   */
  className?: string;
  /*
  * Children node for GridItem component
  */
  title?: string;
}

const GridItem: React.FunctionComponent<GridItemProps> = (props: GridItemProps) => {
  const { className, children, title } = props;
  const cx = classnames('cr-grid-item', className);
  return (
    <div className={cx}>
      {title ? <div className="cr-grid-item__header">
        <div className="cr-grid-item__title">
          {title}
        </div>
      </div>
      : null}
      <div className="cr-grid-item__body">{children}</div>
    </div>
  );
};

export {
  GridItem,
};
