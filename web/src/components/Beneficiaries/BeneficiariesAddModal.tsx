import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { is2faValid, validateBeneficiaryAddress, validateBeneficiaryTestnetAddress } from '../../helpers';
import { Modal } from '../../mobile/components/Modal';
import {
    beneficiariesCreate,
    BeneficiaryBank,
    selectCurrencies,
    selectMobileDeviceState,
    BlockchainCurrencies,
    selectBeneficiariesCreateSuccess,
    selectBeneficiariesCreateError,
} from '../../modules';
import { CustomInput } from '../CustomInput';
import { DropdownBeneficiary } from './DropdownBeneficiary';
import { BeneficiariesBlockchainItem } from './BeneficiariesCrypto/BeneficiariesBlockchainItem';
import { CodeVerification } from '..';

interface Props {
    currency: string;
    type: 'fiat' | 'coin';
    handleToggleAddAddressModal: () => void;
};

const defaultSelected = {
    blockchainKey: '',
    protocol: '',
    name: '',
    id: '',
    fee: '',
    minWithdraw: '',
};

const BeneficiariesAddModalComponent: React.FC<Props> = (props: Props) => {
    const [coinAddress, setCoinAddress] = React.useState('');
    const [coinAddressValid, setCoinAddressValid] = React.useState(false);
    const [coinBlockchainName, setCoinBlockchainName] = React.useState(defaultSelected);
    const [coinBeneficiaryName, setCoinBeneficiaryName] = React.useState('');
    const [coinDescription, setCoinDescription] = React.useState('');
    const [coinDestinationTag, setCoinDestinationTag] = React.useState('');
    const [coinAddressFocused, setCoinAddressFocused] = React.useState(false);
    const [coinBeneficiaryNameFocused, setCoinBeneficiaryNameFocused] = React.useState(false);
    const [coinDescriptionFocused, setCoinDescriptionFocused] = React.useState(false);
    const [coinDestinationTagFocused, setCoinDestinationTagFocused] = React.useState(false);

    const [fiatName, setFiatName] = React.useState('');
    const [fiatFullName, setFiatFullName] = React.useState('');
    const [fiatAccountNumber, setFiatAccountNumber] = React.useState('');
    const [fiatBankName, setFiatBankName] = React.useState('');
    const [fiatBankSwiftCode, setFiatBankSwiftCode] = React.useState('');
    const [fiatIntermediaryBankName, setFiatIntermediaryBankName] = React.useState('');
    const [fiatIntermediaryBankSwiftCode, setFiatIntermediaryBankSwiftCode] = React.useState('');
    const [fiatNameFocused, setFiatNameFocused] = React.useState(false);
    const [fiatFullNameFocused, setFiatFullNameFocused] = React.useState(false);
    const [fiatAccountNumberFocused, setFiatAccountNumberFocused] = React.useState(false);
    const [fiatBankNameFocused, setFiatBankNameFocused] = React.useState(false);
    const [fiatBankSwiftCodeFocused, setFiatBankSwiftCodeFocused] = React.useState(false);
    const [fiatIntermediaryBankNameFocused, setFiatIntermediaryBankNameFocused] = React.useState(false);
    const [fiatIntermediaryBankSwiftCodeFocused, setFiatIntermediaryBankSwiftCodeFocused] = React.useState(false);

    const [code2FA, setCode2FA] = React.useState<string>('');

    const { type, handleToggleAddAddressModal, currency } = props;
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const isMobileDevice = useSelector(selectMobileDeviceState);
    const currencies = useSelector(selectCurrencies);
    const createSuccess = useSelector(selectBeneficiariesCreateSuccess);
    const createError = useSelector(selectBeneficiariesCreateError);
    const currencyItem = React.useMemo(() => currencies.find(item => item.id === currency), [currencies]);
    const isRipple = React.useMemo(() => currency === 'xrp', [currency]);

    React.useEffect(() => {
        if (createSuccess) {
            handleClearModalsInputs();
        } else if (createError) {
            setCode2FA('');
        }
    }, [createSuccess, createError]);

    const handleClearModalsInputs = React.useCallback(() => {
        setCoinAddress('');
        setCoinBeneficiaryName('');
        setCoinBlockchainName(defaultSelected);
        setCoinDescription('');
        setCoinDestinationTag('');
        setCoinAddressFocused(false);
        setCoinBeneficiaryNameFocused(false);
        setCoinDescriptionFocused(false);
        setCoinDestinationTagFocused(false);
        setCoinAddressValid(false);
        // setCoinTestnetAddressValid(false);

        setFiatAccountNumber('');
        setFiatName('');
        setFiatFullName('');
        setFiatBankName('');
        setFiatBankSwiftCode('');
        setFiatIntermediaryBankName('');
        setFiatIntermediaryBankSwiftCode('');
        setFiatNameFocused(false);
        setFiatFullNameFocused(false);
        setFiatAccountNumberFocused(false);
        setFiatBankNameFocused(false);
        setFiatBankSwiftCodeFocused(false);
        setFiatIntermediaryBankNameFocused(false);
        setFiatIntermediaryBankSwiftCodeFocused(false);

        setCode2FA('');
    }, []);

    const handleSubmitAddAddressCoinModal = React.useCallback(() => {
        const payload = {
            currency: currency || '',
            name: coinBeneficiaryName,
            blockchain_key: coinBlockchainName.blockchainKey,
            data: JSON.stringify({
                address: (isRipple && coinDestinationTag ? `${coinAddress}?dt=${coinDestinationTag}` : coinAddress),
            }),
            ...(coinDescription && { description: coinDescription }),
            otp: code2FA,
        };

        dispatch(beneficiariesCreate(payload));
    }, [coinAddress, coinBeneficiaryName, coinDescription, currency, coinBlockchainName, code2FA]);

    const getState = React.useCallback(key => {
        switch (key) {
            case 'coinAddress':
                return coinAddress;
            case 'coinBeneficiaryName':
                return coinBeneficiaryName;
            case 'coinDestinationTag':
                return coinDestinationTag;
            case 'coinDescription':
                return coinDescription;
            case 'coinAddressFocused':
                return coinAddressFocused;
            case 'coinBeneficiaryNameFocused':
                return coinBeneficiaryNameFocused;
            case 'coinDescriptionFocused':
                return coinDescriptionFocused;
            case 'coinDestinationTagFocused':
                return coinDestinationTagFocused;
            case 'fiatName':
                return fiatName;
            case 'fiatFullName':
                return fiatFullName;
            case 'fiatAccountNumber':
                return fiatAccountNumber;
            case 'fiatBankName':
                return fiatBankName;
            case 'fiatBankSwiftCode':
                return fiatBankSwiftCode;
            case 'fiatIntermediaryBankName':
                return fiatIntermediaryBankName;
            case 'fiatIntermediaryBankSwiftCode':
                return fiatIntermediaryBankSwiftCode;
            case 'fiatNameFocused':
                return fiatNameFocused;
            case 'fiatFullNameFocused':
                return fiatFullNameFocused;
            case 'fiatAccountNumberFocused':
                return fiatAccountNumberFocused;
            case 'fiatBankNameFocused':
                return fiatBankNameFocused;
            case 'fiatBankSwiftCodeFocused':
                return fiatBankSwiftCodeFocused;
            case 'fiatIntermediaryBankNameFocused':
                return fiatIntermediaryBankNameFocused;
            case 'fiatIntermediaryBankSwiftCodeFocused':
                return fiatIntermediaryBankSwiftCodeFocused;
            case 'code2FA':
                return code2FA;
            default:
                return '';
        }
    }, [
        coinAddress,
        coinAddressFocused,
        coinBeneficiaryName,
        coinBeneficiaryNameFocused,
        coinDescription,
        coinDescriptionFocused,
        coinDestinationTag,
        coinDestinationTagFocused,
        fiatAccountNumber,
        fiatAccountNumberFocused,
        fiatBankName,
        fiatBankNameFocused,
        fiatBankSwiftCode,
        fiatBankSwiftCodeFocused,
        fiatFullName,
        fiatFullNameFocused,
        fiatIntermediaryBankName,
        fiatIntermediaryBankNameFocused,
        fiatIntermediaryBankSwiftCode,
        fiatIntermediaryBankSwiftCodeFocused,
        fiatName,
        fiatNameFocused,
        code2FA,
    ]);

    const validateCoinAddressFormat = React.useCallback((value: string) => {
        const coinAddressValidator = validateBeneficiaryAddress.cryptocurrency(currency, true);
        const coinAddressTestnetValidator = validateBeneficiaryTestnetAddress.cryptocurrency(currency, true);

        setCoinAddressValid(coinAddressValidator.test(value.trim()));
        // setCoinTestnetAddressValid(coinAddressTestnetValidator.test(value.trim()));
    }, [currency]);

    const handleChangeFieldValue = React.useCallback((key: string, value: string) => {
        switch (key) {
            case 'coinAddress':
                setCoinAddress(value);
                validateCoinAddressFormat(value);
                break;
            case 'coinBeneficiaryName':
                setCoinBeneficiaryName(value);
                break;
            case 'coinDescription':
                setCoinDescription(value);
                break;
            case 'coinDestinationTag':
                setCoinDestinationTag(value);
                break;
            case 'fiatName':
                setFiatName(value);
                break;
            case 'fiatFullName':
                setFiatFullName(value);
                break;
            case 'fiatAccountNumber':
                setFiatAccountNumber(value);
                break;
            case 'fiatBankName':
                setFiatBankName(value);
                break;
            case 'fiatBankSwiftCode':
                setFiatBankSwiftCode(value);
                break;
            case 'fiatIntermediaryBankName':
                setFiatIntermediaryBankName(value);
                break;
            case 'fiatIntermediaryBankSwiftCode':
                setFiatIntermediaryBankSwiftCode(value);
                break;
            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeFieldFocus = React.useCallback((key: string) => {
        switch (key) {
            case 'coinAddressFocused':
                setCoinAddressFocused(v => !v);
                break;
            case 'coinBeneficiaryNameFocused':
                setCoinBeneficiaryNameFocused(v => !v);
                break;
            case 'coinDescriptionFocused':
                setCoinDescriptionFocused(v => !v);
                break;
            case 'coinDestinationTagFocused':
                setCoinDestinationTagFocused(v => !v);
                break;
            case 'fiatNameFocused':
                setFiatNameFocused(v => !v);
                break;
            case 'fiatFullNameFocused':
                setFiatFullNameFocused(v => !v);
                break;
            case 'fiatAccountNumberFocused':
                setFiatAccountNumberFocused(v => !v);
                break;
            case 'fiatBankNameFocused':
                setFiatBankNameFocused(v => !v);
                break;
            case 'fiatBankSwiftCodeFocused':
                setFiatBankSwiftCodeFocused(v => !v);
                break;
            case 'fiatIntermediaryBankNameFocused':
                setFiatIntermediaryBankNameFocused(v => !v);
                break;
            case 'fiatIntermediaryBankSwiftCodeFocused':
                setFiatIntermediaryBankSwiftCodeFocused(v => !v);
                break;
            default:
                break;
        }
    }, []);

    const renderAddAddressModalBodyItem = React.useCallback((field: string, optional?: boolean) => {
        const focusedClass = classnames('cr-email-form__group', {
            'cr-email-form__group--focused': getState(`${field}Focused`),
            'cr-email-form__group--optional': optional,
        });

        return (
            <div key={field} className={focusedClass}>
                <CustomInput
                    type="text"
                    label={formatMessage({ id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}` })}
                    placeholder={formatMessage({ id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}` })}
                    defaultLabel={field}
                    handleChangeInput={value => handleChangeFieldValue(field, value)}
                    // @ts-ignore
                    inputValue={getState(field)}
                    handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
                    classNameLabel="cr-email-form__label"
                    classNameInput="cr-email-form__input"
                    autoFocus={field === 'coinAddress' || field === 'fiatName'}
                />
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formatMessage, getState]);

    const renderInvalidAddressMessage = React.useMemo(() => {
        return (
          <div className="cr-email-form__group">
              <span className="pg-beneficiaries__error-text">{formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.invalidAddress' })}</span>
          </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coinAddress]);

    const handleChangenBlockchain = React.useCallback((index: number) => {
        const blockchainItem = currencyItem.networks[index];

        setCoinBlockchainName({
            blockchainKey: blockchainItem.blockchain_key,
            protocol: blockchainItem.protocol,
            name: currencyItem.name,
            id: currencyItem.id,
            fee: blockchainItem?.withdraw_fee,
            minWithdraw: blockchainItem.min_withdraw_amount,
        });
    }, [currencyItem]);

    const renderDropdownItem = React.useCallback((name, fixed, price) => (item: BlockchainCurrencies, index) => {
        return (
            <BeneficiariesBlockchainItem
                blockchainKey={item.blockchain_key}
                protocol={item.protocol}
                name={name}
                id={item.currency_id}
                fee={item?.withdraw_fee}
                minWithdraw={item.min_withdraw_amount}
                fixed={fixed}
                price={price}
                disabled={item.status === 'disabled'}
            />
        );
    }, []);

    const render2FACode = React.useMemo(() => {
        return (
            <div className="cr-email-form__group">
                <span className="otp-label">
                    {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.otpCode' })}
                </span>
                <CodeVerification
                    code={code2FA}
                    onChange={setCode2FA}
                    codeLength={6}
                    type="text"
                    placeholder="X"
                    inputMode="decimal"
                    showPaste2FA={true}
                    isMobile={isMobileDevice}
                />
            </div>
        );
    }, [code2FA, isMobileDevice]);

    const renderAddAddressModalCryptoBody = React.useMemo(() => {
        const isDisabled = !coinAddress || !coinBeneficiaryName || !coinAddressValid || !coinBlockchainName.blockchainKey || !is2faValid(code2FA);

        return (
            <div className="cr-email-form__form-content">
                {renderAddAddressModalBodyItem('coinAddress')}
                {!coinAddressValid && coinAddress && renderInvalidAddressMessage}
                <DropdownBeneficiary
                    list={currencyItem?.networks?.map(renderDropdownItem(currencyItem.name, currencyItem.precision, currencyItem.price))}
                    selectedValue={coinBlockchainName}
                    onSelect={handleChangenBlockchain}
                    placeholder={formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.blockchain.networks' })}
                    clear={false}
                />
                {renderAddAddressModalBodyItem('coinBeneficiaryName')}
                {renderAddAddressModalBodyItem('coinDescription', true)}
                {isRipple && renderAddAddressModalBodyItem('coinDestinationTag', true)}
                {render2FACode}
                <div className="cr-email-form__button-wrapper">
                    <Button
                        disabled={isDisabled}
                        onClick={handleSubmitAddAddressCoinModal}
                        size="lg"
                        variant="primary"
                    >
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.button' })}
                    </Button>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coinAddress, coinBeneficiaryName, coinDescription, coinDestinationTag, render2FACode]);

    const handleSubmitAddAddressFiatModal = React.useCallback(() => {
        const data: BeneficiaryBank = {
            full_name: fiatFullName,
            account_number: fiatAccountNumber,
            bank_name: fiatBankName,
            ...(fiatBankSwiftCode && { bank_swift_code: fiatBankSwiftCode }),
            ...(fiatIntermediaryBankName && { intermediary_bank_name: fiatIntermediaryBankName }),
            ...(fiatIntermediaryBankSwiftCode && { intermediary_bank_swift_code: fiatIntermediaryBankSwiftCode }),
        };

        const payload = {
            currency: currency || '',
            name: fiatName,
            data: JSON.stringify(data),
            otp: code2FA,
        };

        dispatch(beneficiariesCreate(payload));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        fiatAccountNumber,
        fiatBankName,
        fiatBankSwiftCode,
        fiatFullName,
        fiatIntermediaryBankName,
        fiatIntermediaryBankSwiftCode,
        fiatName,
        code2FA,
    ]);

    const renderAddAddressModalFiatBody = React.useMemo(() => {
        const isDisabled = !fiatName || !fiatFullName || !fiatAccountNumber || !fiatBankName || !is2faValid(code2FA);

        return (
            <div className="cr-email-form__form-content">
                {renderAddAddressModalBodyItem('fiatName')}
                {renderAddAddressModalBodyItem('fiatFullName')}
                {renderAddAddressModalBodyItem('fiatAccountNumber')}
                {renderAddAddressModalBodyItem('fiatBankName')}
                {renderAddAddressModalBodyItem('fiatBankSwiftCode', true)}
                {renderAddAddressModalBodyItem('fiatIntermediaryBankName', true)}
                {renderAddAddressModalBodyItem('fiatIntermediaryBankSwiftCode', true)}
                {render2FACode}
                <div className="cr-email-form__button-wrapper">
                    <Button
                        disabled={isDisabled}
                        onClick={handleSubmitAddAddressFiatModal}
                        size="lg"
                        variant="primary"
                    >
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.button' })}
                    </Button>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        fiatAccountNumber,
        fiatBankName,
        fiatFullName,
        fiatName,
        fiatBankSwiftCode,
        fiatIntermediaryBankName,
        fiatIntermediaryBankSwiftCode,
        render2FACode,
        code2FA,
    ]);

    const renderContent = React.useCallback(() => {
        const addModalClass = classnames('beneficiaries-add-address-modal', {
            'beneficiaries-add-address-modal--coin': type === 'coin',
            'beneficiaries-add-address-modal--fiat': type === 'fiat',
        });

        return (
            <div className={addModalClass}>
                <div className="cr-email-form">
                    {type === 'coin' ? renderAddAddressModalCryptoBody : renderAddAddressModalFiatBody}
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, isMobileDevice, getState]);

    return (
        isMobileDevice ?
            <Modal
                title={formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.header' })}
                onClose={handleToggleAddAddressModal}
                isOpen>
                {renderContent()}
            </Modal> : renderContent()
    );
};

export const BeneficiariesAddModal = React.memo(BeneficiariesAddModalComponent);
