import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { Decimal, Table } from 'src/components';
import { useCurrenciesFetch, useMarketsFetch, useMarketsTickersFetch, useP2PCurrenciesFetch, useP2PWalletsFetch } from 'src/hooks';
import { selectAbilities, selectCurrencies, selectMarkets, selectMarketTickers, selectP2PCurrenciesData, selectP2PWallets, selectWalletsLoading, Wallet } from 'src/modules';
import { WalletsHeader } from 'src/components/WalletsHeader';
import { useHistory } from 'react-router';

const WalletsP2P: FC = (): ReactElement => {
    const [filterValue, setFilterValue] = React.useState<string>('');
    const [filteredWallets, setFilteredWallets] = React.useState<Wallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);

    const { formatMessage } = useIntl();
    const history = useHistory();

    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const wallets = useSelector(selectP2PWallets);
    const abilities = useSelector(selectAbilities);
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const p2pCurrencies = useSelector(selectP2PCurrenciesData);
    const walletsLoading = useSelector(selectWalletsLoading);

    useP2PWalletsFetch();
    useCurrenciesFetch();
    useP2PCurrenciesFetch();
    useMarketsTickersFetch();
    useMarketsFetch();

    useEffect(() => {
        setFilteredWallets(wallets);
    }, [wallets]);

    const headerTitles = [
        translate('page.body.wallets.p2p.header.wallet'),
        translate('page.body.wallets.p2p.header.p2p'),
        translate('page.body.wallets.p2p.header.available'),
        translate('page.body.wallets.p2p.header.locked'),
        '',
    ];

    const handleClickP2P = useCallback(currency => {
        history.push(`/p2p/${currency}`);
    }, [history]);

    const handleClickTransfer = useCallback(currency => {
        history.push(`/wallets/transfer/${currency}`);
    }, [history]);

    const retrieveData = React.useCallback(() => {
        const list = nonZeroSelected ? filteredWallets.filter(i => i.currency && i.balance && Number(i.balance) > 0) : filteredWallets.filter(i => i.currency);
        const filteredList = list.filter(i => !filterValue || i.name?.toLocaleLowerCase().includes(filterValue.toLowerCase()) || i.currency?.toLocaleLowerCase().includes(filterValue.toLowerCase()));

        return !filteredList.length ? [[]] : filteredList.map((item, index) => {
            const {
                currency,
                iconUrl,
                name,
                balance,
                locked,
                fixed,
            } = item;

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
                <Decimal key={index} fixed={fixed} thousSep=",">{balance && locked ? (+balance + +locked).toString() : '0'}</Decimal>,
                <Decimal key={index} fixed={fixed} thousSep=",">{balance ? balance.toString() : '0'}</Decimal>,
                <Decimal key={index} fixed={fixed} thousSep=",">{locked ? locked.toString() : '0'}</Decimal>,
                <div className="cr-wallets-table__button-wrapper" key={index}>
                    {p2pCurrencies.find(i => i.id === currency?.toLowerCase()) && (
                        <Button onClick={() => handleClickP2P(currency)} variant="secondary">
                            {translate('page.body.wallets.overview.action.p2p')}
                        </Button>
                    )}
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
            <div className="cr-wallets-table__table p2p">
                <WalletsHeader
                    wallets={wallets}
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
    WalletsP2P,
};
