import * as React from 'react';
import { Wallet, Currency, Market, Ticker } from '../../modules';
import { CryptoIcon } from '../CryptoIcon';
import { Decimal } from '../Decimal';
import { estimateUnitValue } from '../../helpers/estimateValue';
import { VALUATION_PRIMARY_CURRENCY } from 'src/constants';
import { formatWithSeparators } from 'src/components';

const style: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
};

interface WalletItemProps {
    currencies: Currency[];
    tickers:{
        [key: string]: Ticker,
    };
    markets: Market[];
}

type Props = Wallet & WalletItemProps;
/**
 * Component for displaying information about wallet, including address and amount of currency.
 */
export const WalletItem: React.FunctionComponent<Props> = (props: Props) => {
    const {
        currency,
        name,
        balance,
        active,
        fixed,
        iconUrl,
        markets,
        tickers,
        currencies,
    } = props;
    const cName = `cr-wallet-item ${active ? 'cr-wallet-item--active' : ''}`;
    const estimatedValue = Number(balance)
        ? estimateUnitValue(currency.toUpperCase(), VALUATION_PRIMARY_CURRENCY, +balance, currencies, markets, tickers)
        : Decimal.format(0, fixed);

    return (
        <div style={style} className={cName}>
            <div className="cr-wallet-item__info">
                {currency ?
                    iconUrl ?
                        <span className="cr-crypto-icon cr-wallet-item__icon">
                            <img alt={currency.toUpperCase()} src={iconUrl} />
                        </span>
                    : <CryptoIcon className="cr-wallet-item__icon" code={currency.toUpperCase()} />
                : null}
                <div className="cr-wallet-item__description">
                    <span className="cr-wallet-item__description-currency">{currency?.toUpperCase()}</span>
                    <span className="cr-wallet-item__description-name">{name}</span>
                </div>
            </div>
            <span className="cr-wallet-item__balance">
                <Decimal fixed={fixed} thousSep=",">{balance ? balance.toString() : '0'}</Decimal>
                <div className="cr-wallet-item__balance-price">
                    {`≈ $${formatWithSeparators(estimatedValue, ',')}`}
                </div>
            </span>
        </div>
    );
};
