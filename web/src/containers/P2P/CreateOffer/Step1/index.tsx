import classnames from 'classnames';
import React, { FC, ReactElement, useCallback, useEffect, useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { DEFAULT_FIAT_PRECISION } from 'src/constants';
import { cleanPositiveFloatInput, precisionRegExp } from 'src/helpers';
import { Decimal, DropdownComponent, OrderInput, TabPanel } from '../../../../components';
import {
    Currency,
    selectCurrencies,
    selectP2PCurrenciesData,
} from '../../../../modules';

interface ParentProps {
    price: string;
    side: string;
    highestPrice: string;
    asset?: Currency;
    cash?: Currency;
    handleSetSide: (value: string) => void;
    handleSetAsset: (value: Currency | undefined) => void;
    handleSetCash: (value: Currency | undefined) => void;
    handleSetPrice: (value: string) => void;
    handleGoNext: () => void;
}

type Props = ParentProps;

const CreateOfferStepOne: FC<Props> = (props: Props): ReactElement => {
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
    const [assetList, setAssetList] = useState<Currency[]>([]);
    const [cashList, setCashList] = useState<Currency[]>([]);
    const [priceFocused, setPriceFocused] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [priceError, setPriceError] = useState<string>('');

    const { asset, cash, side, price, highestPrice } = props;
    const tabMapping = ['buy', 'sell'];
    const { formatMessage } = useIntl();
    const p2pCurrencies = useSelector(selectP2PCurrenciesData);
    const currencies = useSelector(selectCurrencies);

    useEffect(() => {
        if (p2pCurrencies.length && currencies.length) {
            const fiatCurList = p2pCurrencies.filter(i => i.type === 'fiat').map(i => i.id).map(i => currencies.find(c => c.id === i));
            setCashList(fiatCurList);
            fiatCurList.length && props.handleSetCash(cash || fiatCurList[0]);

            const cryptoCurList = p2pCurrencies.filter(i => i.type === 'coin').map(i => i.id).map(i => currencies.find(c => c.id === i));
            setAssetList(cryptoCurList);
            cryptoCurList.length && props.handleSetAsset(asset || cryptoCurList[0]);
        }
    }, [p2pCurrencies, currencies, props.asset, props.cash]);

    const translate = useCallback((id: string) => formatMessage({ id }), [formatMessage]);

    const onCurrentTabChange = useCallback((index: number) => setCurrentTabIndex(index), []);

    const onTabChange = useCallback((index: number) => {
        if (side === tabMapping[index]) {
            return;
        }
        props.handleSetSide(tabMapping[index]);
    }, [tabMapping, side]);

    const handlePriceChange = useCallback((value: string) => {
        const convertedValue = cleanPositiveFloatInput(String(value));

        if (cash && convertedValue.match(precisionRegExp(cash.precision))) {
            props.handleSetPrice(convertedValue);
        }

        definePriceError(convertedValue);
    }, [cash]);

    const definePriceError = useCallback((value: string) => {
        let error = '';
    
        if (!value) {
            error = translate('page.body.p2p.error.empty.price');
        } else if (!Number(value)) {
            error = translate('page.body.p2p.error.greater.than.0.price');
        }

        setPriceError(error);
    }, [translate]);

    const handleSubmitClick = useCallback(() => {
        if (!price || !Number(price)) {
            setShowError(true);
            definePriceError(price);
        } else {
            props.handleGoNext();
        }
    }, [price]);

    const inputClass = useMemo(() => (
        classnames('cr-create-offer__input', {
            'cr-create-offer__input--errored': showError && priceError,
        })
    ), [showError, priceError]);

    const iconsList = (currenciesList: Currency[]) =>
        currenciesList.map(i => {
            return i?.icon_url ? (
                <span className="cr-crypto-icon cr-wallet-item__icon">
                    <img alt={i?.name.toUpperCase()} src={i?.icon_url} />
                </span>
            ) : (<CryptoIcon className="cr-wallet-item__icon" code={i?.id.toUpperCase()} />);
        });

    const pageContent = useCallback(() => {
        return (
            <div>
                <div className="cr-create-offer__input">
                    <div className="cr-create-offer__dp-label">{translate('page.body.p2p.create.offer.asset')}</div>
                    <DropdownComponent
                        className="cr-create-offer__dp-dropdown"
                        list={assetList.map(i => i?.name)}
                        iconsList={iconsList(assetList)}
                        onSelect={value => props.handleSetAsset(assetList[value])}
                        placeholder={asset?.name}
                    />
                </div>
                <div className="cr-create-offer__input">
                    <div className="cr-create-offer__dp-label">{translate('page.body.p2p.create.offer.cash')}</div>
                    <DropdownComponent
                        className="cr-create-offer__dp-dropdown"
                        list={cashList.map(i => i?.name)}
                        iconsList={iconsList(cashList)}
                        onSelect={value => props.handleSetCash(cashList[value])}
                        placeholder={cash?.name}
                    />
                </div>
                <div className={inputClass}>
                    <OrderInput
                        currency={cash ? cash.id : ''}
                        label={translate('page.body.p2p.create.offer.price')}
                        placeholder="0.00"
                        value={price || ''}
                        isFocused={priceFocused}
                        handleChangeValue={handlePriceChange}
                        handleFocusInput={() => setPriceFocused(!priceFocused)}
                        labelVisible={true}
                    />
                    {showError && <span className="error">{priceError}</span>}
                    {highestPrice ? (
                        <div className="cr-create-offer__info mt-2">
                            <p className="cr-create-offer__info-grey">
                                {translate('page.body.p2p.create.offer.highest_price')}:
                                &nbsp;<span className="bold">{Decimal.format(highestPrice, cash?.precision || DEFAULT_FIAT_PRECISION)} {cash?.id.toUpperCase()}</span>
                            </p>
                        </div>
                     ) : null}
                </div>
                <div className="cr-create-offer__btn-wrapper">
                    <Button
                        onClick={handleSubmitClick}
                        size="lg"
                        variant="primary"
                        className="fullWidth"
                        disabled={!asset || !cash}
                    >
                        {translate('page.body.p2p.create.offer.next_step').toUpperCase()}
                    </Button>
                </div>
            </div>
        )
    }, [asset, assetList, cash, cashList, price, priceFocused, priceError, showError]);

    const renderTabs = useMemo(() => tabMapping.map((i, index) => {
        return {
            content: currentTabIndex === index ? pageContent() : null,
            label: translate(`page.body.p2p.create.offer.${i}`),
        }
    }), [currentTabIndex, tabMapping]);

    return (
        <div className="cr-create-offer">
            <div className="cr-create-offer-tab__tabs-content">
                <TabPanel
                    panels={renderTabs}
                    onTabChange={onTabChange}
                    currentTabIndex={currentTabIndex}
                    onCurrentTabChange={onCurrentTabChange}
                />
            </div>
        </div>
    );
};

export {
    CreateOfferStepOne,
};
