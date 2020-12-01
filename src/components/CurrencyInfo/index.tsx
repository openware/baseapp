import React from 'react';

import { CryptoIcon } from '../CryptoIcon';
import { Decimal } from '../Decimal';
import { WalletItemProps } from '../../screens/WalletsScreen/item';
import { useLocalization } from 'src/hooks';

import './index.scss';

interface CurrencyInfoProps {
    wallet: WalletItemProps;
}

const CurrencyInfo: React.FC<CurrencyInfoProps> = ({ wallet: { balance, locked, currency, fixed, iconUrl } }) => {
    const getText = useLocalization();

    return (
        <div className="n-currency-info">
            <CryptoIcon imageUrl={iconUrl} code={currency} className="n-currency-info__currency" />
            <div className="n-currency-info__balance">
                <div>
                    <div className="n-currency-info__balance-label">{getText('page.body.wallets.locked')}</div>
                    <div className="n-currency-info__balance-value">
                        <Decimal fixed={fixed} thousSep=",">
                            {locked}
                        </Decimal>
                    </div>
                </div>
                <div>
                    <div className="n-currency-info__balance-label">{`${currency.toUpperCase()} ${getText(
                        'page.body.wallets.balance'
                    )}`}</div>
                    <div className="n-currency-info__balance-value">
                        <Decimal fixed={fixed} thousSep=",">
                            {balance}
                        </Decimal>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { CurrencyInfo };
