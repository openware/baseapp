import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { CopyableTextField } from '../CopyableTextField';
import { QRCode } from '../QRCode';

export interface DepositCryptoProps {
    /**
     * Data which is used to generate QR code
     */
    data: string;
    /**
     * Define if wallet account has been activated
     */
    isAccountActivated: boolean;
    /**
     * Generate wallet address for selected wallet
     */
    handleGenerateAddress: () => void;
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
    /**
     * Generate address button label
     */
    buttonLabel?: string;
}


/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
const DepositCrypto: React.FunctionComponent<DepositCryptoProps> = (props: DepositCryptoProps) => {
    const QR_SIZE = 118;
    const {
        data,
        dimensions,
        error,
        text,
        copiableTextFieldText,
        copyButtonText,
        handleOnCopy,
        disabled,
        handleGenerateAddress,
        buttonLabel,
        isAccountActivated,
    } = props;
    const size = dimensions || QR_SIZE;
    const onCopy = !disabled ? handleOnCopy : undefined;
    const className = classnames({'cr-copyable-text-field__disabled': data === ''});

    const getContent = () => {
        if (isAccountActivated) {
            return (
                <>
                    <div>
                        <p className={'cr-deposit-info'}>{text}</p>
                        {data ? <div className="d-none d-md-block qr-code-wrapper"><QRCode dimensions={size} data={data}/></div> : null}
                    </div>
                    <div>
                        <form className={'cr-deposit-crypto__copyable'}>
                            <fieldset className={'cr-copyable-text-field'} onClick={onCopy}>
                                <CopyableTextField
                                    className={'cr-deposit-crypto__copyable-area'}
                                    value={data ? data : error}
                                    fieldId={data ? 'copy_deposit_1' : 'copy_deposit_2'}
                                    copyButtonText={copyButtonText}
                                    disabled={disabled}
                                    label={copiableTextFieldText ? copiableTextFieldText : 'Deposit by Wallet Address'}
                                />
                            </fieldset>
                        </form>
                    </div>
                </>
            );
        }

        return (
            <div className="cr-deposit-crypto__create">
                <div className="cr-deposit-crypto__create-btn">
                    <Button
                        block={true}
                        type="button"
                        onClick={handleGenerateAddress}
                        size="lg"
                        variant="primary"
                    >
                        {buttonLabel ? buttonLabel : 'Generate deposit address'}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className={className}>
            <div className={'cr-deposit-crypto'}>
                {getContent()}
            </div>
        </div>
    );
};

export {
    DepositCrypto,
};
