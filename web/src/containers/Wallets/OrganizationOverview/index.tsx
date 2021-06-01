import React, { FC, ReactElement, useCallback, useMemo } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { Decimal, Table } from 'src/components';
import { useCurrenciesFetch, useMarketsFetch, useMarketsTickersFetch, useP2PWalletsFetch, useWalletsFetch } from 'src/hooks';
import { selectCurrencies, selectWalletsLoading, Wallet } from 'src/modules';
import { WalletsHeader } from 'src/components/WalletsHeader';
import { useHistory } from 'react-router';
import { DEFAULT_CCY_PRECISION } from 'src/constants';

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
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);

    const { formatMessage } = useIntl();
    const history = useHistory();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const currencies = useSelector(selectCurrencies);
    const walletsLoading = useSelector(selectWalletsLoading);

    useWalletsFetch();
    useP2PWalletsFetch();
    useCurrenciesFetch();
    useMarketsTickersFetch();
    useMarketsFetch();

    const MOCK_ORGANIZATION_WALLETS: Wallet[] = [
        {
            currency: "bch",
            iconUrl: undefined,
            name: "Bitcoin Cash",
            type: "coin",
            fee: 0,
            fixed: 6,
            account_type: 'organization',
            todayLimit: "10.20261901",
            available: "0",
            used: "10.20261901",
        },
        {
            currency: "btc",
            iconUrl: undefined,
            name: "Bitcoin Cash",
            type: "coin",
            fee: 0,
            fixed: 6,
            account_type: 'organization',
            todayLimit: "0.21356898",
            available: "10.20261901",
            used: "10.20261901",
        },
        {
            currency: "eth",
            iconUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
            name: "Bitcoin Cash",
            type: "coin",
            fee: 0,
            fixed: 6,
            account_type: 'organization',
            todayLimit: "10.20261901",
            available: "10.20261901",
            used: "10.20261901",
        },
    ]

    const headerTitles = useMemo(() => ([
        translate('page.body.dashboard.asset'),
        translate('page.body.dashboard.totalDailyLimit'),
        translate('page.body.dashboard.available'),
        translate('page.body.dashboard.used'),
        translate('page.body.wallets.overview.header.action'),
    ]), []);

    const handleClickDeposit = useCallback(currency => {
        history.push(`/wallets/spot/${currency}/deposit`);
    }, [history]);

    const handleClickTrade = useCallback(currency => {
        history.push(`/trade/${currency}`);
    }, [history]);

    const retrieveData = React.useCallback(() => {
        const list = nonZeroSelected ? MOCK_ORGANIZATION_WALLETS.filter(i => i.available && Number(i.available) > 0) : MOCK_ORGANIZATION_WALLETS;
        const filteredList = list.filter(i => !filterValue || i.name?.toLocaleLowerCase().includes(filterValue.toLowerCase()) || i.currency?.toLocaleLowerCase().includes(filterValue.toLowerCase()));

        return !filteredList.length ? [[]] : filteredList.map((item, index) => {
            const {
                currency,
                iconUrl,
                name,
                todayLimit,
                available,
                used,
            } = item;

            const fixed = currencies.find(c => c.id.toLowerCase() ===  currency.toLowerCase())?.precision || DEFAULT_CCY_PRECISION;

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
                <Decimal key={index} fixed={fixed} thousSep=",">{todayLimit ? todayLimit.toString() : '0'}</Decimal>,
                <Decimal key={index} fixed={fixed} thousSep=",">{available ? available.toString() : '0'}</Decimal>,
                <Decimal key={index} fixed={fixed} thousSep=",">{used ? used.toString() : '0'}</Decimal>,
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
        currencies,
    ]);

    return (
        <div className="cr-wallets-organization-table">
            <div className="text-center">
                {walletsLoading && <Spinner animation="border" variant="primary" />}
            </div>
            <div className="cr-wallets-organization-table__table overview">
                <WalletsHeader
                    wallets={MOCK_ORGANIZATION_WALLETS}
                    nonZeroSelected={nonZeroSelected}
                    setFilterValue={setFilterValue}
                    setFilteredWallets={setFilteredWallets}
                    handleClickCheckBox={setNonZeroSelected}
                />
                <Table header={headerTitles} data={retrieveData()}/>
            </div>
        </div>
    );
};

export {
    OrganizationOverview,
};
