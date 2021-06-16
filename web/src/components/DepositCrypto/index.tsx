import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { formatCCYAddress } from '../../helpers';
import { selectMobileDeviceState, Wallet } from '../../modules';
import { CopyableTextField } from '../CopyableTextField';
import { MetaMaskButton } from '../MetaMaskButton';
import { QRCode } from '../QRCode';
import { Warning } from '../../assets/images/Warning';

export interface DepositCryptoProps {
    /**
     * Wallet
     */
    wallet: Wallet;
    /**
     * Blockchain
     */
        network: string;
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
     * Generate wallet address for selected wallet
     */
    handleGenerateAddress: () => void;
    /**
     * Generate address button label
     */
    buttonLabel?: string;
    disabled?: boolean;
}


/**
 *  Component that displays wallet details that can be used to deposit cryptocurrency.
 */
const DepositCrypto: React.FunctionComponent<DepositCryptoProps> = (props: DepositCryptoProps) => {
    const { formatMessage } = useIntl();

    const QR_SIZE = 118;
    const {
        buttonLabel,
        copiableTextFieldText,
        copyButtonText,
        dimensions,
        error,
        handleGenerateAddress,
        handleOnCopy,
        text,
        wallet,
        network,
    } = props;
    
    const depositAddress = wallet.deposit_addresses?.find(address => address.blockchain_key?.toLowerCase() === network?.toLowerCase());

    const isMobileDevice = useSelector(selectMobileDeviceState);
    const size = dimensions || QR_SIZE;
    const disabled = !depositAddress?.address;
    const onCopy = !disabled ? handleOnCopy : undefined;
    const className = classnames('cr-deposit-crypto', {'cr-copyable-text-field__disabled': disabled});

    const getDepositAddress = (addressData, currency) => {
        const address = addressData?.address?.split('?')[0];

        return address ? formatCCYAddress(currency, address) : '';
    };

    const getDepositTag = (addressData) => addressData?.address?.split('?')[1]?.split('=')[1];

    const walletAddress = getDepositAddress(depositAddress, wallet.currency);
    const walletTag = getDepositTag(depositAddress);

    const renderMemo = React.useMemo(() => {
        return (
            <React.Fragment>
                <div className="cr-deposit-crypto__block">
                    <form className="cr-deposit-crypto__copyable">
                        <fieldset className="cr-copyable-text-field" onClick={onCopy}>
                            <CopyableTextField
                                className="cr-deposit-crypto__copyable-area"
                                value={walletTag || ''}
                                fieldId={walletTag ? 'copy_memo_1' : 'copy_memo_2'}
                                copyButtonText={copyButtonText}
                                disabled={disabled}
                                label={formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.memo'})}
                            />
                        </fieldset>
                    </form>
                </div>
                <div className="cr-deposit-crypto__warning">
                    <Warning />
                    <p>{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.memo.warning' })}</p>
                </div>
            </React.Fragment>
        );
    }, [walletTag]);

    if (!depositAddress) {
        return (
            <div className={className}>
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
            </div>
        );
    }

    if (depositAddress.state === 'disabled') {
        return (
            <div className="cr-deposit-crypto__disabled">
                <div className="cr-deposit-crypto__disabled-wrapper">
                    {formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.disabled'}, {currency: wallet?.currency.toUpperCase()})}
                </div>
            </div>
        );
    }

    return (
        <React.Fragment>
            <h5 className="cr-deposit-crypto__currency">{`${wallet?.name} (${wallet?.currency.toUpperCase()})`}</h5>
            <div className={className}>
                <div>
                    <p className="cr-deposit-info">{text}</p>
                    {walletAddress ? (
                        <div className="d-none d-md-block qr-code-wrapper">
                            <QRCode dimensions={size} data={walletAddress}/>
                        </div>
                    ) : null}
                </div>
                <div className="cr-deposit-crypto__block">
                    {wallet.currency === 'eth' && !isMobileDevice && walletAddress ? (
                        <MetaMaskButton depositAddress={walletAddress} />
                    ) : null}
                    <form className="cr-deposit-crypto__copyable">
                        <fieldset className="cr-copyable-text-field" onClick={onCopy}>
                            <CopyableTextField
                                className="cr-deposit-crypto__copyable-area"
                                value={walletAddress || error}
                                fieldId={walletAddress ? 'copy_deposit_1' : 'copy_deposit_2'}
                                copyButtonText={copyButtonText}
                                disabled={disabled}
                                label={copiableTextFieldText ? copiableTextFieldText : 'Deposit by Wallet Address'}
                            />
                        </fieldset>
                    </form>
                </div>
                {walletTag && renderMemo}
            </div>
            <h5 className="cr-deposit-crypto__hint-title">{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.hint.title'}, {currency: wallet?.currency.toUpperCase()})}</h5>
            <p className="cr-deposit-crypto__hint">{formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.hint'}, {currency: wallet?.currency.toUpperCase()})}</p>
        </React.Fragment>
    );
};

export {
    DepositCrypto,
};
