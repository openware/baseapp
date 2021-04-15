import classnames from 'classnames';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { AvatarIcon } from 'src/assets/images/NavBarIcons';
import { DEFAULT_CCY_PRECISION, DEFAULT_FIAT_PRECISION, HOST_URL } from 'src/constants';
import { cleanPositiveFloatInput, millisecondToMinutes, precisionRegExp, truncateMiddle } from 'src/helpers';
import { P2POrderCreate, selectP2PWallets, selectPaymentMethodList, UserPaymentMethod } from 'src/modules';
import { Decimal, DropdownComponent, Modal, OrderInput } from 'src/components';
import { PlusIcon } from 'src/assets/images/PlusIcon';

interface ParentProps {
    id: number;
    side: string;
    currencyCode: string;
    fiatCode: string;
    advertiserName: string;
    price: string | number;
    available: string | number;
    topLimit: string | number;
    lowLimit: string | number;
    timeLimit: number;
    description: string;
    show: boolean;
    handleSubmit: (payload: P2POrderCreate) => void;
    closeModal: () => void;
}

type Props = ParentProps;

const P2POffersModal: FC<Props> = (props: Props): ReactElement => {
    const [tradeAmount, setTradeAmount] = useState<string>('');
    const [amountFocused, setAmountFocused] = useState<boolean>(false);
    const [receiveAmount, setReceiveAmount] = useState<string>('');
    const [receiveFocused, setReceiveFocused] = useState<boolean>(false);
    const [paymentMethod, setPaymentMethod] = useState<UserPaymentMethod | undefined>(undefined);
    const [showError, setShowError] = useState<boolean>(false);
    const [amountError, setAmountError] = useState<string>('');
    const [paymentMethodError, setPaymentMethodError] = useState<string>('');
    const [pricePrecision, setPricePrecision] = useState<number>(0);
    const [amountPrecision, setAmountPrecision] = useState<number>(0);
    const [clickAll, setClickAll] = useState<boolean>(false);

    const {
        id,
        side,
        currencyCode,
        fiatCode,
        advertiserName,
        price,
        available,
        topLimit,
        lowLimit,
        timeLimit,
        description,
        show,
    } = props;

    const wallets = useSelector(selectP2PWallets);
    const userPM = useSelector(selectPaymentMethodList);
    const { formatMessage } = useIntl();

    useEffect(() => {
        if (clickAll) {
            side === 'buy' ? defineAmountError(tradeAmount.toString()) : defineAmountError((+tradeAmount * +price).toString());
            setReceiveAmount(side === 'buy' ? 
                Decimal.format(+tradeAmount / +price, amountPrecision, '')
                : Decimal.format(+tradeAmount * +price, pricePrecision, ''));
            setClickAll(false);
        }
    }, [tradeAmount, amountPrecision, price, side, clickAll]);

    useEffect(() => {
        setPricePrecision(wallets.find(w => w.currency === fiatCode)?.fixed || DEFAULT_FIAT_PRECISION);
    }, [fiatCode, wallets]);

    useEffect(() => {
        setAmountPrecision(wallets.find(w => w.currency === currencyCode.toLowerCase())?.fixed || DEFAULT_CCY_PRECISION);
    }, [currencyCode, wallets]);

    useEffect(() => {
        if (userPM.length && !paymentMethod) {
            setPaymentMethod(userPM[0]);
        }
    }, [userPM, paymentMethod]);

    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

    const handleAmountChange = React.useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(side === 'buy' ? pricePrecision : amountPrecision))) {
            setTradeAmount(convertedValue);
            setReceiveAmount(side === 'buy' ? 
                Decimal.format(+convertedValue / +price, amountPrecision, '')
                : Decimal.format(+convertedValue * +price, pricePrecision, ''));
        }

        side === 'buy' ? defineAmountError(convertedValue) : defineAmountError((+convertedValue * +price).toString());
    }, [amountPrecision, pricePrecision, side, price]);

    const handleReceiveChange = React.useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(side === 'buy' ? amountPrecision : pricePrecision))) {
            setReceiveAmount(convertedValue);
            setTradeAmount(side === 'buy' ? 
                Decimal.format(+convertedValue * +price, pricePrecision, '') 
                : Decimal.format(+convertedValue / +price, amountPrecision, ''));
        }

        side === 'buy' ? defineAmountError((+convertedValue * +price).toString()) : defineAmountError(convertedValue);
    }, [amountPrecision, pricePrecision, side, price]);

    const handleSelectPaymentMethod = React.useCallback((index: number) => {
        setPaymentMethod(userPM[index]);
        definePaymentError(paymentMethod);
    }, [paymentMethod, userPM]);

    const defineAmountError = React.useCallback((value: string) => {
        let error = '';
    
        if (!value) {
            error = translate('page.body.p2p.error.empty.amount');
        } else if (Number(value) <= 0) {
            error = translate('page.body.p2p.error.greater.than.0.amount');
        } else {
            const available = wallets.find(w => w.currency === currencyCode.toLowerCase())?.balance;
            error = +value < +lowLimit ? `${translate('page.body.p2p.modal.error.min.amount')} ${Decimal.format(lowLimit, pricePrecision, ',')} ${fiatCode}`
                : +value > +topLimit ? `${translate('page.body.p2p.modal.error.max.amount')} ${Decimal.format(topLimit, pricePrecision, ',')} ${fiatCode}`
                : side === 'sell' && available && +value / +price > +available ? translate('page.body.p2p.error.insufficient.funds')
                : '';
        }

        setAmountError(error);
    }, [translate, lowLimit, topLimit, fiatCode, pricePrecision, side, price, wallets, currencyCode]);

    const definePaymentError = React.useCallback((pm?: UserPaymentMethod) => {
        let error = '';
    
        if (side === 'sell' && !pm) {
            error = translate('page.body.p2p.error.empty.payment.method');
        }

        setPaymentMethodError(error);
    }, [side, translate]);

    const validatePriceRange = React.useCallback((value: number) => {
        return (value >= lowLimit && value <= topLimit)
    }, [lowLimit, topLimit]);

    const handleSubmitClick = React.useCallback(() => {
        const available = wallets.find(w => w.currency === currencyCode.toLowerCase())?.balance;

        if (
            !tradeAmount
            || Number(tradeAmount) <= 0
            || side === 'sell' && available && +tradeAmount / +price > +available
            || !validatePriceRange(+tradeAmount)
            || side === 'sell' && !paymentMethod
        ) {
            setShowError(true);
            defineAmountError(tradeAmount.toString());
            definePaymentError(paymentMethod);
        } else {
            const payload = {
                offer_id: id,
                amount: +tradeAmount,
                side,
            };
    
            props.handleSubmit(payload);
        }
    }, [tradeAmount, price, wallets, currencyCode, paymentMethod, id, props.handleSubmit]);

    const handleClickTradeAll = React.useCallback(() => {
        if (side === 'buy') {
            setTradeAmount(topLimit.toString());
        } else {
            const availableBalance = wallets.find(w => w.currency === currencyCode.toLowerCase())?.balance || 0;
            setTradeAmount(availableBalance.toString());
        }
        setClickAll(true);
    }, [side, currencyCode, wallets]);

    const handleCloseModal = React.useCallback(() => {
        setClickAll(false);
        setShowError(false);
        setAmountError('');
        setReceiveAmount('');
        props.closeModal();
    }, [props.closeModal]);

    const header = React.useCallback(() => (
        <React.Fragment>
            <span className="cr-modal__container-header-title">{translate(`page.body.p2p.modal.header.${side}`)} {currencyCode.toUpperCase()}</span>
            <div onClick={handleCloseModal} className="cr-modal__container-header-box-close">
                <CloseIcon className="close-icon" />
            </div>
        </React.Fragment>
    ), [side, currencyCode, translate]);

    const inputClass = useCallback((error: string) => (
        classnames('cr-order-input__wrapper', {
            'cr-order-input__wrapper--errored': showError && error,
        })
    ), [showError, classnames]);

    const buttonClass = useCallback(() => (
        classnames({
            'buy': side === 'buy',
            'sell': side === 'sell',
        })
    ), [side, classnames]);

    const iconsList = React.useCallback(() =>
        userPM.map(i => <img className="ml-2 mr-3 mb-1" src={`${HOST_URL}/api/v2/p2p/public/payment_methods/${i.payment_method_id}/logo`} alt=""/>), [userPM]);

    const renderPMItem = pm => {
        const keyContainsNumber = pm.data && Object.keys(pm.data).find(i => i.includes('number'));
        const numberValue = keyContainsNumber ? truncateMiddle(pm.data[keyContainsNumber], 8, '***') : '';
        return `${pm.name} ${numberValue}`;
    };

    const body = React.useCallback(() => {
        const placeHolder = side === 'buy' ? 
            `${Decimal.format(lowLimit, pricePrecision, ',')} - ${Decimal.format(topLimit, pricePrecision, ',')}`
            : Decimal.format(0, amountPrecision, '');

        return (
            <React.Fragment>
                <div className="cr-modal__container-content-block">
                    <div className="advertiser">
                        <AvatarIcon fillColor="var(--icons)"/>
                        <div className="advertiser-name">{advertiserName}</div>
                    </div>
                </div>
                <div className="cr-modal__container-content-block">
                    <div className="detail">
                        <div className="detail-block">
                            <div className="detail-block-left">
                                <div className="detail-block-label">{translate('page.body.p2p.modal.label.price')}</div>{Decimal.format(price, pricePrecision, ',')} {fiatCode?.toUpperCase()}
                            </div>
                            <div className="detail-block-right">
                                <div className="detail-block-label">{translate('page.body.p2p.modal.label.available')}</div>{Decimal.format(available, amountPrecision, ',')} {currencyCode?.toUpperCase()}
                            </div>
                        </div>
                        <div className="detail-block">
                            <div className="detail-block-left">
                                <div className="detail-block-label">{translate('page.body.p2p.modal.label.time.limit')}</div>{millisecondToMinutes(timeLimit)} {translate('page.body.p2p.modal.label.time.minute')}
                            </div>
                            <div className="detail-block-right">
                                <div className="detail-block-label">{translate('page.body.p2p.modal.label.payment')}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cr-modal__container-content-block">
                    <div className="description">
                        <span className="description__label">{translate('page.body.p2p.modal.label.description')}</span>
                        <p className="description__content">{description}</p>
                    </div>
                </div>
                <div className="cr-modal__container-content-block">
                    <div className={inputClass(amountError)}>
                        <OrderInput
                            currency={side === 'buy' ? fiatCode : currencyCode}
                            label={side === 'buy' ? translate('page.body.p2p.modal.label.buy') : translate('page.body.p2p.modal.label.sell')}
                            placeholder={placeHolder}
                            value={tradeAmount}
                            isFocused={amountFocused}
                            handleChangeValue={handleAmountChange}
                            handleFocusInput={() => setAmountFocused(!amountFocused)}
                            labelVisible={true}
                            showAllButton={true}
                            handleClickAllButton={handleClickTradeAll}
                        />
                        {showError && <span className="error">{amountError}</span>}
                        {side === 'sell' && 
                            <div className="balance">
                                {translate('page.body.p2p.modal.label.balance')}
                                <span className="balance-amount">{Decimal.format(wallets.find(w => w.currency === currencyCode.toLowerCase())?.balance, amountPrecision, '')}</span>
                                <span className="balance-currency">{currencyCode.toUpperCase()}</span>
                            </div> 
                        }
                    </div>
                    <div className="cr-order-input__wrapper">
                        <OrderInput
                            currency={side === 'buy' ? currencyCode : fiatCode}
                            label={translate('page.body.p2p.modal.label.receive')}
                            value={receiveAmount}
                            placeholder="0.00"
                            isFocused={receiveFocused}
                            handleChangeValue={handleReceiveChange}
                            handleFocusInput={() => setReceiveFocused(!receiveFocused)}
                            labelVisible={true}
                        />
                    </div>
                    {side === 'sell' && (
                        <React.Fragment>
                            <div className="payment">
                                <label>{translate('page.body.p2p.modal.button.payment')}</label>
                                {userPM.length ? (
                                    <DropdownComponent
                                        className="cr-create-offer__dp-dropdown"
                                        list={userPM.map(renderPMItem)}
                                        iconsList={iconsList()}
                                        onSelect={handleSelectPaymentMethod}
                                        placeholder={paymentMethod && renderPMItem(paymentMethod)}
                                    />
                                ) : (
                                    <Button
                                        onClick={() => window.console.log('add')}
                                        size="lg"
                                        variant="outline-primary"
                                    >
                                        <span>{translate('page.body.p2p.create.offer.payment_method.add')}</span>
                                        <PlusIcon className="icon"/>
                                    </Button>
                                )}
                                {showError && <span className="error">{paymentMethodError}</span>}
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </React.Fragment>
        );
    }, [
        translate,
        side,
        currencyCode,
        fiatCode,
        advertiserName,
        price,
        available,
        topLimit,
        lowLimit,
        timeLimit,
        description,
        tradeAmount,
        amountFocused,
        amountPrecision,
        pricePrecision,
        receiveAmount,
        showError,
        wallets,
        clickAll,
        userPM,
        paymentMethod,
        receiveFocused,
    ]);

    const footer = React.useCallback(() => (
        <Button
            onClick={handleSubmitClick}
            size="lg"
            variant={buttonClass()}
            disabled={showError && !!amountError}
        >
            {translate(`page.body.p2p.modal.header.${side}`)} {currencyCode.toUpperCase()}
        </Button>
    ), [showError, amountError, translate, handleSubmitClick, buttonClass, props.closeModal]);

    return (
        <div className="cr-p2p-offers-modal">
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
    P2POffersModal,
};
