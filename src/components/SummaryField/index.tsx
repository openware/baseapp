import classnames from 'classnames';
import * as React from 'react';

export interface SummaryFieldProps {
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
     * Content will be displayed instead of amount and currency, if it is necessary
     */
    content: JSX.Element;
}

/**
 * Component to display currency amount with specific label.
 */
export const SummaryFieldComponent: React.FunctionComponent<SummaryFieldProps> = props => {
    const { message, className, content } = props;
    const cx = classnames('cr-summary-field', className);

    return (
        <div className={cx}>
            <span className="cr-summary-field-message">
            {message}
          </span>
            <span className="cr-summary-field-content">
            {content}
          </span>
        </div>
    );
};

export const SummaryField = React.memo(SummaryFieldComponent);
