import classnames from 'classnames';
import React, { FC, ReactElement, useCallback, useEffect, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { AvatarIcon } from 'src/assets/images/NavBarIcons';
import { DEFAULT_CCY_PRECISION, DEFAULT_FIAT_PRECISION, HOST_URL } from 'src/constants';
import { cleanPositiveFloatInput, secondToMinutes, precisionRegExp, truncateMiddle } from 'src/helpers';
import { P2POrderCreate, selectP2PWallets, selectPaymentMethodList, UserPaymentMethod } from 'src/modules';
import { Decimal, DropdownComponent, Modal, OrderInput } from 'src/components';
import { PlusIcon } from 'src/assets/images/PlusIcon';
import { useP2PWalletsFetch } from 'src/hooks';
import { useHistory } from 'react-router';
import { isUsernameEnabled } from 'src/api';

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
    paymentMethods: UserPaymentMethod[];
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
    const [availablePM, setAvailablePM] = useState<UserPaymentMethod[]>([]);

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
        paymentMethods,
    } = props;

    const wallets = useSelector(selectP2PWallets);
    const userPM = useSelector(selectPaymentMethodList);
    const { formatMessage } = useIntl();
    const history = useHistory();
    useP2PWalletsFetch();

    useEffect(() => {
        if (userPM.length && paymentMethods.length) {
            setAvailablePM(userPM.reduce((acc, upm) => { return paymentMethods.find(p => p.payment_method_id === upm.payment_method_id) ? [...acc, upm] : acc }, []));
        }
    }, [userPM, paymentMethod]);

    useEffect(() => {
        if (clickAll) {
            defineAmountError(tradeAmount.toString());
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
        if (availablePM.length && !paymentMethod) {
            setPaymentMethod(availablePM[0]);
        }
    }, [availablePM, paymentMethod]);

    const translate = useCallback((key: string, value?: any) => formatMessage({ id: key }, { ...value }), [formatMessage]);

    const handleAmountChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(side === 'buy' ? pricePrecision : amountPrecision))) {
            setTradeAmount(convertedValue);
            setReceiveAmount(side === 'buy' ? 
                Decimal.format(+convertedValue / +price, amountPrecision, '')
                : Decimal.format(+convertedValue * +price, pricePrecision, ''));
        }

        defineAmountError(convertedValue);
    }, [amountPrecision, pricePrecision, side, price]);

    const handleReceiveChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(side === 'buy' ? amountPrecision : pricePrecision))) {
            setReceiveAmount(convertedValue);
            setTradeAmount(side === 'buy' ? 
                Decimal.format(+convertedValue * +price, pricePrecision, '') 
                : Decimal.format(+convertedValue / +price, amountPrecision, ''));
        }

        if (side === 'buy') {
            defineAmountError(String(+convertedValue * +price));
        } else {
            defineAmountError(String(Number(price) ? +convertedValue / +price : 0));
        }
    }, [amountPrecision, pricePrecision, side, price]);

    const handleSelectPaymentMethod = useCallback((index: number) => {
        setPaymentMethod(availablePM[index]);
        definePaymentError(paymentMethod);
    }, [paymentMethod, availablePM]);

    const defineAmountError = useCallback((value: string) => {
        let error = '';
    
        if (!value) {
            error = translate('page.body.p2p.error.empty.amount');
        } else if (Number(value) <= 0) {
            error = translate('page.body.p2p.error.greater.than.0.amount');
        } else {
            const avail = wallets.find(w => w.currency === currencyCode.toLowerCase())?.balance;
            const low = side === 'buy' ? +lowLimit * +price : lowLimit;
            const getTop = getTopLimit();
            const top = side === 'buy' ? getTop * +price : getTop;
            const limitsPrecision = side === 'buy' ? pricePrecision : amountPrecision;
            const limitCur = side === 'buy' ? fiatCode : currencyCode;

            if (+value < +low) {
                error = `${translate('page.body.p2p.modal.error.min.amount')} ${Decimal.format(low, limitsPrecision, ',')} ${limitCur?.toUpperCase()}`;
            } else if (+value > +top) {
                error = `${translate('page.body.p2p.modal.error.max.amount')} ${Decimal.format(top, limitsPrecision, ',')} ${limitCur?.toUpperCase()}`;
            } else if (side === 'sell' && avail && +value > +avail) {
                error = translate('page.body.p2p.error.insufficient.funds');
            } else {
                error = undefined;
            }
        }

        setAmountError(error);
    }, [lowLimit, fiatCode, pricePrecision, side, price, wallets, currencyCode]);

    const definePaymentError = useCallback((pm?: UserPaymentMethod) => {
        let error = '';
    
        if (side === 'sell' && !pm) {
            error = translate('page.body.p2p.error.empty.payment.method');
        }

        setPaymentMethodError(error);
    }, [side]);

    const validatePriceRange = useCallback((value: number) => {
        let low = lowLimit;
        let top = getTopLimit();

        if (side === 'buy') {
            low = +lowLimit * +price;
            top = getTopLimit() * +price
        }

        return value >= low && value <= top;
    }, [lowLimit, side]);

    const handleSubmitClick = useCallback(() => {
        const avail = wallets.find(w => w.currency === currencyCode.toLowerCase())?.balance;

        if (!tradeAmount
            || Number(tradeAmount) <= 0
            || (side === 'sell' && avail && +tradeAmount > +avail)
            || !validatePriceRange(+tradeAmount)
            || (side === 'sell' && !paymentMethod)
        ) {
            setShowError(true);
            defineAmountError(tradeAmount);
            definePaymentError(paymentMethod);
        } else {
            const payload = {
                offer_id: id,
                amount: side === 'sell' ? tradeAmount : receiveAmount,
                side,
                ...(side === 'sell' && { payment_method_id: paymentMethod.id }),
            };
    
            props.handleSubmit(payload);
        }
    }, [tradeAmount, receiveAmount, price, wallets, currencyCode, paymentMethod, id]);

    const handleClickTradeAll = useCallback(() => {
        if (side === 'buy') {
            const maxLimit = getTopLimit() * +price;
            if ((+available * +price) < maxLimit) {
                handleReceiveChange(available.toString());
            } else {
                handleAmountChange(maxLimit.toString());
            }
        } else {
            const availableBalance = wallets.find(w => w.currency === currencyCode.toLowerCase())?.balance || 0;
            setTradeAmount(+availableBalance > +available ? available.toString() : availableBalance.toString());
        }
        setClickAll(true);
    }, [side, currencyCode, wallets, available, price]);

    const handleCloseModal = useCallback(() => {
        setClickAll(false);
        setShowError(false);
        setAmountError('');
        setReceiveAmount('');
        props.closeModal();
    }, [props.closeModal]);

    const header = useMemo(() => (
        <React.Fragment>
            <span className="cr-modal__container-header-title">{translate(`page.body.p2p.modal.header.${side}`)} {currencyCode.toUpperCase()}</span>
            <div onClick={handleCloseModal} className="cr-modal__container-header-box-close">
                <CloseIcon className="close-icon" />
            </div>
        </React.Fragment>
    ), [side, currencyCode]);

    const inputClass = useMemo(() => (
        classnames('cr-order-input__wrapper', {
            'cr-order-input__wrapper--errored': showError && amountError,
        })
    ), [amountError, showError]);

    const buttonClass = useMemo(() => (
        classnames({
            'buy': side === 'buy',
            'sell': side === 'sell',
        })
    ), [side]);

    const iconsList = useCallback(() =>
        availablePM.map(i => <img className="payment-method-logo ml-2 mr-3 mb-1" src={`${HOST_URL}/api/v2/p2p/public/payment_methods/${i.payment_method_id}/logo`} alt=""/>), [userPM]);

    const renderPMItem = (pm: UserPaymentMethod) => {
        const keyContainsNumber = pm.data && Object.keys(pm.data).find(i => i.includes('number'));
        const numberValue = keyContainsNumber ? truncateMiddle(pm.data[keyContainsNumber], 12, '****') : '';

        return `${pm?.payment_method?.name} ${numberValue}`;
    };

    const renderAvatar = useMemo(() => isUsernameEnabled() ? (
        <div className="cr-modal__container-content-block">
            <div className="advertiser">
                <AvatarIcon fillColor="var(--icons)"/>
                <div className="advertiser-name">{advertiserName}</div>
            </div>
        </div>
    ) : null, [advertiserName]);

    const renderDescription = useMemo(() => description ? (
        <div className="cr-modal__container-content-block">
            <div className="description">
                <span className="description__label">{translate('page.body.p2p.modal.label.description')}</span>
                <p className="description__content">{description}</p>
            </div>
        </div>
    ) : null, [description]);

    const renderBalance = useMemo(() => side === 'sell' && (
        <div className="balance">
            {translate('page.body.p2p.modal.label.balance')}
            <span className="balance-amount">{Decimal.format(wallets.find(w => w.currency === currencyCode.toLowerCase())?.balance, amountPrecision, '')}</span>
            <span className="balance-currency">{currencyCode.toUpperCase()}</span>
        </div>
    ), [side, wallets, amountPrecision, currencyCode]);

    const renderAmountError = useMemo(() => showError && (
        <span className="error">{amountError}</span>
    ), [showError, amountError]);

    const renderPaymentMethod = useMemo(() => side === 'sell' && (
        <React.Fragment>
            <div className="payment">
                <label>{translate('page.body.p2p.modal.button.payment')}</label>
                {availablePM.length ? (
                    <DropdownComponent
                        className="cr-create-offer__dp-dropdown"
                        list={availablePM.map(renderPMItem)}
                        iconsList={iconsList()}
                        onSelect={handleSelectPaymentMethod}
                        placeholder={paymentMethod && renderPMItem(paymentMethod)}
                    />
                ) : (
                    <Button
                        onClick={() => history.push('/profile/payment')}
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
    ), [side, availablePM, paymentMethod, showError, paymentMethodError]);

    const getTopLimit = useCallback(() => {
        return +topLimit > +available ? +available : +topLimit;
    }, [available, topLimit]);

    const body = useCallback(() => {
        const top = getTopLimit();
        const placeHolder = side === 'buy' ? 
            `${Decimal.format(+lowLimit * +price, pricePrecision, ',')} - ${Decimal.format(top * +price, pricePrecision, ',')}`
            : `${Decimal.format(+lowLimit , amountPrecision, ',')} - ${Decimal.format(top, amountPrecision, ',')}`;

        return (
            <React.Fragment>
                {renderAvatar}
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
                                <div className="detail-block-label">{translate('page.body.p2p.modal.label.time.limit')}</div>{secondToMinutes(timeLimit)} {translate('page.body.p2p.modal.label.time.minute')}
                            </div>
                            <div className="detail-block-right">
                                <div className="detail-block-label">{translate('page.body.p2p.modal.label.payment')}</div>
                                {paymentMethods.map(i => (
                                    <div className="payment-item">
                                        <img className="payment-method-logo mr-3" src={`${HOST_URL}/api/v2/p2p/public/payment_methods/${i?.payment_method?.id}/logo`} alt=""/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {renderDescription}
                <div className="cr-modal__container-content-block">
                    <div className={inputClass}>
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
                            allButtonText={translate('page.body.p2p.modal.button.all')}
                            handleClickAllButton={handleClickTradeAll}
                        />
                        {renderAmountError}
                        {renderBalance}
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
                    {renderPaymentMethod}
                </div>
            </React.Fragment>
        );
    }, [
        side,
        currencyCode,
        fiatCode,
        advertiserName,
        price,
        available,
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
        availablePM,
        paymentMethod,
        receiveFocused,
        history,
    ]);

    const footer = useCallback(() => (
        <Button
            onClick={handleSubmitClick}
            size="lg"
            variant={buttonClass}
            disabled={showError && !!amountError}
        >
            {translate(`page.body.p2p.modal.header.${side}`)} {currencyCode.toUpperCase()}
        </Button>
    ), [showError, amountError, handleSubmitClick, buttonClass]);

    return (
        <div className="cr-p2p-offers-modal">
            <Modal
                show={show}
                header={header}
                content={body()}
                footer={footer()}
            />
        </div>
    );
};

export {
    P2POffersModal,
};
