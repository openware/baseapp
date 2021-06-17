import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { OverlayTrigger } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
    selectCurrencies,
    selectBeneficiaries,
    Beneficiary,
    Currency,
    BlockchainCurrencies,
} from '../../../modules';
import { TrashBin } from '../../../assets/images/TrashBin';
import { GLOBAL_PLATFORM_CURRENCY, DEFAULT_FIAT_PRECISION } from '../../../constants';
import { Decimal, Tooltip  } from '../../../components';
import { TipIcon } from '../../../assets/images/TipIcon';

interface SelectBeneficiariesCryptoProps {
    blockchainKey: string;
    currency: string;
    handleClickSelectAddress: (item: Beneficiary) => () => void;
    handleDeleteAddress: (item: Beneficiary) => () => void;
}

export const SelectBeneficiariesCrypto: React.FunctionComponent<SelectBeneficiariesCryptoProps> = (props: SelectBeneficiariesCryptoProps) => {
    const { currency, blockchainKey } = props;

    const { formatMessage } = useIntl();

    const currencies = useSelector(selectCurrencies);
    const beneficiaries: Beneficiary[] = useSelector(selectBeneficiaries);
    const currencyItem: Currency = currencies.find(item => item.id === currency);
    const blockchainItem: BlockchainCurrencies = currencyItem?.networks.find(item => item.blockchain_key === blockchainKey);
    const estimatedValueFee = +currencyItem?.price * +blockchainItem?.withdraw_fee;


    const renderBeneficiaryItem = React.useCallback((item, index) => {
        const isPending = item.state && item.state.toLowerCase() === 'pending';
        const itemClassName = classnames('pg-beneficiaries__dropdown__body__item', 'item', {
            'item--pending': isPending,
        });

        if (item.blockchain_key === blockchainKey) {
            return (
                <div key={index} className={itemClassName}>
                    <div className="item__left" onClick={props.handleClickSelectAddress(item)}>
                        <span className="item__left__title">
                            {item.name}
                        </span>
                        <span className="item__left__address">
                            {item.data?.address}
                        </span>
                    </div>
                    <div className="item__right">
                        {isPending ? (
                            <span className="item__right__pending">
                                {formatMessage({ id:'page.body.wallets.beneficiaries.dropdown.pending' })}
                            </span>
                        ) : null}
                        <span className="item__right__tip">
                            <OverlayTrigger
                                placement="left"
                                delay={{ show: 250, hide: 300 }}
                                overlay={<Tooltip title="page.body.wallets.tabs.deposit.ccy.tip" />}>
                                <div className="cr-withdraw__group__warning-tip">
                                    <TipIcon />
                                </div>
                            </OverlayTrigger>
                        </span>
                        <span className="item__right__delete" onClick={props.handleDeleteAddress(item)}>
                            <TrashBin></TrashBin>
                        </span>
                    </div>
                </div>
            );
        };

        return null;
    }, [beneficiaries])

    return (
            <div className="cr-beneficiary-blockchain-item" key={blockchainKey}>
                <div className="cr-withdraw__group__blockchain-item">
                    <div className="cr-withdraw-blockchain-item">
                        <div className="cr-withdraw-blockchain-item__group">
                            <div className="cr-withdraw-blockchain-item-block">
                                <h3 className="cr-withdraw-blockchain-item__blockchain_key">{currencyItem?.name} ({currencyItem?.id.toUpperCase()})</h3>
                                <div className="cr-withdraw-blockchain-item__withdraw">{blockchainItem?.protocol?.toUpperCase()}</div>
                            </div>
                            <div className="cr-withdraw-blockchain-item-block">
                                <div className="cr-withdraw-blockchain-item__fee">
                                    <span>{formatMessage({ id: 'page.body.wallets.beneficiaries.fee' })}&nbsp;</span><Decimal fixed={currencyItem?.precision} thousSep=",">{blockchainItem?.withdraw_fee?.toString()}</Decimal>
                                    &nbsp;{currency.toUpperCase()}
                                </div>
                                <div className="cr-withdraw-blockchain-item__estimated-value">
                                    ≈<Decimal fixed={DEFAULT_FIAT_PRECISION} thousSep=",">{estimatedValueFee.toString()}</Decimal>
                                    &nbsp;{GLOBAL_PLATFORM_CURRENCY}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pg-beneficiaries__dropdown__body__group">
                    {beneficiaries.map(renderBeneficiaryItem)}
                </div>
            </div>
    );
}
