import * as React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Withdraw } from '../../../containers';
import { useBeneficiariesFetch, useWalletsAddressFetch } from '../../../hooks';
import { selectUserInfo } from '../../../modules/user/profile';
// import { walletsWithdrawCcyFetch } from '../../../modules/user/wallets';

const WalletWithdrawBodyComponent = props => {
    const [withdrawDone] = React.useState(false);
    const intl = useIntl();
    const user = useSelector(selectUserInfo);
    const { currency, fee, type } = props.wallet;
    const fixed = (props.wallet || { fixed: 0 }).fixed;
    const withdrawAmountLabel = React.useMemo(() => intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }), [intl]);
    const withdraw2faLabel = intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' });
    const withdrawFeeLabel = intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' });
    const withdrawTotalLabel = intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' });
    const withdrawButtonLabel = intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' });

    const isTwoFactorAuthRequired = (level: number, is2faEnabled: boolean) => {
        return level > 1 || (level === 1 && is2faEnabled);
    };

    useWalletsAddressFetch(currency);
    useBeneficiariesFetch();

    return (
        <div className="cr-mobile-wallet-withdraw-body">
            <Withdraw
                currency={currency}
                fee={fee}
                onClick={() => ({}) as any}
                fixed={fixed}
                isMobile
                withdrawAmountLabel={withdrawAmountLabel}
                withdraw2faLabel={withdraw2faLabel}
                withdrawFeeLabel={withdrawFeeLabel}
                withdrawTotalLabel={withdrawTotalLabel}
                withdrawButtonLabel={withdrawButtonLabel}
                twoFactorAuthRequired={isTwoFactorAuthRequired(user.level, user.otp)}
                type={type}
                withdrawDone={withdrawDone}
            />
        </div>
    );
};

const WalletWithdrawBody = React.memo(WalletWithdrawBodyComponent);

export {
    WalletWithdrawBody,
};
