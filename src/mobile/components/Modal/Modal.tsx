import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';

const Modal = props => {
    const modalClassName = classnames('cr-mobile-modal', {
        'cr-mobile-modal--open': props.isOpen,
    });
    const bodyClassName = classnames('cr-mobile-modal__block', {
        'cr-mobile-modal__block--open': props.isOpen,
    });
    const intl = useIntl() as any;
    // tslint:disable-next-line:no-console
    console.log(intl);

    return (
        <div className={modalClassName}>
            <div className={bodyClassName}>
                {props.children}
            </div>
        </div>
    );
};

export {
    Modal,
};
