import classnames from 'classnames';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from '../../mobile/components/Modal';
import { beneficiariesCreate, BeneficiaryBank, selectMobileDeviceState } from '../../modules';
import { CustomInput } from '../CustomInput';

interface Props {
    currency: string;
    type: 'fiat' | 'coin';
    handleToggleAddAddressModal: () => void;
    handleToggleConfirmationModal: () => void;
}

const BeneficiariesAddModalComponent: React.FC<Props> = (props: Props) => {
    const [coinAddress, setCoinAddress] = React.useState('');
    const [coinBeneficiaryName, setCoinBeneficiaryName] = React.useState('');
    const [coinDescription, setCoinDescription] = React.useState('');
    const [coinAddressFocused, setCoinAddressFocused] = React.useState(false);
    const [coinBeneficiaryNameFocused, setCoinBeneficiaryNameFocused] = React.useState(false);
    const [coinDescriptionFocused, setCoinDescriptionFocused] = React.useState(false);

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

    const { type, handleToggleAddAddressModal, currency } = props;
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const isMobileDevice = useSelector(selectMobileDeviceState);

    const handleClearModalsInputs = React.useCallback(() => {
        setCoinAddress('');
        setCoinBeneficiaryName('');
        setCoinDescription('');
        setCoinAddressFocused(false);
        setCoinBeneficiaryNameFocused(false);
        setCoinDescriptionFocused(false);

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
    }, []);

    const handleClickToggleAddAddressModal = React.useCallback(
        (clear?: boolean) => () => {
            handleToggleAddAddressModal();

            if (clear) {
                handleClearModalsInputs();
            }
        },
        [handleClearModalsInputs, handleToggleAddAddressModal]
    );

    const renderAddAddressModalHeader = React.useCallback(() => {
        return (
            <div className="cr-email-form__options-group">
                <div className="cr-email-form__option">
                    <div className="cr-email-form__option-inner">
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.header' })}
                        <span
                            className="pg-profile-page__close pg-profile-page__pull-right"
                            onClick={handleClickToggleAddAddressModal(true)}
                        />
                    </div>
                </div>
            </div>
        );
    }, [formatMessage, handleClickToggleAddAddressModal]);

    const handleSubmitAddAddressCoinModal = React.useCallback(() => {
        // tslint:disable-next-line:no-any
        let payload: any = {
            currency: currency || '',
            name: coinBeneficiaryName,
            data: JSON.stringify({
                address: coinAddress,
            }),
        };

        if (coinDescription) {
            payload = {
                ...payload,
                description: coinDescription,
            };
        }

        dispatch(beneficiariesCreate(payload));
        handleClearModalsInputs();
    }, [coinAddress, coinBeneficiaryName, coinDescription, dispatch, handleClearModalsInputs, currency]);

    const getState = React.useCallback(
        (key) => {
            switch (key) {
                case 'coinAddress':
                    return coinAddress;
                case 'coinBeneficiaryName':
                    return coinBeneficiaryName;
                case 'coinDescription':
                    return coinDescription;
                case 'coinAddressFocused':
                    return coinAddressFocused;
                case 'coinBeneficiaryNameFocused':
                    return coinBeneficiaryNameFocused;
                case 'coinDescriptionFocused':
                    return coinDescriptionFocused;
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
                default:
                    return '';
            }
        },
        [
            coinAddress,
            coinAddressFocused,
            coinBeneficiaryName,
            coinBeneficiaryNameFocused,
            coinDescription,
            coinDescriptionFocused,
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
        ]
    );

    const handleChangeFieldValue = React.useCallback((key: string, value: string) => {
        switch (key) {
            case 'coinAddress':
                setCoinAddress(value);
                break;
            case 'coinBeneficiaryName':
                setCoinBeneficiaryName(value);
                break;
            case 'coinDescription':
                setCoinDescription(value);
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
    }, []);

    const handleChangeFieldFocus = React.useCallback((key: string) => {
        switch (key) {
            case 'coinAddressFocused':
                setCoinAddressFocused((v) => !v);
                break;
            case 'coinBeneficiaryNameFocused':
                setCoinBeneficiaryNameFocused((v) => !v);
                break;
            case 'coinDescriptionFocused':
                setCoinDescriptionFocused((v) => !v);
                break;
            case 'fiatNameFocused':
                setFiatNameFocused((v) => !v);
                break;
            case 'fiatFullNameFocused':
                setFiatFullNameFocused((v) => !v);
                break;
            case 'fiatAccountNumberFocused':
                setFiatAccountNumberFocused((v) => !v);
                break;
            case 'fiatBankNameFocused':
                setFiatBankNameFocused((v) => !v);
                break;
            case 'fiatBankSwiftCodeFocused':
                setFiatBankSwiftCodeFocused((v) => !v);
                break;
            case 'fiatIntermediaryBankNameFocused':
                setFiatIntermediaryBankNameFocused((v) => !v);
                break;
            case 'fiatIntermediaryBankSwiftCodeFocused':
                setFiatIntermediaryBankSwiftCodeFocused((v) => !v);
                break;
            default:
                break;
        }
    }, []);

    const renderAddAddressModalBodyItem = React.useCallback(
        (field: string, optional?: boolean) => {
            const focusedClass = classnames('cr-email-form__group', {
                'cr-email-form__group--focused': getState(`${field}Focused`),
                'cr-email-form__group--optional': optional,
            });

            return (
                <div key={field} className={focusedClass}>
                    <CustomInput
                        type="text"
                        label={formatMessage({ id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}` })}
                        placeholder={formatMessage({
                            id: `page.body.wallets.beneficiaries.addAddressModal.body.${field}`,
                        })}
                        defaultLabel={field}
                        handleChangeInput={(value) => handleChangeFieldValue(field, value)}
                        inputValue={getState(field) as any}
                        handleFocusInput={() => handleChangeFieldFocus(`${field}Focused`)}
                        classNameLabel="cr-email-form__label"
                        classNameInput="cr-email-form__input"
                        autoFocus={field === 'coinAddress' || field === 'fiatName'}
                    />
                </div>
            );
        },
        [formatMessage, getState, handleChangeFieldFocus, handleChangeFieldValue]
    );

    const renderAddAddressModalCryptoBody = React.useCallback(() => {
        const isDisabled = !coinAddress || !coinBeneficiaryName;

        return (
            <div className="cr-email-form__form-content">
                {renderAddAddressModalBodyItem('coinAddress')}
                {renderAddAddressModalBodyItem('coinBeneficiaryName')}
                {renderAddAddressModalBodyItem('coinDescription', true)}
                <div className="cr-email-form__button-wrapper">
                    <Button disabled={isDisabled} onClick={handleSubmitAddAddressCoinModal} size="lg" variant="primary">
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.button' })}
                    </Button>
                </div>
            </div>
        );
    }, [
        coinAddress,
        coinBeneficiaryName,
        formatMessage,
        handleSubmitAddAddressCoinModal,
        renderAddAddressModalBodyItem,
    ]);

    const handleSubmitAddAddressFiatModal = React.useCallback(() => {
        let data: BeneficiaryBank = {
            full_name: fiatFullName,
            account_number: fiatAccountNumber,
            bank_name: fiatBankName,
        };

        if (fiatBankSwiftCode) {
            data = {
                ...data,
                bank_swift_code: fiatBankSwiftCode,
            };
        }

        if (fiatIntermediaryBankName) {
            data = {
                ...data,
                intermediary_bank_name: fiatIntermediaryBankName,
            };
        }

        if (fiatIntermediaryBankSwiftCode) {
            data = {
                ...data,
                intermediary_bank_swift_code: fiatIntermediaryBankSwiftCode,
            };
        }

        const payload = {
            currency: currency || '',
            name: fiatName,
            data: JSON.stringify(data),
        };

        dispatch(beneficiariesCreate(payload));
        handleClearModalsInputs();
    }, [
        currency,
        dispatch,
        fiatAccountNumber,
        fiatBankName,
        fiatBankSwiftCode,
        fiatFullName,
        fiatIntermediaryBankName,
        fiatIntermediaryBankSwiftCode,
        fiatName,
        handleClearModalsInputs,
    ]);

    const renderAddAddressModalFiatBody = React.useCallback(() => {
        const isDisabled = !fiatName || !fiatFullName || !fiatAccountNumber || !fiatBankName;

        return (
            <div className="cr-email-form__form-content">
                {renderAddAddressModalBodyItem('fiatName')}
                {renderAddAddressModalBodyItem('fiatFullName')}
                {renderAddAddressModalBodyItem('fiatAccountNumber')}
                {renderAddAddressModalBodyItem('fiatBankName')}
                {renderAddAddressModalBodyItem('fiatBankSwiftCode', true)}
                {renderAddAddressModalBodyItem('fiatIntermediaryBankName', true)}
                {renderAddAddressModalBodyItem('fiatIntermediaryBankSwiftCode', true)}
                <div className="cr-email-form__button-wrapper">
                    <Button disabled={isDisabled} onClick={handleSubmitAddAddressFiatModal} size="lg" variant="primary">
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.body.button' })}
                    </Button>
                </div>
            </div>
        );
    }, [
        fiatAccountNumber,
        fiatBankName,
        fiatFullName,
        fiatName,
        formatMessage,
        handleSubmitAddAddressFiatModal,
        renderAddAddressModalBodyItem,
    ]);

    const renderContent = React.useCallback(() => {
        const addModalClass = classnames('beneficiaries-add-address-modal', {
            'beneficiaries-add-address-modal--coin': type === 'coin',
            'beneficiaries-add-address-modal--fiat': type === 'fiat',
            'cr-modal': !isMobileDevice,
        });

        return (
            <div className={addModalClass}>
                <div className="cr-email-form">
                    {renderAddAddressModalHeader()}
                    {type === 'coin' ? renderAddAddressModalCryptoBody() : renderAddAddressModalFiatBody()}
                </div>
            </div>
        );
    }, [
        type,
        isMobileDevice,
        renderAddAddressModalCryptoBody,
        renderAddAddressModalFiatBody,
        renderAddAddressModalHeader,
    ]);

    return isMobileDevice ? (
        <Modal
            title={formatMessage({ id: 'page.body.wallets.beneficiaries.addAddressModal.header' })}
            onClose={props.handleToggleAddAddressModal}
            isOpen>
            {renderContent()}
        </Modal>
    ) : (
        renderContent()
    );
};

const BeneficiariesAddModal = React.memo(BeneficiariesAddModalComponent);

export { BeneficiariesAddModal };
