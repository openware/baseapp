import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { Decimal, formatWithSeparators, Table } from 'src/components';
import { useCurrenciesFetch, useMarketsFetch, useMarketsTickersFetch, useP2PWalletsFetch, useWalletsFetch } from 'src/hooks';
import { selectAbilities, selectCurrencies, selectMarkets, selectMarketTickers, selectP2PCurrenciesData, selectP2PWallets, selectP2PWalletsLoading, selectWallets, selectWalletsLoading, Wallet } from 'src/modules';
import { estimateUnitValue } from 'src/helpers/estimateValue';
import { VALUATION_PRIMARY_CURRENCY } from 'src/constants';
import { WalletsHeader } from 'src/components/WalletsHeader';
import { useHistory } from 'react-router';

interface Props {
    isP2PEnabled: boolean;
}

interface ExtendedWallet extends Wallet {
    spotBalance?: string;
    spotLocked?: string;
    p2pBalance?: string;
    p2pLocked?: string;
}

const OrganizationOverview: FC<Props> = (props: Props): ReactElement => {
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredWallets, setFilteredWallets] = React.useState<ExtendedWallet[]>([]);
    const [mergedWallets, setMergedWallets] = React.useState<ExtendedWallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);

    const { formatMessage } = useIntl();
    const { isP2PEnabled } = props;
    const history = useHistory();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const wallets = useSelector(selectWallets);
    const p2pWallets = useSelector(selectP2PWallets);
    const abilities = useSelector(selectAbilities);
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const p2pCurrencies = useSelector(selectP2PCurrenciesData);
    const walletsLoading = useSelector(selectWalletsLoading);
    const p2pWalletsLoading = useSelector(selectP2PWalletsLoading);

    useWalletsFetch();
    useP2PWalletsFetch();
    useCurrenciesFetch();
    useMarketsTickersFetch();
    useMarketsFetch();

    useEffect(() => {
        if (wallets.length && (isP2PEnabled ? p2pWallets.length : true) && currencies.length) {
            const extendedWallets: ExtendedWallet[] = currencies.map(cur => {
                const spotWallet = wallets.find(i => i.currency === cur.id);
                const p2pWallet = isP2PEnabled ? p2pWallets.find(i => i.currency === cur.id) : null;

                return {
                    ...(spotWallet || p2pWallet),
                    spotBalance: spotWallet ? spotWallet.balance : '0',
                    spotLocked: spotWallet ? spotWallet.locked : '0',
                    p2pBalance: p2pWallet ? p2pWallet.balance : '0',
                    p2pLocked: p2pWallet ? p2pWallet.locked : '0',
                };
            });

            setFilteredWallets(extendedWallets);
            setMergedWallets(extendedWallets);
        }
    }, [wallets, p2pWallets, currencies, isP2PEnabled]);

    const headerTitles = useCallback(() => ([
        translate('page.body.dashboard.asset'),
        translate('page.body.dashboard.totalDailyLimit'),
        translate('page.body.dashboard.available'),
        translate('page.body.dashboard.used'),
        translate('page.body.wallets.overview.header.action'),
    ]), [isP2PEnabled]);

    const handleClickDeposit = useCallback(currency => {
        history.push(`/wallets/spot/${currency}/deposit`);
    }, [history]);

    const handleClickTrade = useCallback(currency => {
        history.push(`/trade/${currency}`);
    }, [history]);

    const retrieveData = React.useCallback(() => {
        const list = nonZeroSelected ? filteredWallets.filter(i => i.balance && Number(i.balance) > 0) : filteredWallets;
        const filteredList = list.filter(i => !filterValue || i.name?.toLocaleLowerCase().includes(filterValue.toLowerCase()) || i.currency?.toLocaleLowerCase().includes(filterValue.toLowerCase()));

        return !filteredList.length ? [[]] : filteredList.map((item, index) => {
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
                <div className="cr-wallets-table__button-wrapper" key={index}>
                    <Button onClick={() => handleClickDeposit(currency)} variant="secondary">
                        {translate('page.body.wallets.overview.action.deposit')}
                    </Button>
                    <Button onClick={() => handleClickTrade(currency)} variant="secondary">
                        {translate('page.body.dashboard.trade')}
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
        <div className="cr-wallets-organization-table">
            <div className="text-center">
                {(walletsLoading || p2pWalletsLoading) && <Spinner animation="border" variant="primary" />}
            </div>
            <div className="cr-wallets-organization-table__table overview">
                <WalletsHeader
                    wallets={mergedWallets}
                    nonZeroSelected={nonZeroSelected}
                    setFilterValue={setFilterValue}
                    setFilteredWallets={setFilteredWallets}
                    handleClickCheckBox={setNonZeroSelected}
                />
                <Table header={headerTitles()} data={retrieveData()}/>
            </div>
        </div>
    );
};

export {
    OrganizationOverview,
};
