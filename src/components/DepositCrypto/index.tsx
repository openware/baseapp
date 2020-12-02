import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { alertPush, selectMobileDeviceState } from '../../modules';
import { CopyableTextField } from '../CopyableTextField';
import { MetaMaskButton } from '../MetaMaskButton';
import { QRCode } from '../QRCode';

import './index.scss';

interface Props {
    /**
     * Current deposit crypto currency
     */
    currency: string;
    /**
     * Data which is used to generate QR code
     */
    data: string;
    /**
     * Data which is used to display error if data is undefined
     */
    error: string;
    /**
     * Defines the size of QR code component.
     * @default 118
     */
    dimensions?: number;
    /**
     *  Renders text of a component
     */
    text?: string;
    /**
     * @default 'Deposit by Wallet Address'
     * Renders text of the label of CopyableTextField component
     */
    copiableTextFieldText?: string;
    /**
     * @default 'Copy'
     *  Renders text of the label of copy button component
     */
    copyButtonText?: string;

    blur?: React.ReactNode;
}

const QR_SIZE = 118;
/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
const DepositCrypto: React.FC<Props> = ({
    copiableTextFieldText,
    copyButtonText,
    currency,
    data,
    dimensions = QR_SIZE,
    error,
    text,
    blur,
}) => {
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const dispatch = useDispatch();

    const handleOnCopy = useCallback(() => {
        dispatch(alertPush({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' }));
    }, []);

    return (
        <div className="n-deposit-crypto">
            {blur ? <div className="n-deposit-crypto__blur">{blur}</div> : null}
            <div className="n-deposit-crypto__qa">
                <div className="n-deposit-crypto__qa-text">{text}</div>
                {data ? (
                    <div className="n-deposit-crypto__qa-code">
                        <QRCode dimensions={dimensions} data={data} />
                    </div>
                ) : null}
            </div>
            <div className="n-deposit-crypto__address">
                {currency === 'eth' && !isMobileDevice ? (
                    <MetaMaskButton className="n-deposit-crypto__metamask" depositAddress={data} />
                ) : null}
                <CopyableTextField
                    className="n-deposit-crypto__copy"
                    value={data ? data : error}
                    copyButtonText={copyButtonText}
                    disabled={!data}
                    label={copiableTextFieldText ? copiableTextFieldText : 'Deposit by Wallet Address'}
                    afterCopy={handleOnCopy}
                />
            </div>
        </div>
    );
};

export { DepositCrypto };
