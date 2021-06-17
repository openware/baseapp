import * as React from 'react';
import { GLOBAL_PLATFORM_CURRENCY, DEFAULT_FIAT_PRECISION } from '../../../constants';
import { Decimal } from '../..';
import { useIntl } from 'react-intl';

export interface BeneficiariesBlockchainItemProps {
    blockchainKey: string;
    protocol: string;
    name: string;
    id: string;
    fee: string;
    minWithdraw: string;
    fixed?: number;
    price?: string;
}

export const BeneficiariesBlockchainItem: React.FunctionComponent<BeneficiariesBlockchainItemProps> = (props: BeneficiariesBlockchainItemProps) => {
    const { protocol, name, id, fee, minWithdraw, fixed, price } = props;

    const { formatMessage } = useIntl();

    const estimatedFeeValue = +fee * +price;

    return (
        <div className="cr-beneficiaries-blockchain-item">
            <div className="cr-beneficiaries-blockchain-item-block">
                <h3 className="cr-beneficiaries-blockchain-item__protocol">{protocol?.toUpperCase()}</h3>
                <div>{`${name} (${id.toUpperCase()})`}</div>
                <div className="cr-beneficiaries-blockchain-item__fee">
                    <span>{formatMessage({ id: "page.body.wallets.beneficiaries.network.fee" })}&nbsp;</span>
                    <Decimal fixed={fixed} thousSep=",">{fee?.toString()}</Decimal>{id.toUpperCase()}
                </div>
            </div>
            <div className="cr-beneficiaries-blockchain-item-block">
                <div className="cr-beneficiaries-blockchain-item__withdraw"><span>{formatMessage({ id: "page.body.wallets.beneficiaries.min.withdraw" })}</span> {minWithdraw} {id.toUpperCase()}</div>
                <div>≈<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedFeeValue.toString()}</Decimal> {GLOBAL_PLATFORM_CURRENCY}</div>
            </div>
        </div>
    );
}
