import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import {
    beneficiariesCreateData,
    beneficiariesDelete,
    Beneficiary,
    BeneficiaryBank,
    memberLevelsFetch,
    selectBeneficiaries,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesCreate,
    selectBeneficiariesCreateSuccess,
    selectMemberLevels,
    selectMobileDeviceState,
    selectUserInfo,
    sendError,
    beneficiariesResetState,
    selectBeneficiariesDeleteSuccess,
} from '../../modules';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { PlusIcon } from '../../assets/images/PlusIcon';
import { TipIcon } from '../../assets/images/TipIcon';
import { LogoIcon } from '../../assets/images/LogoIcon';
import { CloseIcon, HugeCloseIcon } from '../../assets/images/CloseIcon';
import { BeneficiariesActivateModal } from './BeneficiariesActivateModal';
import { BeneficiariesAddModal } from './BeneficiariesAddModal';
import { BeneficiariesFailAddModal } from './BeneficiariesFailAddModal';
import { TabPanel } from '../TabPanel';
import { SelectBeneficiariesCrypto } from './BeneficiariesCrypto/SelectBeneficiariesCrypto';
import { Button } from 'react-bootstrap';
import { is2faValid } from 'src/helpers';
import {
    getAddressWithoutTag,
    getTag,
    requiresMemoTag,
    requiresDTTag,
} from '../../helpers/tagBasedAsset';
import { CodeVerification, Modal } from '..';

interface OwnProps {
    currency: string;
    type: 'fiat' | 'coin';
    onChangeValue: (beneficiary: Beneficiary) => void;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    blockchain_key: '',
    blockchain_name: '',
    state: '',
    data: {
        address: '',
    },
};

type Props = OwnProps;

const BeneficiariesComponent: React.FC<Props> = (props: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [tab, setTab] = React.useState(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}));
    const [currentTabIndex, setCurrentTabIndex] = React.useState(0);

    const [currentWithdrawalBeneficiary, setWithdrawalBeneficiary] = React.useState(defaultBeneficiary);
    const [isOpenAddressModal, setAddressModalState] = React.useState(false);
    const [isOpenConfirmationModal, setConfirmationModalState] = React.useState(false);
    const [isOpenFailModal, setFailModalState] = React.useState(false);
    const [isOpenOtpModal, setOtpModalState] = React.useState(false);
    const [isOpenTip, setTipState] = React.useState(false);
    const [code2FA, setCode2FA] = React.useState<string>('');
    const [selectedId, setSelectedId] = React.useState<number>(-1);

    const { currency, type, onChangeValue } = props;

    /*    selectors    */
    const beneficiaries = useSelector(selectBeneficiaries);
    const beneficiariesAddData = useSelector(selectBeneficiariesCreate);
    const beneficiariesAddSuccess = useSelector(selectBeneficiariesCreateSuccess);
    const beneficiariesActivateSuccess = useSelector(selectBeneficiariesActivateSuccess);
    const beneficiariesDeleteSuccess = useSelector(selectBeneficiariesDeleteSuccess);
    const memberLevels = useSelector(selectMemberLevels);
    const userData = useSelector(selectUserInfo);
    const isMobileDevice = useSelector(selectMobileDeviceState);
    /*    ---------    */

    const uniqueBlockchainKeys = React.useMemo(() => (new Set(beneficiaries.map(item => item.blockchain_key))), [beneficiaries]);
    const uniqueBlockchainKeysValues = React.useMemo(() => [...uniqueBlockchainKeys.values()], [uniqueBlockchainKeys]);

    React.useEffect(() => {
        if (beneficiaries.length && beneficiaries[0].currency !== currency) {
            setWithdrawalBeneficiary(defaultBeneficiary);
            setCurrentTabIndex(0);
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}));
        }
    }, [currency, beneficiaries])

    React.useEffect(() => {
        if (beneficiaries.length) {
            setCurrentTabIndex(0);
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.whitelisted'}));
        }
    }, [isOpenConfirmationModal, beneficiaries]);

    React.useEffect(() => {
        if (beneficiaries.length) {
            handleSetCurrentAddressOnUpdate(beneficiaries);
        }

        if (!memberLevels) {
            dispatch(memberLevelsFetch());
        }

        return () => {
            document.getElementById('root')?.style.setProperty('height', 'auto');
        };
    }, []);

    React.useEffect(() => {
        if (currency || beneficiariesDeleteSuccess) {
            dispatch(beneficiariesResetState());
        }
    }, [currency, beneficiariesDeleteSuccess]);

    React.useEffect(() => {
        if (beneficiaries) {
            handleSetCurrentAddressOnUpdate(beneficiaries);
        }

        if (beneficiariesAddSuccess) {
            setConfirmationModalState(true);
        }

        if (beneficiariesActivateSuccess) {
            setConfirmationModalState(false);
            document.getElementById('root')?.style.setProperty('height', 'auto');
            setAddressModalState(false);
        }

        if (beneficiaries.length) {
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.whitelisted'}));
            setCurrentTabIndex(0);
        } else {
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}));
        }
    }, [beneficiaries, beneficiariesAddSuccess, beneficiariesActivateSuccess]);

    const handleDeleteAddress = React.useCallback((item: Beneficiary) => () => {
        setSelectedId(item.id);
        setOtpModalState(true);
    }, []);

    const handleClickSelectAddress = React.useCallback((item: Beneficiary) => () => {
        if (item.state && item.state.toLowerCase() === 'pending') {
            dispatch(beneficiariesCreateData(item));
            setConfirmationModalState(true);
        } else {
            handleSetCurrentAddress(item);
            setConfirmationModalState(false);
            document.getElementById('root')?.style.setProperty('height', 'auto');
            setAddressModalState(false);
        }
    }, []);

    const handleSetCurrentAddress = React.useCallback((item: Beneficiary) => {
        if (item.data) {
            setWithdrawalBeneficiary(item);
            onChangeValue(item);
        }
    }, [currency]);

    const handleFilterByState = React.useCallback((beneficiariesList: Beneficiary[], filter: string | string[]) => {
        if (beneficiariesList.length) {
            return beneficiariesList.filter(item => filter.includes(item.state.toLowerCase()));
        }

        return [];
    }, []);

    const handleClickToggleAddAddressModal = React.useCallback(() => () => {
        if (memberLevels && (userData.level < memberLevels.withdraw.minimum_level)) {
            setFailModalState(true);
        } else if (beneficiaries && beneficiaries.length >= 10) {
            dispatch(sendError({
                error: { message: ['error.beneficiaries.max10.addresses'] },
                processingType: 'alert',
            }));
        } else {
            setAddressModalState(true);
            document.getElementById('root')?.style.setProperty('height', '100%');
        }
    }, [beneficiaries]);

    const handleSetCurrentAddressOnUpdate = React.useCallback((beneficiariesList: Beneficiary[]) => {
        let filteredByState = handleFilterByState(beneficiariesList, 'active');

        if (!filteredByState.length) {
            filteredByState = handleFilterByState(beneficiariesList, 'pending');
        }

        if (filteredByState.length) {
            handleSetCurrentAddress(filteredByState[0]);
        }
    }, []);

    const renderAddAddress = React.useMemo(() => {
        return (
            <div className="pg-beneficiaries__add" onClick={handleClickToggleAddAddressModal()}>
                <span className="pg-beneficiaries__add__label">
                    {formatMessage({ id: 'page.body.wallets.beneficiaries.addAddress' })}
                </span>
                <PlusIcon className="pg-beneficiaries__add__icon" />
            </div>
        );
    }, [formatMessage]);

    const renderDropdownTipCryptoNote = React.useCallback((note: string) => {
        return (
            <div className="tip__content__block">
                <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.tipDescription' })}</span>
                <span className="tip__content__block__value">{note}</span>
            </div>
        );
    }, []);

    const renderDropdownTipCrypto = React.useCallback((currentWithdrawalBeneficiary: Beneficiary) => {
        if (currentWithdrawalBeneficiary) {
            const memo = getTag(currentWithdrawalBeneficiary.data.address);
            const currency = currentWithdrawalBeneficiary.currency;

            let textTagID = '';
            if (requiresMemoTag(currentWithdrawalBeneficiary.currency)) {
                textTagID = 'page.body.wallets.beneficiaries.memo';
            }
    
            if (requiresDTTag(currentWithdrawalBeneficiary.currency)) {
                textTagID = 'page.body.wallets.beneficiaries.destinational.tag';
            }

            return (
                <div className="pg-beneficiaries__dropdown__tip tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.tipAddress' })}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.data.address}</span>
                        </div>
                        {textTagID && <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: textTagID })}</span>
                            <span className="tip__content__block__value">{memo}</span>
                        </div>}
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.tipName' })}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.name}</span>
                        </div>
                        {currentWithdrawalBeneficiary.description && renderDropdownTipCryptoNote(currentWithdrawalBeneficiary.description)}
                    </div>
                </div>
            );
        }

        return null;
    }, []);

    const renderDropdownTipFiatDescription = (description: string) => {
        return (
            <div className="tip__content__block">
                <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.description' })}</span>
                <span className="tip__content__block__value">{description}</span>
            </div>
        );
    };

    const renderDropdownTipFiat = React.useCallback((currentWithdrawalBeneficiary: Beneficiary) => {
        if (currentWithdrawalBeneficiary) {
            return (
                <div className="pg-beneficiaries__dropdown__tip tip fiat-tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">
                                {formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.name' })}
                            </span>
                            <span className="tip__content__block__value">
                                {currentWithdrawalBeneficiary.name}
                            </span>
                        </div>
                        {currentWithdrawalBeneficiary.description && renderDropdownTipFiatDescription(currentWithdrawalBeneficiary.description)}
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">
                                {formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.account' })}
                            </span>
                            <span className="tip__content__block__value">
                                {(currentWithdrawalBeneficiary.data as BeneficiaryBank).account_number}
                            </span>
                        </div>
                        <div className="tip__content__block">
                              <span className="tip__content__block__label">
                                  {formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.bankOfBeneficiary' })}
                              </span>
                            <span className="tip__content__block__value">
                                {(currentWithdrawalBeneficiary.data as BeneficiaryBank).bank_name}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    }, []);


    const renderAddressItem = React.useCallback((currentBeneficiary: Beneficiary) => {
        const isPending = currentBeneficiary.state && currentBeneficiary.state.toLowerCase() === 'pending';
        const address = getAddressWithoutTag(currentWithdrawalBeneficiary.data?.address);

        if (type === 'fiat') {
            return (
                <div className="pg-beneficiaries__dropdown">
                    <div className="pg-beneficiaries__dropdown__select fiat-select select" onClick={handleClickToggleAddAddressModal()}>
                        <div className="select__left">
                            <span className="select__left__title">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.name' })}</span>
                            <span className="select__left__address">{currentBeneficiary.name}</span>
                            <span className="select__left__title">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.fullName' })}</span>
                            <span className="select__left__address">{currentBeneficiary.data ? (currentBeneficiary.data as BeneficiaryBank).full_name : ''}</span>
                        </div>
                        <div className="select__right">
                            {isPending ? (
                                <span className="select__right__pending">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.pending' })}</span>
                            ) : null}
                            <span className="select__right__tip" onMouseOver={() => setTipState(true)} onMouseOut={() => setTipState(false)}><TipIcon/></span>
                            <span className="select__right__select">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.select' })}</span>
                            <span className="select__right__chevron"><ChevronIcon /></span>
                        </div>
                    </div>
                    {isOpenTip && renderDropdownTipFiat(currentBeneficiary)}
                </div>
            );
        }

        return (
            <div className="pg-beneficiaries__dropdown">
                <div className="pg-beneficiaries__dropdown__select select" onClick={handleClickToggleAddAddressModal()}>
                    <div className="select__left">
                        <span className="select__left__title">
                            {currentWithdrawalBeneficiary.name}
                        </span>
                        <span className="select__left__address">
                            <span>
                                {address}
                            </span>
                        </span>
                        <span className="item__left__title">
                    </span>
                    </div>
                    <div className="select__right">
                        {isPending ? (
                            <span className="select__right__pending">
                                {formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.pending' })}
                            </span>
                        ) : null}
                        <span className="select__right__tip" onMouseOver={() => setTipState(true)} onMouseOut={() => setTipState(false)}>
                            <TipIcon/>
                        </span>
                        <span className="select__right__select">
                            {formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.select' })}
                        </span>
                        <span className="select__right__chevron"><ChevronIcon /></span>
                    </div>
                </div>
                {isOpenTip && renderDropdownTipCrypto(currentWithdrawalBeneficiary)}
            </div>
        );
    }, [currentWithdrawalBeneficiary, isOpenTip]);

    const renderBeneficiariesAddModal = React.useMemo(() => {
        return (
            <BeneficiariesAddModal
                currency={currency}
                type={type}
                handleToggleAddAddressModal={() => setAddressModalState(false)}
            />
        );
    }, [currency, type]);

    const renderActivateModal = React.useMemo(() => {
        return (
            <BeneficiariesActivateModal
                beneficiariesAddData={beneficiariesAddData}
                handleToggleConfirmationModal={() => setConfirmationModalState(false)}
            />
        );
    }, [beneficiariesAddData]);

    const renderFailModal = React.useMemo(() => {
        return (
            <BeneficiariesFailAddModal
                isMobileDevice={isMobileDevice}
                handleToggleFailModal={() => setFailModalState(false)}
            />
        );
    }, []);

    const handleCloseModals = React.useCallback(() => {
        if (beneficiaries.length) {
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.whitelisted'}));
        } else {
            setTab(formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}));
        }
        setCurrentTabIndex(0);
        setAddressModalState(false);
        setConfirmationModalState(false);
        document.getElementById('root')?.style.setProperty('height', 'auto');
    }, [beneficiaries, setCurrentTabIndex, setAddressModalState, setConfirmationModalState, setTab]);

    const onTabChange = React.useCallback(label => setTab(label), [setTab]);

    const onCurrentTabChange = React.useCallback(index => setCurrentTabIndex(index), [setCurrentTabIndex]);

    const renderTabs = React.useMemo(() => {
        if (beneficiaries.length) {
            return [
                {
                    content: tab === formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.whitelisted'}) ? uniqueBlockchainKeysValues.map(item =>
                        <SelectBeneficiariesCrypto
                            blockchainKey={item}
                            currency={currency}
                            handleDeleteAddress={handleDeleteAddress}
                            handleClickSelectAddress={handleClickSelectAddress} />) : null,
                    label: formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.whitelisted'}),
                },
                {
                    content: tab === formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}) ? renderBeneficiariesAddModal : null,
                    label: formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}),
                }
            ]
        }

        return [
            {
                content: tab === formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}) ? renderBeneficiariesAddModal : null,
                label: formatMessage({ id: 'page.body.wallets.beneficiaries.tab.panel.add.whitelisted'}),
            }
        ];
    }, [tab, isOpenConfirmationModal, isOpenFailModal, beneficiaries]);

    const renderTabPanel = React.useMemo(() => {
        if (isOpenConfirmationModal) {
            return renderActivateModal;
        }

        if (isOpenFailModal) {
            return renderFailModal;
        }

        return <TabPanel
            panels={renderTabs}
            onTabChange={(_, label) => onTabChange(label)}
            currentTabIndex={currentTabIndex}
            onCurrentTabChange={onCurrentTabChange}
        />
    }, [isOpenAddressModal, isOpenConfirmationModal, isOpenFailModal, tab])

    const renderTitle = React.useMemo(() => {
        if (isOpenConfirmationModal) {
            return formatMessage({ id: 'page.body.wallets.beneficiaries.title.confirm.new.account' });
        }

        return formatMessage({ id: 'page.body.wallets.beneficiaries.title.withdrawal.limit' });
    }, [isOpenConfirmationModal]);

    const renderBeneficiariesModal = React.useMemo(() => {
        return (
            <div className="cr-modal pg-beneficiaries__modal">
                <div className="cr-email-form__options-group">
                    <div className="cr-email-form__option">
                        <div className="cr-email-form__option-inner">
                            <LogoIcon />
                            <HugeCloseIcon className="cr-email-form__option-inner-close" onClick={() => handleCloseModals()}/>
                        </div>
                    </div>
                </div>
                <h3>{renderTitle}</h3>
                {renderTabPanel}
            </div>
        );
    }, [renderTabPanel, tab]);

    const closeModal = React.useCallback(() => {
        setOtpModalState(false);
        setCode2FA('');
        setSelectedId(-1);
     }, []);

    const deleteBeneficiary = React.useCallback(() => {
        dispatch(beneficiariesDelete({ id: selectedId, otp: code2FA }));
        setSelectedId(-1);
        setCode2FA('');
        setOtpModalState(false);
    }, [selectedId, code2FA]);

    const renderModalHeader = React.useMemo(() => {
        return (
            <div className="cr-email-form__options-group">
                <div className="cr-email-form__option">
                    <div className="cr-email-form__option-inner">
                        {formatMessage({ id: 'page.body.wallets.beneficiaries.delete.2fa.header' })}
                        <div className="cr-email-form__cros-icon" onClick={closeModal}>
                            <CloseIcon className="close-icon" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }, []);

    const renderModalBody = React.useMemo(() => {
        return (
            <div className="pg-exchange-modal-submit-body pg-exchange-modal-submit-body-2fa">
                <div className="cr-email-form__group">
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
            </div>
        );
    }, [code2FA, isMobileDevice]);

    const renderModalFooter = React.useMemo(() => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    block={true}
                    disabled={!is2faValid(code2FA)}
                    onClick={deleteBeneficiary}
                    size="lg"
                    variant="primary"
                >
                    {formatMessage({id: 'page.body.wallets.beneficiaries.delete.2fa.button' })}
                </Button>
            </div>
        );
    }, [code2FA]);

    const renderOtpModal = React.useMemo(() => {
        return (
            <Modal
                className="pg-beneficiaries__2fa"
                show={isOpenOtpModal}
                header={renderModalHeader}
                content={renderModalBody}
                footer={renderModalFooter}
            />
        );
    }, [isOpenOtpModal, isMobileDevice, code2FA]);

    return (
        <div className="pg-beneficiaries">
            {beneficiaries.length && currentWithdrawalBeneficiary.id && currentWithdrawalBeneficiary.currency === beneficiaries[0].currency ? renderAddressItem(currentWithdrawalBeneficiary) : renderAddAddress}
            {isOpenAddressModal && renderBeneficiariesModal}
            {isOpenOtpModal && renderOtpModal}
        </div>
    );
}

const Beneficiaries = React.memo(BeneficiariesComponent);

export {
    Beneficiaries,
};
