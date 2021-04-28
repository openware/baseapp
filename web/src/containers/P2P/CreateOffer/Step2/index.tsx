import classnames from 'classnames';
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { DeleteIcon } from 'src/assets/images/DeleteIcon';
import { PlusIcon } from 'src/assets/images/PlusIcon';
import { ArrowLeftIcon } from 'src/assets/images/setup/ArrowLeftIcon';
import { HOST_URL, P2P_TIME_LIMIT_LIST } from 'src/constants';
import { cleanPositiveFloatInput, precisionRegExp, truncateMiddle } from 'src/helpers';
import { useP2PWalletsFetch } from 'src/hooks';
import { Decimal, DropdownComponent, OrderInput } from '../../../../components';
import { Currency, UserPaymentMethod, selectPaymentMethodList, Wallet, selectP2PWallets } from '../../../../modules';

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

const CreateOfferStepTwo: FC<Props> = (props: Props): ReactElement => {
    const [amountFocused, setAmountFocused] = useState<boolean>(false);
    const [lowLimitFocused, setLowLimitFocused] = useState<boolean>(false);
    const [topLimitFocused, setTopLimitFocused] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [amountError, setAmountError] = useState<string>('');
    const [lowLimitError, setLowLimitError] = useState<string>('');
    const [paymentMethodError, setPaymentMethodError] = useState<string>('');

    const { asset, cash, side, amount, timeLimit, lowLimit, topLimit, paymentMethods } = props;
    const { formatMessage } = useIntl();
    const history = useHistory();
    const wallets = useSelector(selectP2PWallets);
    const userPM = useSelector(selectPaymentMethodList);

    useP2PWalletsFetch();

    useEffect(() => {
        if (userPM.length && !paymentMethods.length) {
            props.handleSetPaymentMethods([ userPM[0] ]);
        }
    }, [userPM, paymentMethods, props.handleSetPaymentMethods]);

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const getAvailableAsset = useCallback(() => {
        if (asset && wallets.length) {
            const wallet = wallets.find(w => w.currency === asset.id.toLowerCase()) as Wallet;
            return wallet?.balance ? Number(wallet.balance) : 0;
        }
    }, [asset, wallets]);

    const handleSetAllAmount = useCallback(() => {
        handleAmountChange(String(getAvailableAsset()));
    },[asset]);

    const handleAmountChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (asset && convertedValue.match(precisionRegExp(asset.precision))) {
            props.handleSetAmount(convertedValue);
        }

        defineAmountError(convertedValue);
    }, [asset]);

    const handleLowLimitChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (cash && convertedValue.match(precisionRegExp(cash.precision))) {
            props.handleSetLowLimit(convertedValue);
        }
        defineLowLimitError(convertedValue, topLimit);
    }, [cash, topLimit]);

    const handleTopLimitChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (cash && convertedValue.match(precisionRegExp(cash.precision))) {
            props.handleSetTopLimit(convertedValue);
        }
        defineLowLimitError(lowLimit, convertedValue);
    }, [cash, lowLimit]);

    const handleSelectPaymentMethod = React.useCallback((index: number, dpIndex: number) => {
        props.handleUpdatePaymentMethods(pmList(dpIndex)[index], dpIndex);
        definePaymentError(paymentMethods);
    }, [paymentMethods]);

    const defineAmountError = React.useCallback((value: string) => {
        let error = '';
    
        if (!value) {
            error = translate('page.body.p2p.error.empty.amount');
        } else if (Number(value) <= 0) {
            error = translate('page.body.p2p.error.greater.than.0.amount');
        }

        setAmountError(error);
    }, [translate]);

    const defineLowLimitError = React.useCallback((lowLimit: string, topLimit: string) => {
        let error = '';
    
        if (!lowLimit) {
            error = translate('page.body.p2p.error.empty.min.limit');
        } else if (Number(lowLimit) <= 0) {
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
        if (!amount || Number(amount) <= 0 || !lowLimit || Number(lowLimit) <= 0 || +lowLimit > +topLimit || !paymentMethods.length) {
            setShowError(true);
            defineAmountError(amount);
            defineLowLimitError(lowLimit, topLimit);
            definePaymentError(paymentMethods);
        } else {
            props.handleChangeStep(2);
        }
    }, [amount, lowLimit, topLimit, paymentMethods]);

    const inputClass = useCallback((error: string) => (
        classnames('cr-create-offer__input', {
            'cr-create-offer__input--errored': showError && error,
        })
    ), [showError]);

    const iconsList = React.useCallback(() =>
        userPM.map(i => <img className="payment-method-logo ml-2 mr-3 mb-1" src={`${HOST_URL}/api/v2/p2p/public/payment_methods/${i.payment_method_id}/logo`} alt=""/>), [userPM]);

    const renderPMItem = (pm: UserPaymentMethod) => {
        const keyContainsNumber = pm.data && Object.keys(pm.data).find(i => i.includes('number'));
        const numberValue = keyContainsNumber ? truncateMiddle(pm.data[keyContainsNumber], 12, '****') : '';
        return `${pm.payment_method?.name} ${numberValue}`;
    };

    const handleClickDelete = React.useCallback((index: number) => {
        props.handleRemovePaymentMethod(index);
    }, [props.handleRemovePaymentMethod]);

    const handleClickAdd = React.useCallback(() => {
        props.handleSetPaymentMethods([ ...paymentMethods, userPM.filter(el =>  !paymentMethods.includes(el))[0] ]);
    }, [props.handleSetPaymentMethods, paymentMethods, userPM]);

    const pmList = React.useCallback((dpIndex: number) => {
        return userPM.filter(el => paymentMethods[dpIndex] === el || !paymentMethods.includes(el));
    }, [paymentMethods, userPM]);

    const renderDPItem = React.useCallback((_, dpIndex) => {
        return (
            <React.Fragment key={dpIndex}>
                <div className="cr-create-offer__dp-label">{translate('page.body.p2p.create.offer.payment_method')}</div>
                <div className="payment-method">
                    <div className="payment-method__dp">
                        <DropdownComponent
                            key={dpIndex}
                            className="cr-create-offer__dp-dropdown"
                            list={pmList(dpIndex).map(renderPMItem)}
                            iconsList={iconsList()}
                            onSelect={index => handleSelectPaymentMethod(index, dpIndex)}
                            placeholder={renderPMItem(paymentMethods[dpIndex])}
                        />
                    </div>
                    {(dpIndex === paymentMethods.length - 1) || (paymentMethods.length === 1) ? userPM.length > paymentMethods.length && (
                        <div className="payment-method__btn-wrapper">
                            <Button
                                onClick={() => handleClickAdd()}
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
    }, [userPM, paymentMethods]);

    return (
        <div className="cr-create-offer">
            <div className="form-padding">
                <div className={inputClass(amountError)}>
                    <OrderInput
                        currency={asset ? asset.id : ''}
                        label={translate('page.body.p2p.create.offer.amount')}
                        placeholder="0.00"
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
                                {Decimal.format(getAvailableAsset(), asset.precision, ',')}&nbsp;
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
                                placeholder="0.00"
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
                            placeholder="0.00"
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
                    {userPM.length ? Array.from(Array(paymentMethods.length).keys()).map(renderDPItem) : (
                        <React.Fragment>
                            <div className="cr-create-offer__dp-label">{translate('page.body.p2p.create.offer.payment_method')}</div>
                            <div>
                                <Button
                                    onClick={() => history.push('/profile/payment')}
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
    CreateOfferStepTwo,
};
