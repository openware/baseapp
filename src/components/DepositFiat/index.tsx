import React, { useMemo } from 'react';
import { useLocalization } from 'src/hooks';

import './index.scss';

export interface DepositFiatProps {
    /**
     * Sets helper description
     */
    description: string;
    /**
     * Sets title describing the data displayed in children
     */
    title: string;
    uid: string;
    blur?: React.ReactNode;
}

/**
 * Component to display bank account details which can be used for a
 * deposit
 */
export const DepositFiat: React.FC<DepositFiatProps> = ({ description, title, uid, blur }) => {
    const getText = useLocalization();

    const bankData = useMemo(() => {
        return [
            {
                key: getText('page.body.wallets.tabs.deposit.fiat.bankName'),
                value: 'Diamant Bank',
            },
            {
                key: getText('page.body.wallets.tabs.deposit.fiat.accountNumber'),
                value: '10120212',
            },
            {
                key: getText('page.body.wallets.tabs.deposit.fiat.accountName'),
                value: 'name',
            },
            {
                key: getText('page.body.wallets.tabs.deposit.fiat.phoneNumber'),
                value: '+3 8093 1212 12 12',
            },
            {
                key: getText('page.body.wallets.tabs.deposit.fiat.referenceCode'),
                value: uid,
            },
        ];
    }, [uid]);

    return (
        <div className="n-deposit-fiat">
            {blur ? <div className="n-deposit-fiat__blur">{blur}</div> : null}
            <div>{title}</div>
            <div>{description}</div>
            <div className="n-deposit-fiat-credentials">
                {bankData.map((detail, index: number) => {
                    return (
                        <div className="n-deposit-fiat-detail" key={index}>
                            <div className="n-deposit-fiat-detail__label">{detail.key}:</div>
                            <div className="n-deposit-fiat-detail__value">{detail.value}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
