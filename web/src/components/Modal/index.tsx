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
    /**
     * full view modal
     */
    fullView?: boolean;
}

export const Modal: React.FunctionComponent<ModalProps> = (props) => {
    const { className, fullView } = props;
    const cx = classnames('cr-modal', className, {
        'cr-modal--full-view': fullView,
    });

    if (!props.show) {
        return null;
    }

    return (
        <div className={cx}>
            {fullView ? props.header : null}
            <div className="cr-modal__container">
                {!fullView ? <div className="cr-modal__container-header">{props.header}</div> : null}
                <div className="cr-modal__container-content">{props.content}</div>
                <div className="cr-modal__container-footer">{props.footer}</div>
            </div>
        </div>
    );
};
