import * as React from 'react';

export interface BeneficiariesBlockchaninItemProps {
    blockchainKey: string;
    estimatedValue: string;
    protocol: string;
    name: string;
    id: string;
    fee: string;
    minWithdraw: string;
}

export const BeneficiariesBlockchaninItem = (props: BeneficiariesBlockchaninItemProps) => {
    const { estimatedValue, protocol, name, id, fee, minWithdraw } = props;

    return (
        <div className="cr-beneficiaries-blockchain-item">
            <div className="cr-beneficiaries-blockchain-item-block">
                <h3 className="cr-beneficiaries-blockchain-item__protocol">{protocol?.toUpperCase()}</h3>
                <div>{`${name} (${id.toUpperCase()})`}</div>
                <div className="cr-beneficiaries-blockchain-item__fee"><span>Network Fee</span> {fee} {id.toUpperCase()}</div>
            </div>
            <div className="cr-beneficiaries-blockchain-item-block">
                <div className="cr-beneficiaries-blockchain-item__withdraw"><span>Min. withdraw:</span> {minWithdraw} {id.toUpperCase()}</div>
                <div>≈{estimatedValue} USDT</div>
            </div>
        </div>
    );
}