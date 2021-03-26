import classnames from 'classnames';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { DeleteIcon } from 'src/assets/images/DeleteIcon';
import { PlusIcon } from 'src/assets/images/PlusIcon';
import { ArrowLeftIcon } from 'src/assets/images/setup/ArrowLeftIcon';
import { P2P_TIME_LIMIT_LIST } from 'src/constants';
import { cleanPositiveFloatInput, precisionRegExp, truncateMiddle } from 'src/helpers';
import { Decimal, DropdownComponent, OrderInput } from '../../../components';
import { Currency, UserPaymentMethod, selectPaymentMethodList, selectWallets, Wallet } from '../../../modules';

interface ParentProps {
    amount: string;
    side: string;
    timeLimit: string;
    paymentMethods: UserPaymentMethod[];
    lowLimit: string;
    topLimit: string;
    asset?: Currency;
    cash?: Currency;
    handleSetAmount: (value: string) => void;
    handleSetTimeLimit: (value: string) => void; 
    handleChangeStep: (value: number) => void;
    handleUpdatePaymentMethods: (value: UserPaymentMethod, index: number) => void; 
    handleSetLowLimit: (value: string) => void;
    handleSetTopLimit: (value: string) => void;
    handleRemovePaymentMethod: (index: number) => void;
    handleSetPaymentMethods: (value: UserPaymentMethod[]) => void;
}

type Props = ParentProps;

const CreateOfferStep2: FC<Props> = (props: Props): ReactElement => {
    const [amountFocused, setAmountFocused] = useState<boolean>(false);
    const [lowLimitFocused, setLowLimitFocused] = useState<boolean>(false);
    const [topLimitFocused, setTopLimitFocused] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [amountError, setAmountError] = useState<string>('');
    const [lowLimitError, setLowLimitError] = useState<string>('');
    const [paymentMethodError, setPaymentMethodError] = useState<string>('');
    const [pmLength, setPMLength] = useState<number>(0);

    const { asset, cash, side, amount, timeLimit, lowLimit, topLimit, paymentMethods } = props;
    const { formatMessage } = useIntl();

    const wallets = useSelector(selectWallets);
    const userPM = useSelector(selectPaymentMethodList);

    useEffect(() => {
        if (userPM.length && !paymentMethods.length) {
            props.handleSetPaymentMethods([ userPM[0] ]);
            setPMLength(1);
        }
    }, [userPM, paymentMethods, props.handleSetPaymentMethods]);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    const getAvailableAsset = useCallback((asset?: Currency) => {
        if (asset && wallets.length) {
            const wallet = wallets.find(w => w.currency === asset.id.toLowerCase()) as Wallet;
            return wallet?.balance ? Number(wallet.balance) : 0;
        }
    }, [asset, wallets]);

    const handleSetAllAmount = useCallback(() => {
        handleAmountChange(String(getAvailableAsset(asset)));
    },[asset]);

    const handleAmountChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (asset && convertedValue.match(precisionRegExp(asset.precision))) {
            props.handleSetAmount(convertedValue);
        }

        defineAmountError(convertedValue);
    }, [asset, props.handleSetAmount]);

    const handleLowLimitChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (cash && convertedValue.match(precisionRegExp(cash.precision))) {
            props.handleSetLowLimit(convertedValue);
        }
        defineLowLimitError(convertedValue, topLimit);
    }, [cash, topLimit, props.handleSetLowLimit]);

    const handleTopLimitChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (cash && convertedValue.match(precisionRegExp(cash.precision))) {
            props.handleSetTopLimit(convertedValue);
        }
        defineLowLimitError(lowLimit, convertedValue);
    }, [cash, lowLimit, props.handleSetTopLimit]);

    const handleSelectPaymentMethod = React.useCallback((index: number, offerIndex: number) => {
        props.handleUpdatePaymentMethods(userPM[index], offerIndex);
        definePaymentError(paymentMethods);
    }, [userPM, props.handleUpdatePaymentMethods]);

    const defineAmountError = React.useCallback((value: string) => {
        let error = '';
    
        if (!value) {
            error = translate('page.body.p2p.error.empty.amount');
        } else if (!Number(value)) {
            error = translate('page.body.p2p.error.greater.than.0.amount');
        }

        setAmountError(error);
    }, [translate]);

    const defineLowLimitError = React.useCallback((lowLimit: string, topLimit: string) => {
        let error = '';
    
        if (!lowLimit) {
            error = translate('page.body.p2p.error.empty.min.limit');
        } else if (!Number(lowLimit)) {
            error = translate('page.body.p2p.error.greater.than.0.min.limit');
        } else if (+lowLimit > +topLimit) {
            error = translate('page.body.p2p.error.min.limit.exceed.max');            
        }

        setLowLimitError(error);
    }, [translate]);

    const definePaymentError = React.useCallback((list: UserPaymentMethod[]) => {
        let error = '';
    
        if (!list.length) {
            error = translate('page.body.p2p.error.empty.payment.method');
        }

        setPaymentMethodError(error);
    }, [translate]);

    const handleSubmitClick = React.useCallback(() => {
        if (!amount || !Number(amount) || !lowLimit || !Number(lowLimit) || +lowLimit > +topLimit || !paymentMethods.length) {
            setShowError(true);
            defineAmountError(amount);
            defineLowLimitError(lowLimit, topLimit);
            definePaymentError(paymentMethods);
        } else {
            props.handleChangeStep(2);
        }
    }, [amount, lowLimit, topLimit, paymentMethods, props.handleChangeStep]);

    const inputClass = useCallback((error: string) => (
        classnames('cr-create-offer__input', {
            'cr-create-offer__input--errored': showError && error,
        })
    ), [showError]);

    const iconsList = React.useCallback(() =>
        userPM.map(i => <img className="ml-2 mr-3 mb-1" src={`data:image/png;base64,${i.logo}`} alt=""/>), [userPM]);

    const renderPMItem = pm => {
        const keyContainsNumber = pm.data && Object.keys(pm.data).find(i => i.includes('number'));
        const numberValue = keyContainsNumber ? truncateMiddle(pm.data[keyContainsNumber], 8, '***') : '';
        return `${pm.name} ${numberValue}`;
    };

    const handleClickDelete = React.useCallback((index: number) => {
        props.handleRemovePaymentMethod(index);
        setPMLength(pmLength - 1);

    }, [pmLength, props.handleRemovePaymentMethod]);

    const handleClickAdd = React.useCallback(() => {
        setPMLength(pmLength + 1);
        props.handleSetPaymentMethods([ ...paymentMethods, userPM[0] ]);
    }, [pmLength, props.handleSetPaymentMethods, paymentMethods, userPM]);

    const renderDPItem = React.useCallback((_, dpIndex) => {
        return (
            <React.Fragment key={dpIndex}>
                <div className="cr-create-offer__dp-label">{translate('page.body.p2p.create.offer.payment_method')}</div>
                <div className="payment-method">
                    <div className="payment-method__dp">
                        <DropdownComponent
                            key={dpIndex}
                            className="cr-create-offer__dp-dropdown"
                            list={userPM.map(renderPMItem)}
                            iconsList={iconsList()}
                            onSelect={index => handleSelectPaymentMethod(index, dpIndex)}
                            placeholder={renderPMItem(userPM[dpIndex])}
                        />
                    </div>
                    {(dpIndex === pmLength - 1) || (pmLength === 1) ? userPM.length > pmLength && (
                        <div className="payment-method__btn-wrapper">
                            <Button
                                onClick={handleClickAdd}
                                size="lg"
                                variant="outline-primary"
                            >
                                <span>{translate('page.body.p2p.create.offer.add')}</span>
                                <PlusIcon className="icon"/>
                            </Button>
                        </div>
                    ) : (
                        <div className="payment-method__btn-wrapper">
                            <Button
                                onClick={() => handleClickDelete(dpIndex)}
                                size="lg"
                                variant="outline-primary"
                            >
                                <span>{translate('page.body.p2p.create.offer.del')}</span>
                                <DeleteIcon className="icon"/>
                            </Button>
                        </div>
                    )}
                </div>
            </React.Fragment>
        )
    }, [userPM, pmLength]);

    return (
        <div className="cr-create-offer">
            <div className="form-padding">
                <div className={inputClass(amountError)}>
                    <OrderInput
                        currency={asset ? asset.id : ''}
                        label={translate('page.body.p2p.create.offer.amount')}
                        placeholder="00.00"
                        value={amount || ''}
                        isFocused={amountFocused}
                        handleChangeValue={handleAmountChange}
                        handleFocusInput={() => setAmountFocused(!amountFocused)}
                        labelVisible={true}
                        autoFocus={true}
                    />
                    {showError && <span className="error">{amountError}</span>}
                    {asset && side === 'sell' ? (
                        <div className="cr-create-offer__info available">       
                            <label className="cr-create-offer__info-grey">
                                {translate('page.body.trade.header.newOrder.content.available')}:&nbsp;
                            </label>
                            <span className="cr-create-offer__info-dark">
                                {Decimal.format(getAvailableAsset(asset), asset.precision, ',')}&nbsp;
                            </span>
                            <span className="cr-create-offer__info-grey">
                                {asset.id?.toUpperCase()}&nbsp;
                            </span>
                            <span className="cr-create-offer__info__btn" onClick={handleSetAllAmount}>
                                {translate('page.body.p2p.create.offer.all')}
                            </span>
                    </div>
                    ) : null}
                </div>
                <div className={inputClass(lowLimitError)}>
                    <div className="cr-create-offer__orderLimit">
                        <div>
                            <OrderInput
                                currency={cash ? cash.id : ''}
                                label={translate('page.body.p2p.create.offer.order_limit')}
                                placeholder="00.00"
                                value={lowLimit || ''}
                                isFocused={lowLimitFocused}
                                handleChangeValue={handleLowLimitChange}
                                handleFocusInput={() => setLowLimitFocused(!amountFocused)}
                                labelVisible={true}
                            />
                            {showError && <span className="error">{lowLimitError}</span>}
                        </div>
                        <span className="approximate">&#8764;</span>
                        <OrderInput
                            currency={cash ? cash.id : ''}
                            placeholder="00.00"
                            value={topLimit || ''}
                            isFocused={topLimitFocused}
                            handleChangeValue={handleTopLimitChange}
                            handleFocusInput={() => setTopLimitFocused(!amountFocused)}
                        />
                    </div>
                </div>
                <div className="cr-create-offer__input">
                    <div className="cr-create-offer__info">
                        <p className="cr-create-offer__info-grey">
                            {translate('page.body.p2p.create.offer.select_2_label')}
                        </p>
                    </div>
                    {userPM.length ? Array.from(Array(pmLength).keys()).map(renderDPItem) : (
                        <React.Fragment>
                            <div className="cr-create-offer__dp-label">{translate('page.body.p2p.create.offer.payment_method')}</div>
                            <div>
                                <Button
                                    onClick={() => window.console.log('add')}
                                    size="lg"
                                    variant="outline-primary"
                                >
                                    <span>{translate('page.body.p2p.create.offer.payment_method.add')}</span>
                                    <PlusIcon className="icon"/>
                                </Button>
                                {showError && <span className="error">{paymentMethodError}</span>}
                            </div>
                        </React.Fragment>
                    )}
                </div>
                <div className="cr-create-offer__input">
                    <div className="cr-create-offer__dp-label">{translate('page.body.p2p.create.offer.time_limit')}</div>
                    <DropdownComponent
                        className="cr-create-offer__dp-dropdown"
                        list={P2P_TIME_LIMIT_LIST}
                        onSelect={value => props.handleSetTimeLimit(P2P_TIME_LIMIT_LIST[value])}
                        placeholder={timeLimit}
                    />
                </div>
                <div className="cr-create-offer__btn-wrapper__grid">
                    <Button
                        onClick={() => props.handleChangeStep(0)}
                        size="lg"
                        variant="secondary"
                    >
                        <ArrowLeftIcon className="icon-left" />
                        <span>{translate('page.body.p2p.create.offer.back')}</span>
                    </Button>
                    <Button
                        onClick={handleSubmitClick}
                        size="lg"
                        variant="primary"
                        disabled={!asset || !cash}
                    >
                        {translate('page.body.p2p.create.offer.next_step').toUpperCase()}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export {
    CreateOfferStep2,
};
