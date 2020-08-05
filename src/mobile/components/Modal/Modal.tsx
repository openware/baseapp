import classnames from 'classnames';
import * as React from 'react';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { ArrowIcon } from '../../../containers/ToolBar/icons/ArrowIcon';

const Modal = props => {
    const modalClassName = classnames('cr-mobile-modal', {
        'cr-mobile-modal--open': props.isOpen,
    });
    const bodyClassName = classnames('cr-mobile-modal__block', {
        'cr-mobile-modal__block--open': props.isOpen,
    });

    return (
        <div className={modalClassName}>
            <div className={bodyClassName}>
                <div className="cr-mobile-modal__header">
                    <div className="cr-mobile-modal__header-back" onClick={props.onBack}>
                        <ArrowIcon/>
                        {props.backTitle}
                    </div>
                    <div className="cr-mobile-modal__header-title">{props.title}</div>
                    <div className="cr-mobile-modal__header-close" onClick={props.onClose}>
                        <CloseIcon />
                    </div>
                </div>
                {props.children}
            </div>
        </div>
    );
};

export {
    Modal,
};
