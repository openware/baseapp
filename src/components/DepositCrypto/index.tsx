import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { selectMobileDeviceState } from '../../modules';
import { CopyableTextField } from '../CopyableTextField';
import { MetaMaskButton } from '../MetaMaskButton';
import { QRCode } from '../QRCode';

export interface DepositCryptoProps {
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

/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
const DepositCrypto: React.FunctionComponent<DepositCryptoProps> = (props: DepositCryptoProps) => {
    const QR_SIZE = 118;
    const {
        copiableTextFieldText,
        copyButtonText,
        currency,
        data,
        dimensions,
        disabled,
        error,
        handleOnCopy,
        text,
    } = props;
    const isMobileDevice = useSelector(selectMobileDeviceState);
    const size = dimensions || QR_SIZE;
    const onCopy = !disabled ? handleOnCopy : undefined;
    const className = classnames({ 'cr-copyable-text-field__disabled': data === '' });

    return (
        <div className={className}>
            <div className="cr-deposit-crypto">
                <div>
                    <p className="cr-deposit-info">{text}</p>
                    {data ? (
                        <div className="d-none d-md-block qr-code-wrapper">
                            <QRCode dimensions={size} data={data} />
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
