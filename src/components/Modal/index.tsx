import classnames from 'classnames';
import * as React from 'react';

export interface ModalProps {
    /**
     * Property for
     */
    show: boolean;
    /**
     * Modal header
     */
    header: React.ReactNode;
    /**
     * Content that will be displayed in modal body
     */
    content: React.ReactNode;
    /**
     * Modal footer
     */
    footer: React.ReactNode;
    /**
     * Additional classname
     */
    className?: string;
}

export const Modal: React.FunctionComponent<ModalProps> = (props) => {
    const { className } = props;
    const cx = classnames('cr-modal', className);

    if (!props.show) {
        return null;
    }

    return (
        <div className={cx}>
            <div className="cr-modal__container">
                <div className="cr-modal__container-header">{props.header}</div>
                <div className="cr-modal__container-content">{props.content}</div>
                <div className="cr-modal__container-footer">{props.footer}</div>
            </div>
        </div>
    );
};
