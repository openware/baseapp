import React, { FC, ReactElement, useCallback, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { CryptoIcon } from 'src/components/CryptoIcon';
import { Decimal, formatWithSeparators, Table } from 'src/components';
import { useCurrenciesFetch, useMarketsFetch, useMarketsTickersFetch, useP2PCurrenciesFetch, useWalletsFetch } from 'src/hooks';
import { selectAbilities, selectCurrencies, selectMarkets, selectMarketTickers, selectP2PCurrenciesData, selectWallets, Wallet } from 'src/modules';
import { estimateUnitValue } from 'src/helpers/estimateValue';
import { VALUATION_PRIMARY_CURRENCY } from 'src/constants';
import { WalletsHeader } from 'src/components/WalletsHeader';

interface ParentProps {
    type: string;
    handleClickDeposit?: (value: string) => void;
    handleClickWithdraw?: (value: string) => void;
    handleClickTransfer?: (value: string) => void;
    handleClickP2P?: (value: string) => void;
}

type Props = ParentProps;

const WalletsTable: FC<Props> = (props: Props): ReactElement => {
    const [filteredWallets, setFilteredWallets] = React.useState<Wallet[]>([]);
    const [nonZeroSelected, setNonZeroSelected] = React.useState<boolean>(false);

    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const wallets = useSelector(selectWallets);
    const abilities = useSelector(selectAbilities);
    const currencies = useSelector(selectCurrencies);
    const markets = useSelector(selectMarkets);
    const tickers = useSelector(selectMarketTickers);
    const p2pCurrencies = useSelector(selectP2PCurrenciesData);
    const { type } = props;

    useWalletsFetch();
    useCurrenciesFetch();
    useP2PCurrenciesFetch(type);
    useMarketsTickersFetch();
    useMarketsFetch();

    useEffect(() => {
        if (wallets.length && !filteredWallets.length) {
            setFilteredWallets(wallets);
        }
    }, [wallets]);

    const headerTitles = [
        translate('page.body.wallets.overview.header.wallet'),
        translate('page.body.wallets.overview.header.total'),
        translate('page.body.wallets.overview.header.estimated'),
        translate('page.body.wallets.overview.header.spot'),
        translate('page.body.wallets.overview.header.p2p'),
        '',
    ];

    const retrieveData = React.useCallback(() => {
        const list = nonZeroSelected ? filteredWallets.filter(i => i.balance && Number(i.balance) > 0) : filteredWallets;

        return !list.length ? [[]] : list.map((item, index) => {
            const {
                currency,
                iconUrl,
                name,
                balance,
                fixed,
            } = item;
            const estimatedValue = Number(balance) ? estimateUnitValue(currency.toUpperCase(), VALUATION_PRIMARY_CURRENCY, +balance, currencies, markets, tickers) : Decimal.format(0, fixed);

            return [
                <div key={index} className="cr-wallets-table__wallet">
                    {iconUrl ? (
                        <span className="cr-wallets-table__wallet--icon">
                            <img alt={currency.toUpperCase()} src={iconUrl} />
                        </span>
                    ) : (<CryptoIcon className="cr-wallets-table__wallet--icon" code={currency.toUpperCase()} />)}
                    <div className="cr-wallets-table__wallet--description">
                        <span className="bold">{currency?.toUpperCase()}</span>
                        <span className="secondary">{name}</span>
                    </div>
                </div>,
                <Decimal key={index} fixed={fixed} thousSep=",">{balance ? balance.toString() : '0'}</Decimal>,
                formatWithSeparators(estimatedValue, ','),
                'spotBalance',
                'p2pBalance',
                <div className="cr-wallets-table__button-wrapper" key={index}>
                    {type === 'overview' && props.handleClickDeposit && props.handleClickWithdraw ? (
                        <React.Fragment>
                            <Button onClick={() => props.handleClickDeposit(currency)} variant="secondary">
                                {translate('page.body.wallets.overview.action.deposit')}
                            </Button>
                            <Button onClick={() => props.handleClickWithdraw(currency)} variant="secondary">
                                {translate('page.body.wallets.overview.action.withdraw')}
                            </Button>
                        </React.Fragment>
                    ) : props.handleClickP2P && p2pCurrencies.find(i => i.id === currency.toLowerCase()) && (
                        <Button onClick={() => props.handleClickP2P(currency)} variant="secondary">
                            {translate('page.body.wallets.overview.action.p2p')}
                        </Button>
                    )}
                    <Button onClick={() => props.handleClickTransfer(currency)} variant="secondary">
                        {translate('page.body.wallets.overview.action.transfer')}
                    </Button>
                </div>,
            ];
        })
    }, [
        filteredWallets,
        nonZeroSelected,
        type,
        abilities,
        currencies,
        markets,
        tickers,
        p2pCurrencies,
        props.handleClickTransfer,
        props.handleClickP2P,
        props.handleClickDeposit,
        props.handleClickWithdraw,
    ]);

    return (
        <div className="cr-wallets-table">
            <div className={`cr-wallets-table__table ${type}`}>
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
    WalletsTable,
};
