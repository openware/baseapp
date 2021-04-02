import * as React from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { selectAbilities, Wallet } from '../../modules';
import { CryptoIcon } from '../CryptoIcon';
import { Decimal } from '../Decimal';
import { CanCan } from 'src/containers';

export interface CurrencyInfoProps {
    wallet: Wallet;
    handleClickTransfer?: (value: string) => void;
}

interface CurrencyIconProps {
    icon?: string | null;
    currency: string;
}

export const CurrencyIcon: React.FunctionComponent<CurrencyIconProps> = (props: CurrencyIconProps) => {
    return props.icon ?
        <img alt={props.currency} className="cr-wallet-item__single__image-icon" src={props.icon} /> :
        <CryptoIcon code={props.currency} />;
};

const CurrencyInfo: React.FunctionComponent<CurrencyInfoProps> = (props: CurrencyInfoProps) => {
    const abilities = useSelector(selectAbilities);
    const balance = props.wallet && props.wallet.balance ? props.wallet.balance.toString() : '0';
    const lockedAmount = props.wallet && props.wallet.locked ? props.wallet.locked.toString() : '0';
    const currency = (props.wallet || { currency: '' }).currency.toUpperCase();
    const selectedFixed = (props.wallet || { fixed: 0 }).fixed;

    const stringLocked = lockedAmount ? lockedAmount.toString() : undefined;
    const iconUrl = props.wallet ? props.wallet.iconUrl : null;


    return (
        <div className="cr-wallet-item__single">
            <CurrencyIcon icon={iconUrl} currency={currency}/>
            <div className="cr-wallet-item__single-balance">
                <div>
                    <span className="cr-wallet-item__balance">
                        <FormattedMessage id="page.body.wallets.balance.spot"/>
                    </span>
                    <span className="cr-wallet-item__balance-amount">
                        <Decimal fixed={selectedFixed} thousSep=",">{balance}</Decimal>
                    </span>
                    <span className="cr-wallet-item__currency">
                        {currency}
                    </span>
                </div>
                <div>
                    <span className="cr-wallet-item__balance">
                        <FormattedMessage id="page.body.wallets.balance.available"/>
                    </span>
                    <span className="cr-wallet-item__balance-amount">
                        <Decimal fixed={selectedFixed} thousSep=",">{balance}</Decimal>
                    </span>
                    <span className="cr-wallet-item__currency">
                        {currency}
                    </span>
                </div>
                <div>
                    <div className="cr-wallet-item__amount-locked">
                        <FormattedMessage id="page.body.wallets.locked" />
                    </div>
                    <span className="cr-wallet-item__balance-locked">
                        <Decimal fixed={selectedFixed} thousSep=",">{stringLocked}</Decimal>
                    </span>
                    <span className="cr-wallet-item__currency">
                        {currency}
                    </span>
                </div>
                <div>
                    {CanCan.checkAbilityByAction('read', 'P2P', abilities) && (
                        <Button onClick={() => props.handleClickTransfer(currency)} variant="secondary" size="lg">
                            <FormattedMessage id="page.body.wallets.overview.action.transfer" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export {
    CurrencyInfo,
};
