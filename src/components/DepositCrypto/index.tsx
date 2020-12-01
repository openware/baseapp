import classnames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectMobileDeviceState } from '../../modules';
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
    /**
     * Renders text alert about success copy address
     */
    handleOnCopy: () => void;
    /**
     * @default 'false'
     * If true, Button in CopyableTextField will be disabled.
     */
    disabled?: boolean;
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
    disabled,
    error,
    handleOnCopy,
    text,
}) => {
    const isMobileDevice = useSelector(selectMobileDeviceState);

    const onCopy = !disabled ? handleOnCopy : undefined;

    return (
        <div className={classnames({ 'cr-copyable-text-field__disabled': data === '' })}>
            <div className="cr-deposit-crypto">
                <div>
                    <p className="cr-deposit-info">{text}</p>
                    {data ? (
                        <div className="d-none d-md-block qr-code-wrapper">
                            <QRCode dimensions={dimensions} data={data} />
                        </div>
                    ) : null}
                </div>
                <div className="cr-deposit-crypto__block">
                    {currency === 'eth' && !isMobileDevice ? <MetaMaskButton depositAddress={data} /> : null}
                    <form className="cr-deposit-crypto__copyable">
                        <fieldset className="cr-copyable-text-field" onClick={onCopy}>
                            <CopyableTextField
                                className="cr-deposit-crypto__copyable-area"
                                value={data ? data : error}
                                fieldId={data ? 'copy_deposit_1' : 'copy_deposit_2'}
                                copyButtonText={copyButtonText}
                                disabled={disabled}
                                label={copiableTextFieldText ? copiableTextFieldText : 'Deposit by Wallet Address'}
                            />
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { DepositCrypto };
