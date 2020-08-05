import classnames from 'classnames';
import * as React from 'react';
import { CloseIcon } from '../../../assets/images/CloseIcon';
import { ArrowIcon } from '../../../containers/ToolBar/icons/ArrowIcon';

const Modal = props => {
    const [shouldAnimate, setShouldAnimate] = React.useState(false);

    React.useEffect(() => {
        if (props.isOpen) {
            setTimeout(() => {
                setShouldAnimate(true);
            }, 200);
        }
    }, [props.isOpen]);

    const modalClassName = classnames('cr-mobile-modal', {
        'cr-mobile-modal--open': shouldAnimate,
    });
    const bodyClassName = classnames('cr-mobile-modal__block', {
        'cr-mobile-modal__block--open': shouldAnimate,
    });

    return (
        <div className={modalClassName}>
            <div className={bodyClassName}>
                <div className="cr-mobile-modal__header">
                    <div className="cr-mobile-modal__header-back" onClick={props.onBack}>
                        <ArrowIcon/>
                        <span>{props.backTitle}</span>
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
