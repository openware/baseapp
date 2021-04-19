import React, { FC, ReactElement, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { Currency, UserPaymentMethod } from 'src/modules';
import { Decimal, Modal } from '../../../../components';

interface ParentProps {
    side: string;
    asset: Currency;
    cash: Currency;
    price: string;
    amount: string;
    topLimit: string;
    lowLimit: string;
    paymentMethods: UserPaymentMethod[];
    timeLimit: string;
    show: boolean;
    handleChangeStep: (value: number) => void;
    handleSubmit: () => void;
    toggleModal: () => void;
}

type Props = ParentProps;

const ConfirmOfferModal: FC<Props> = (props: Props): ReactElement => {
    const { side, asset, cash, price, amount, topLimit, lowLimit, paymentMethods, timeLimit, show } = props;
    const { formatMessage } = useIntl();

    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

    const header = React.useCallback(() => (
        <React.Fragment>
            <span className="pg-create-offer__header-title">{translate('page.body.p2p.create.offer.header')}</span>
            <div onClick={props.toggleModal} className="pg-create-offer-box-close">
                <CloseIcon className="close-icon" />
            </div>
        </React.Fragment>
    ), [translate, props.toggleModal]);

    const body = React.useCallback(() => {
        return (
            <div className="form-padding">
                <div className="cr-create-offer__modal">
                    <div className="cr-create-offer__modal-item">
                        <span className="cr-create-offer__modal-item__label">{translate('page.body.p2p.create.offer.type')}</span>
                        <span className="cr-create-offer__modal-item__value">{side?.toUpperCase()}</span>
                    </div>
                    <div className="cr-create-offer__modal-item">
                        <span className="cr-create-offer__modal-item__label">{translate('page.body.p2p.create.offer.asset')}</span>
                        <span className="cr-create-offer__modal-item__value">{asset?.id.toUpperCase()}</span>
                    </div>
                    <div className="cr-create-offer__modal-item">
                        <span className="cr-create-offer__modal-item__label">{translate('page.body.p2p.create.offer.currency')}</span>
                        <span className="cr-create-offer__modal-item__value">{cash?.id.toUpperCase()}</span>
                    </div>
                    <div className="cr-create-offer__modal-item">
                        <span className="cr-create-offer__modal-item__label">{translate('page.body.p2p.create.offer.price')}</span>
                        <span className="cr-create-offer__modal-item__value">{Decimal.format(price, cash.precision, ',')}&nbsp;{cash?.id.toUpperCase()}</span>
                    </div>
                    <div className="cr-create-offer__modal-item">
                        <span className="cr-create-offer__modal-item__label">{translate('page.body.p2p.create.offer.amount')}</span>
                        <span className="cr-create-offer__modal-item__value">{Decimal.format(amount, asset.precision, ',')}&nbsp;{asset?.id.toUpperCase()}</span>
                    </div>
                    <div className="cr-create-offer__modal-item">
                        <span className="cr-create-offer__modal-item__label">{translate('page.body.p2p.create.offer.order_limit')}</span>
                        <span className="cr-create-offer__modal-item__value">
                            {Decimal.format(lowLimit, cash.precision, ',')}&nbsp;{cash?.id.toUpperCase()} - {Decimal.format(topLimit, cash.precision, ',')}&nbsp;{cash?.id.toUpperCase()}
                        </span>
                    </div>
                    <div className="cr-create-offer__modal-item">
                        <span className="cr-create-offer__modal-item__label">{translate('page.body.p2p.create.offer.payment_method')}</span>
                        {paymentMethods.map(i => <span className="cr-create-offer__modal-item__value">{i.payment_method?.name}</span>)}
                    </div>
                    <div className="cr-create-offer__modal-item">
                        <span className="cr-create-offer__modal-item__label">{translate('page.body.p2p.create.offer.time_limit')}</span>
                        <span className="cr-create-offer__modal-item__value">{timeLimit}</span>
                    </div>
                </div>
                <div className="cr-create-offer__modal--info">
                    {translate('page.body.p2p.create.offer.confirm.info', { side: side?.toUpperCase() })}
                </div>
            </div>
        );
    }, [translate, side, asset, cash, price, amount, timeLimit, lowLimit, topLimit, paymentMethods]);

    const footer = React.useCallback(() => (
        <div className="cr-create-offer__btn-wrapper__grid">
            <Button
                onClick={props.toggleModal}
                size="lg"
                variant="secondary"
            >
                {translate('page.body.p2p.create.offer.cancel')}
            </Button>
            <Button
                onClick={props.handleSubmit}
                size="lg"
                variant="primary"
            >
                {translate('page.body.p2p.create.offer.confirm').toUpperCase()}
            </Button>
        </div>
    ), [translate, props.toggleModal]);

    return (
        <div className="cr-create-offer">
            <Modal
                show={show}
                header={header()}
                content={body()}
                footer={footer()}
            />
        </div>
    );
};

export {
    ConfirmOfferModal,
};
