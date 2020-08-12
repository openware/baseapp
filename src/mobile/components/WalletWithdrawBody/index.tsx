import * as React from 'react';
import { Withdraw } from '../../../containers';

const WalletWithdrawBodyComponent = props => {
    const { currency, fee, type } = props.wallet;
    const fixed = (props.wallet || { fixed: 0 }).fixed;

    return (
        <div className="cr-mobile-wallet-withdraw-body">
            <Withdraw
                currency={currency}
                fee={fee}
                onClick={() => ({}) as any}
                fixed={fixed}
                type={type}
                withdrawDone={false}/>
        </div>
    );
};

const WalletWithdrawBody = React.memo(WalletWithdrawBodyComponent);

export {
    WalletWithdrawBody,
};
