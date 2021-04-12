import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { DoubleDropdownSelector, TransferForm, WalletList } from 'src/components';
import { useCurrenciesFetch, useMarketsFetch, useMarketsTickersFetch, useP2PCurrenciesFetch, useWalletsFetch } from 'src/hooks';
import {
    createP2PTransfersFetch,
    selectCurrencies,
    selectMarkets,
    selectMarketTickers,
    selectP2PCurrenciesData,
    selectWallets,
    selectWalletsLoading,
    Wallet,
} from 'src/modules';
import { WalletsHeader } from 'src/components/WalletsHeader';
import { useHistory } from 'react-router';
import { TRANSFER_TYPES_LIST } from 'src/constants';

interface ParentProps {
    currency?: string;
}

type Props = ParentProps;

const WalletsTransfer: FC<Props> = (props: Props): ReactElement => {
    const [filteredWallets, setFilteredWallets] = useState<Wallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = useState<boolean>(false);
    const [selWalletIndex, setSelWalletIndex] = useState<number>(-1);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [from, setFrom] = useState<string>('Spot');
    const [to, setTo] = useState<string>('P2P');

    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

    const history = useHistory();
    const dispatch = useDispatch();
    const wallets = useSelector(selectWallets);
    const walletsLoading = useSelector(selectWalletsLoading);
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);

    const { currency } = props;

    useWalletsFetch();
    useCurrenciesFetch();
    useP2PCurrenciesFetch();
    useMarketsTickersFetch();
    useMarketsFetch();

    useEffect(() => {
        if (wallets.length && selWalletIndex === -1) {
            const walletToSet = wallets.find(i => i.currency?.toLowerCase() === currency?.toLowerCase()) || wallets[0];
            setSelWalletIndex(wallets.indexOf(walletToSet));
            setActiveIndex(wallets.indexOf(walletToSet));

            if (walletToSet?.currency && currency !== walletToSet?.currency) {
                history.push(`/wallets/transfer/${walletToSet.currency.toLowerCase()}`);
            }
        }
    }, [wallets, history]);

    useEffect(() => {
        if (wallets.length) {
            setFilteredWallets(wallets.filter(i => i.account_type === from.toLowerCase()));
        }
    }, [wallets, from]);

    const onWalletSelectionChange = useCallback((value: Wallet) => {
        const nextWalletIndex = wallets.findIndex(
            wallet => wallet.currency.toLowerCase() === value.currency.toLowerCase()
        );

        setSelWalletIndex(nextWalletIndex);

        history.push(`/wallets/transfer/${value.currency.toLowerCase()}`);
    }, [wallets, history]);


    const formattedWallets = useCallback(() => {
        const list = nonZeroSelected ? filteredWallets.filter(i => i.balance && Number(i.balance) > 0) : filteredWallets;

        return list.map((wallet: Wallet) => ({
            ...wallet,
            currency: wallet.currency.toUpperCase(),
            iconUrl: wallet.iconUrl ? wallet.iconUrl : '',
        }));
    }, [filteredWallets, nonZeroSelected]);

    const handleTransfer = useCallback((currency: string, amount: string) => {
        const payload = {
            currency: currency,
            amount,
            from: from.toLowerCase(),
            to: to.toLowerCase(),
        };

        dispatch(createP2PTransfersFetch(payload));
    }, [from, to]);

    return (
        <div className="pg-wallet-transfers">
            <div className="pg-wallet">
                <div className="text-center">
                    {walletsLoading && <Spinner animation="border" variant="primary" />}
                </div>
                <div className="row no-gutters pg-wallet__tabs-content pg-wallet__tabs-content-height">
                    <div className={`col-md-3 col-sm-12 col-12`}>
                        <div className="pg-wallet-transfers__header">
                            <div className="pg-wallet-transfers__header-title">{translate('page.body.wallets.transfers.transferType')}</div>
                            <DoubleDropdownSelector
                                from={from}
                                to={to}
                                handleSelectFrom={setFrom}
                                handleSelectTo={setTo}
                                typesArray={TRANSFER_TYPES_LIST}
                            />
                        </div>
                        <WalletsHeader
                            wallets={wallets}
                            nonZeroSelected={nonZeroSelected}
                            setFilteredWallets={setFilteredWallets}
                            handleClickCheckBox={setNonZeroSelected}
                        />
                        <WalletList
                            onWalletSelectionChange={onWalletSelectionChange}
                            walletItems={formattedWallets()}
                            activeIndex={activeIndex}
                            onActiveIndexChange={setActiveIndex}
                            currencies={currencies}
                            markets={markets}
                            tickers={tickers}
                        />
                    </div>
                    <div className={`pg-wallet-transfers__content col-md-7 col-sm-12 col-12`}>
                        <div className="pg-wallet-transfers__header-title">{translate('page.body.wallets.transfers.transferDetails')}</div>
                        <TransferForm
                            wallet={formattedWallets()[activeIndex]}
                            handleSubmit={handleTransfer}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export {
    WalletsTransfer,
};
