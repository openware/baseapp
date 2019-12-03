import * as React from 'react';
import { OrderIEOData } from '../../modules';

interface Props {
    data: OrderIEOData;
    translate: (key: string) => JSX.Element | string;
    toggleModal: () => void;
}

export const OrderExecuteSuccessModal: React.FunctionComponent<Props> = (props: Props) => {
    const handleClick = () => {
        props.toggleModal();
    };

    return (
        <div className="pg-ieo-order-success-modal">
            <div className="pg-ieo-order-success-modal__body">
                <div className="pg-ieo-order-success-modal__body-box">
                    <div className="pg-ieo-order-success-modal__body__header">
                        <div>{props.translate('page.body.ieo.modal.orderSuccess.title')}</div>
                    </div>
                    <div className="pg-ieo-order-success-modal__body__content">
                        <div className="pg-ieo-order-success-modal__body__content__message">
                            {props.translate('page.body.ieo.modal.orderSuccess.message')}&nbsp;
                            {props.data.tokens_ordered || '0'}&nbsp;
                            {props.data.base_currency ? props.data.base_currency.toUpperCase() : ''}
                        </div>
                        <div className="pg-ieo-order-success-modal__body__content__button" onClick={handleClick}>
                            {props.translate('page.body.ieo.modal.orderSuccess.button')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
