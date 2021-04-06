import classnames from 'classnames';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CloseIcon } from 'src/assets/images/CloseIcon';
import { AvatarIcon } from 'src/assets/images/NavBarIcons';
import { DEFAULT_CCY_PRECISION, DEFAULT_FIAT_PRECISION } from 'src/constants';
import { cleanPositiveFloatInput, millisecondToMinutes, precisionRegExp } from 'src/helpers';
import { selectWallets } from 'src/modules';
import { Decimal, Modal, OrderInput } from 'src/components';

interface ParentProps {
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
    tradeAmount: string | number;
    show: boolean;
    handleClickAll: () => void;
    handleSubmit: () => void;
    handleSetAmount: (value: string) => void;
    closeModal: () => void;
}

type Props = ParentProps;

const P2POffersModal: FC<Props> = (props: Props): ReactElement => {
    const [amountFocused, setamountFocused] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [amountError, setAmountError] = useState<string>('');
    const [pricePrecision, setPricePrecision] = useState<number>(0);
    const [amountPrecision, setAmountPrecision] = useState<number>(0);
    const [receiveAmount, setReceiveAmount] = useState<string>('');
    const [clickAll, setClickAll] = useState<boolean>(false);

    const { side, currencyCode, fiatCode, advertiserName, price, available, topLimit, lowLimit, timeLimit, description, tradeAmount, show } = props;
    const wallets = useSelector(selectWallets);
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

    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

    const handleAmountChange = React.useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(side === 'buy' ? pricePrecision : amountPrecision))) {
            props.handleSetAmount(convertedValue);
            setReceiveAmount(side === 'buy' ? 
                Decimal.format(+convertedValue / +price, amountPrecision, '')
                : Decimal.format(+convertedValue * +price, pricePrecision, ''));
        }

        side === 'buy' ? defineAmountError(convertedValue) : defineAmountError((+convertedValue * +price).toString());
    }, [amountPrecision, pricePrecision, side, price, props.handleSetAmount]);

    const handleReceiveChange = React.useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (convertedValue.match(precisionRegExp(side === 'buy' ? amountPrecision : pricePrecision))) {
            setReceiveAmount(convertedValue);
            props.handleSetAmount(side === 'buy' ? 
                Decimal.format(+convertedValue * +price, pricePrecision, '') 
                : Decimal.format(+convertedValue / +price, amountPrecision, ''));
        }

        side === 'buy' ? defineAmountError((+convertedValue * +price).toString()) : defineAmountError(convertedValue);
    }, [amountPrecision, pricePrecision, side, price]);

    const defineAmountError = React.useCallback((value: string) => {
        let error = '';
    
        if (!value) {
            error = translate('page.body.p2p.error.empty.price');
        } else if (Number(value) <= 0) {
            error = translate('page.body.p2p.error.greater.than.0.price');
        } else {
            const available = wallets.find(w => w.currency === currencyCode.toLowerCase())?.balance;
            error = +value < +lowLimit ? `${translate('page.body.p2p.modal.error.min.amount')} ${Decimal.format(lowLimit, pricePrecision, ',')} ${fiatCode}`
                : +value > +topLimit ? `${translate('page.body.p2p.modal.error.max.amount')} ${Decimal.format(topLimit, pricePrecision, ',')} ${fiatCode}`
                : side === 'sell' && available && +value / +price > +available ? translate('page.body.p2p.error.insufficient.funds')
                : '';
        }

        setAmountError(error);
    }, [translate, lowLimit, topLimit, fiatCode, pricePrecision, side, price, wallets, currencyCode]);

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
        ) {
            setShowError(true);
            defineAmountError(tradeAmount.toString());
        } else {
            props.handleSubmit();
        }
    }, [tradeAmount, price, wallets, currencyCode, props.handleSubmit]);

    const handleClickTradeAll = React.useCallback(() => {
        props.handleClickAll();
        setClickAll(true);
    }, [props.handleClickAll]);

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

    const getBalance = useCallback(() => {
        return wallets.find(w => w.currency === currencyCode.toLowerCase())?.balance;
    }, [currencyCode, wallets]);

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
                            handleFocusInput={() => setamountFocused(!amountFocused)}
                            labelVisible={true}
                            showAllButton={true}
                            handleClickAllButton={handleClickTradeAll}
                        />
                        {showError && <span className="error">{amountError}</span>}
                        {side === 'sell' && 
                            <div className="balance">
                                {translate('page.body.p2p.modal.label.balance')}
                                <span className="balance-amount">{Decimal.format(getBalance(), amountPrecision, '')}</span>
                                <span className="balance-currency">{currencyCode.toUpperCase()}</span>
                            </div> 
                        }
                    </div>
                    <div className="cr-order-input__wrapper">
                        <OrderInput
                            currency={side === 'buy' ? currencyCode : fiatCode}
                            label={translate('page.body.p2p.modal.label.receive')}
                            value={receiveAmount}
                            isFocused={false}
                            handleChangeValue={handleReceiveChange}
                            handleFocusInput={() => null}
                            labelVisible={true}
                        />
                    </div>
                    {side === 'sell' &&
                        <div className="payment">
                            <div>{translate('page.body.p2p.modal.button.payment')}</div>
                            <Button>
                                {translate('page.body.p2p.modal.button.payment.add')}
                            </Button>
                        </div>
                    }
                </div>
            </React.Fragment>
        );
    }, [translate, side, currencyCode, fiatCode, advertiserName, price, available, topLimit, lowLimit, timeLimit, description, tradeAmount, amountFocused, amountPrecision, pricePrecision, receiveAmount, showError, wallets, clickAll, props.handleClickAll]);

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
