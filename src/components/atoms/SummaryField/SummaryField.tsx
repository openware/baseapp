import classnames from 'classnames';
import * as React from 'react';

interface SummaryFieldProps {
    /**
     * Additional class name for styling. By default element receives `cr-input` class
     * @default empty
     */
    className?: string;
    /**
     * The string to use as the label for the SummaryField.
     */
    message: string;
    /**
     * Border item for summary field. It can be 'rectangle', 'circle' or 'empty-circle'
     * @default 'rectangle'
     */
    borderItem?: string;
    /**
     * Content will be displayed instead of amount and currency, if it is necessary
     */
    content: JSX.Element;
}

/**
 * Component to display currency amount with specific label.
 */
const SummaryField: React.FunctionComponent<SummaryFieldProps> = props => {
    const {
      message,
      className,
      borderItem,
      content,
    } = props;
    const cx = classnames('cr-summary-field', {
      'cr-summary-field-border-item': borderItem,
    },
    className);
    const symbol = `cr-summary-field-border-item-${borderItem}`;
    return (
        <div className={cx}>
          <div className={symbol} />
          <span className="cr-summary-field-message">
            {message}
          </span>
          <span className="cr-summary-field-content">
            {content}
          </span>
        </div>
    );
};

export {
    SummaryField,
    SummaryFieldProps,
};
