import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { Decimal, formatWithSeparators, Table } from 'src/components';
import { useCurrenciesFetch, useMarketsFetch, useMarketsTickersFetch, useWalletsFetch } from 'src/hooks';
import { selectAbilities, selectCurrencies, selectMarkets, selectMarketTickers, selectP2PCurrenciesData, selectWallets, selectWalletsLoading, Wallet } from 'src/modules';
import { estimateUnitValue } from 'src/helpers/estimateValue';
import { VALUATION_PRIMARY_CURRENCY } from 'src/constants';
import { WalletsHeader } from 'src/components/WalletsHeader';
import { useHistory } from 'react-router';

interface ExtendedWallet extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
    p2pBalance?: string;
    p2pLocked?: string;
}

const WalletsOverview: FC = (): ReactElement => {
    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);

    const { formatMessage } = useIntl();
    const history = useHistory();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const wallets = useSelector(selectWallets);
    const abilities = useSelector(selectAbilities);
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const p2pCurrencies = useSelector(selectP2PCurrenciesData);
    const walletsLoading = useSelector(selectWalletsLoading);

    useWalletsFetch();
    useCurrenciesFetch();
    useMarketsTickersFetch();
    useMarketsFetch();

    useEffect(() => {
        if (wallets.length && currencies.length && !filteredWallets.length) {
            const extendedWallets: ExtendedWallet[] = currencies.map(cur => {
                const spotWallet = wallets.find(i => i.currency === cur.id && i.account_type === 'spot');
                const p2pWallet = wallets.find(i => i.currency === cur.id && i.account_type === 'p2p');

                return {
                    ...(spotWallet || p2pWallet),
                    spotBalance: spotWallet ? spotWallet.balance : '0',
                    spotLocked: spotWallet ? spotWallet.locked : '0',
                    p2pBalance: p2pWallet ? p2pWallet.balance : '0',
                    p2pLocked: p2pWallet ? p2pWallet.locked : '0',
                };
            });
            setFilteredWallets(extendedWallets);
        }
    }, [wallets, currencies]);

    const headerTitles = [
        translate('page.body.wallets.overview.header.wallet'),
        translate('page.body.wallets.overview.header.total'),
        translate('page.body.wallets.overview.header.estimated'),
        translate('page.body.wallets.overview.header.spot'),
        translate('page.body.wallets.overview.header.p2p'),
        '',
    ];

    const handleClickDeposit = useCallback(currency => {
        history.push(`/wallets/spot/${currency}/deposit`);
    }, [history]);

    const handleClickWithdraw = useCallback(currency => {
        history.push(`/wallets/spot/${currency}/withdraw`);
    }, [history]);

    const handleClickTransfer = useCallback(currency => {
        history.push(`/wallets/transfer/${currency}`);
    }, [history]);

    const retrieveData = React.useCallback(() => {
        const list = nonZeroSelected ? filteredWallets.filter(i => i.balance && Number(i.balance) > 0) : filteredWallets;

        return !list.length ? [[]] : list.map((item, index) => {
            const {
                currency,
                iconUrl,
                name,
                fixed,
                spotBalance,
                spotLocked,
                p2pBalance,
                p2pLocked,
            } = item;
            const totalBalance = Number(spotBalance) + Number(spotLocked) + Number(p2pBalance) + Number(p2pLocked);
            const estimatedValue = Number(totalBalance) && currency ? estimateUnitValue(currency.toUpperCase(), VALUATION_PRIMARY_CURRENCY, +totalBalance, currencies, markets, tickers) : Decimal.format(0, fixed);

            return [
                <div key={index} className="cr-wallets-table__wallet">
                    {iconUrl ? (
                        <span className="cr-wallets-table__wallet--icon">
                            <img alt={currency?.toUpperCase()} src={iconUrl} />
                        </span>
                    ) : (<CryptoIcon className="cr-wallets-table__wallet--icon" code={currency?.toUpperCase()} />)}
                    <div className="cr-wallets-table__wallet--description">
                        <span className="bold">{currency?.toUpperCase()}</span>
                        <span className="secondary">{name}</span>
                    </div>
                </div>,
                <Decimal key={index} fixed={fixed} thousSep=",">{totalBalance ? totalBalance.toString() : '0'}</Decimal>,
                formatWithSeparators(estimatedValue, ','),
                <Decimal key={index} fixed={fixed} thousSep=",">{spotBalance ? (+spotBalance + +spotLocked).toString() : '0'}</Decimal>,
                <Decimal key={index} fixed={fixed} thousSep=",">{p2pBalance ? (+p2pBalance + +p2pLocked).toString() : '0'}</Decimal>,
                <div className="cr-wallets-table__button-wrapper" key={index}>
                    <Button onClick={() => handleClickDeposit(currency)} variant="secondary">
                        {translate('page.body.wallets.overview.action.deposit')}
                    </Button>
                    <Button onClick={() => handleClickWithdraw(currency)} variant="secondary">
                        {translate('page.body.wallets.overview.action.withdraw')}
                    </Button>
                    <Button onClick={() => handleClickTransfer(currency)} variant="secondary">
                        {translate('page.body.wallets.overview.action.transfer')}
                    </Button>
                </div>,
            ];
        })
    }, [
        filteredWallets,
        nonZeroSelected,
        abilities,
        currencies,
        markets,
        tickers,
        p2pCurrencies,
    ]);

    return (
        <div className="cr-wallets-table">
            <div className="text-center">
                {walletsLoading && <Spinner animation="border" variant="primary" />}
            </div>
            <div className="cr-wallets-table__table overview">
                <WalletsHeader
                    wallets={wallets}
                    nonZeroSelected={nonZeroSelected}
                    setFilteredWallets={setFilteredWallets}
                    handleClickCheckBox={setNonZeroSelected}
                />
                <Table header={headerTitles} data={retrieveData()}/>
            </div>
        </div>
    );
};

export {
    WalletsOverview,
};
