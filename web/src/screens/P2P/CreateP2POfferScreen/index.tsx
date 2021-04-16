import classnames from 'classnames';
import React, { FC, ReactElement, useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { P2P_TIME_LIMIT_LIST } from 'src/constants';
import { ConfirmOfferModal, CreateOfferStep1, CreateOfferStep2, CreateOfferStep3 } from 'src/containers';
import { useCurrenciesFetch, useDocumentTitle, useP2PCurrenciesFetch, useUserPaymentMethodsFetch, useWalletsFetch } from 'src/hooks';
import { createOffer, Currency, UserPaymentMethod } from 'src/modules';

export const CreateP2POfferScreen: FC = (): ReactElement => {
    const [step, setStep] = useState<number>(0);
    const [price, setPrice] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [timeLimit, setTimeLimit] = useState<string>(P2P_TIME_LIMIT_LIST[0]);
    const [paymentMethods, setPaymentMethods] = useState<UserPaymentMethod[]>([]);
    const [lowLimit, setLowLimit] = useState<string>('');
    const [topLimit, setTopLimit] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [replyMessage, setReplyMessage] = useState<string>('');
    const [side, setSide] = useState<string>('buy');
    const [asset, setAsset] = useState<Currency | undefined>();
    const [cash, setCash] = useState<Currency | undefined>();
    const [open, setOpen] = useState<boolean>(false);

    const { formatMessage } = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();

    useDocumentTitle('Create Offer');
    useCurrenciesFetch();
    useWalletsFetch();
    useP2PCurrenciesFetch();
    useUserPaymentMethodsFetch();

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    const goBack = useCallback(event => {
        event.preventDefault();
        history.goBack();
    }, []);

    const cx = useCallback(() => (
        classnames('pg-create-offer__progress-items', {
            'pg-create-offer__progress-first': step === 0,
            'pg-create-offer__progress-second': step === 1,
            'pg-create-offer__progress-third': step === 2,
        })
    ), [classnames, step]);

    const title = useCallback(() => {
        return step === 0 
        ? translate('page.body.p2p.create.offer.title')
        : `${translate(`page.body.p2p.create.offer.title.${side}`)} ${asset?.id?.toUpperCase()}`; 
    }, [step, asset, side, translate]);

    const updatePaymentMethod = React.useCallback((value: UserPaymentMethod, index: number) => {
        const pm = paymentMethods;
        pm[index] = value;
        setPaymentMethods([ ...pm ]);
    }, [paymentMethods]);

    const popPaymentMethod = React.useCallback((index: number) => {
        if (paymentMethods[index]) {
            const pm = paymentMethods;
            pm.splice(index, 1);
            setPaymentMethods([ ...pm ]);
        }
    }, [paymentMethods]);

    const toggleModal = React.useCallback(() => {
        setOpen(!open);
    }, [open]);

    const handleSubmit = useCallback(() => {
        if (asset && cash) {
            const payload = {
                base: asset.id,
                quote: cash.id,
                side,
                price,
                amount,
                max_order_amount: topLimit,
                min_order_amount: lowLimit,
                time_limit: Number(timeLimit.match(/\d+/)[0]) * 60 * 1000,
                upm_id: paymentMethods.map(i => Number(i.id)),
                description,
                reply_message: replyMessage,
            };
    
            dispatch(createOffer(payload))
            setOpen(false);
            history.push('/p2p');
        }
    }, [
        step,
        asset,
        cash,
        side,
        price,
        amount,
        topLimit,
        lowLimit,
        timeLimit,
        paymentMethods,
        description,
        replyMessage,
        dispatch,
    ]);

    const content = useCallback(() => {
        switch (step) {
            case 0: return (
                <CreateOfferStep1
                    asset={asset}
                    cash={cash}
                    side={side}
                    price={price}
                    handleSetAsset={setAsset}
                    handleSetCash={setCash}
                    handleSetSide={setSide}
                    handleSetPrice={setPrice}
                    handleGoNext={() => setStep(1)}
                />
            );
            case 1: return (
                <CreateOfferStep2
                    asset={asset}
                    cash={cash}
                    side={side}
                    amount={amount}
                    timeLimit={timeLimit}
                    paymentMethods={paymentMethods}
                    lowLimit={lowLimit}
                    topLimit={topLimit}
                    handleSetLowLimit={setLowLimit}
                    handleSetTopLimit={setTopLimit}
                    handleSetAmount={setAmount}
                    handleSetTimeLimit={setTimeLimit}
                    handleChangeStep={setStep}
                    handleUpdatePaymentMethods={updatePaymentMethod}
                    handleSetPaymentMethods={setPaymentMethods}
                    handleRemovePaymentMethod={popPaymentMethod}
                />
            );
            case 2: return (
                <CreateOfferStep3
                    description={description}
                    replyMessage={replyMessage}
                    handleSetDescription={setDescription}
                    handleSetReplyMessage={setReplyMessage}
                    handleChangeStep={setStep}
                    handleSubmit={toggleModal}
                />
            );
            default: return;
        }
    }, [
        step,
        asset,
        cash,
        side,
        price,
        amount,
        topLimit,
        lowLimit,
        timeLimit,
        paymentMethods,
        description,
        replyMessage,
    ]);

    const confirmOfferModal = React.useCallback(() => {
        return asset && cash && (
            <ConfirmOfferModal
                show={open}
                asset={asset}
                cash={cash}
                side={side}
                amount={amount}
                price={price}
                timeLimit={timeLimit}
                paymentMethods={paymentMethods}
                lowLimit={lowLimit}
                topLimit={topLimit}
                handleChangeStep={setStep}
                handleSubmit={handleSubmit}
                toggleModal={toggleModal}
            />
        );
    }, [asset, cash, side, price, amount, topLimit, lowLimit, timeLimit, paymentMethods, open]);

    return (
        <div className="pg-create-offer pg-container">
            <div className="pg-create-offer__progress">
                <div className={cx()}>
                    <div className="pg-create-offer__progress-step">
                        <span className="pg-create-offer__title-text pg-create-offer__active-1">
                            {translate('page.body.p2p.create.offer.head.type')}
                        </span>
                        <div className="pg-create-offer__progress-circle-1"/>
                    </div>
                    <div className="pg-create-offer__progress-line-1" />
                    <div className="pg-create-offer__progress-step">
                        <span className="pg-create-offer__title-text pg-create-offer__active-2">
                            {translate('page.body.p2p.create.offer.head.amount')}
                        </span>
                        <div className="pg-create-offer__progress-circle-2" />
                    </div>
                    <div className="pg-create-offer__progress-line-2" />
                    <div className="pg-create-offer__progress-step">
                        <span className="pg-create-offer__title-text pg-create-offer__active-3">
                            {translate('page.body.p2p.create.offer.head.description')}
                        </span>
                        <div className="pg-create-offer__progress-circle-3" />
                    </div>
                </div>
            </div>
            <div className="pg-create-offer-box">
                <div className="pg-create-offer__header">
                    <span className="pg-create-offer__header-title">{title()}</span>
                    <div onClick={goBack} className="pg-create-offer-box-close">
                        <CloseIcon className="close-icon" />
                    </div>
                </div>
                <div className="pg-create-offer__content">
                    {content()}
                </div>
            </div>
            {confirmOfferModal()}
        </div>
    );
};
