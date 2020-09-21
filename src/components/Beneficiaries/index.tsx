import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronIcon } from '../../assets/images/ChevronIcon';
import { PlusIcon } from '../../assets/images/PlusIcon';
import { TipIcon } from '../../assets/images/TipIcon';
import { TrashBin } from '../../assets/images/TrashBin';
import { DEFAULT_BENEFICIARY } from '../../constants';
import {
    beneficiariesCreateData,
    beneficiariesDelete,
    Beneficiary,
    BeneficiaryBank,
    memberLevelsFetch,
    selectBeneficiaries,
    selectBeneficiariesCreate,
    selectMemberLevels,
    selectMobileDeviceState,
    selectUserInfo,
} from '../../modules';
import { BeneficiariesActivateModal } from './BeneficiariesActivateModal';
import { BeneficiariesAddModal } from './BeneficiariesAddModal';
import { BeneficiariesFailAddModal } from './BeneficiariesFailAddModal';


interface Props {
    currency: string;
    type: 'fiat' | 'coin';
    onChangeValue: (beneficiary: Beneficiary) => void;
}


export const Beneficiaries: React.FC<Props> = (props: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const beneficiaries = useSelector(selectBeneficiaries);
    const beneficiariesAddData = useSelector(selectBeneficiariesCreate);
    const memberLevels = useSelector(selectMemberLevels);
    const userData = useSelector(selectUserInfo);
    const isMobileDevice = useSelector(selectMobileDeviceState);

    const [currentWithdrawalBeneficiary, setCurrentWithdrawalBeneficiary] = React.useState<Beneficiary>(DEFAULT_BENEFICIARY);
    const [isOpenAddressModal, setIsOpenAddressModal] = React.useState(false);
    const [isOpenConfirmationModal, setIsOpenConfirmationModal] = React.useState(false);
    const [isOpenDropdown, setIsOpenDropdown] = React.useState(false);
    const [isOpenTip, setIsOpenTip] = React.useState(false);
    const [isOpenFailModal, setIsOpenFailModal] = React.useState(false);

    const { currency, type, onChangeValue } = props;

    const handleToggleAddAddressModal = React.useCallback(() => {
        setIsOpenAddressModal(prev => !prev);
    }, []);

    const handleToggleConfirmationModal = React.useCallback(() => {
        setIsOpenConfirmationModal(prev => !prev);
    }, []);

    const handleToggleFailModal = React.useCallback(() => {
        setIsOpenFailModal(prev => !prev);
    }, []);

    const handleToggleDropdown = React.useCallback(() => {
        setIsOpenDropdown(prev => !prev);
    }, []);

    const handleToggleTip = React.useCallback(() => {
        setIsOpenTip(prev => !prev);
    }, []);

    const handleClickToggleAddAddressModal = React.useCallback(() => () => {
        if (memberLevels && (userData.level < memberLevels.withdraw.minimum_level)) {
            handleToggleFailModal();
        } else {
            handleToggleAddAddressModal();
        }
    }, [handleToggleAddAddressModal, handleToggleFailModal, memberLevels, userData.level]);

    const renderAddAddress = React.useCallback(() => {
        return (
            <div className="pg-beneficiaries__add" onClick={handleClickToggleAddAddressModal()}>
                <span className="pg-beneficiaries__add__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.addAddress' })}</span>
                <PlusIcon className="pg-beneficiaries__add__icon" />
            </div>
        );
    }, [handleClickToggleAddAddressModal, formatMessage]);

    const handleDeleteAddress = React.useCallback((item: Beneficiary) => {
        dispatch(beneficiariesDelete({
            id: item.id,
        }));
    }, [dispatch]);

    const handleSetCurrentAddress = React.useCallback((item: Beneficiary) => {
        if (item.data) {
            setCurrentWithdrawalBeneficiary(item);
            setIsOpenDropdown(false);
            onChangeValue(item);
        }
    }, [onChangeValue]);

    const handleClickDeleteAddress = React.useCallback((item: Beneficiary) => () => {
        handleDeleteAddress(item);
    }, [handleDeleteAddress]);

    const handleClickSelectAddress = React.useCallback((item: Beneficiary) => () => {
        if (item.state && item.state.toLowerCase() === 'pending') {
            dispatch(beneficiariesCreateData({ id: item.id } as any));
            handleToggleConfirmationModal();
        } else {
            handleSetCurrentAddress(item);
        }
    }, [dispatch, handleSetCurrentAddress, handleToggleConfirmationModal]);

    const renderDropdownItem = React.useCallback((item: Beneficiary, index: number) => {
        const isPending = item.state && item.state.toLowerCase() === 'pending';
        const itemClassName = classnames('pg-beneficiaries__dropdown__body__item item', {
            'item--pending': isPending,
        });

        if (type === 'fiat') {
            return (
                <div key={index} className={itemClassName}>
                    <div className="item__left" onClick={handleClickSelectAddress(item)}>
                        <span className="item__left__title">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.name' })}</span>
                        <span className="item__left__address">{item.name}</span>
                    </div>
                    <div className="item__left" onClick={handleClickSelectAddress(item)}>
                        <span className="item__left__title">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.fullName' })}</span>
                        <span className="item__left__address">{item.data ? (item.data as BeneficiaryBank).full_name : ''}</span>
                    </div>
                    <div className="item__right">
                        {isPending ? (
                            <span className="item__right__pending">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.pending' })}</span>
                        ) : null}
                        <span className="item__right__delete" onClick={handleClickDeleteAddress(item)}><TrashBin/></span>
                    </div>
                </div>
            );
        }

        return (
            <div key={index} className={itemClassName}>
                <div className="item__left" onClick={handleClickSelectAddress(item)}>
                    <span className="item__left__title">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.name' })}</span>
                    <span className="item__left__address">{item.name}</span>
                </div>
                <div className="item__right">
                    {isPending ? (
                        <span className="item__right__pending">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.pending' })}</span>
                    ) : null}
                    <span className="item__right__delete" onClick={handleClickDeleteAddress(item)}><TrashBin/></span>
                </div>
            </div>
        );
    }, [formatMessage, handleClickDeleteAddress, handleClickSelectAddress, type]);

    const renderDropdownBody = React.useCallback(() => {
        const dropdownBodyClassName = classnames('pg-beneficiaries__dropdown__body', {
            'fiat-body': type === 'fiat',
        });

        return (
            <div className={dropdownBodyClassName}>
                {beneficiaries && beneficiaries.map(renderDropdownItem)}
                <div className="pg-beneficiaries__dropdown__body__add add" onClick={handleClickToggleAddAddressModal()}>
                    <span className="add__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.addAddress' })}</span>
                    <PlusIcon className="add__icon" />
                </div>
            </div>
        );
    }, [beneficiaries, formatMessage, handleClickToggleAddAddressModal, renderDropdownItem, type]);

    const renderDropdownTipCryptoNote = React.useCallback((note: string) => {
        return (
            <div className="tip__content__block">
                <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.tipDescription' })}</span>
                <span className="tip__content__block__value">{note}</span>
            </div>
        );
    }, [formatMessage]);

    const renderDropdownTipCrypto = React.useCallback(() => {
        if (currentWithdrawalBeneficiary) {
            return (
                <div className="pg-beneficiaries__dropdown__tip tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.tipAddress' })}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.data.address}</span>
                        </div>
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.tipName' })}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.name}</span>
                        </div>
                        {currentWithdrawalBeneficiary.description && renderDropdownTipCryptoNote(currentWithdrawalBeneficiary.description)}
                    </div>
                </div>
            );
        }

        return;
    }, [currentWithdrawalBeneficiary, formatMessage, renderDropdownTipCryptoNote]);

    const renderDropdownTipFiatDescription = React.useCallback((description: string) => {
        return (
            <div className="tip__content__block">
                <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.description' })}</span>
                <span className="tip__content__block__value">{description}</span>
            </div>
        );
    }, [formatMessage]);

    const renderDropdownTipFiat = React.useCallback(() => {
        if (currentWithdrawalBeneficiary) {
            return (
                <div className="pg-beneficiaries__dropdown__tip tip fiat-tip">
                    <div className="tip__content">
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.name' })}</span>
                            <span className="tip__content__block__value">{currentWithdrawalBeneficiary.name}</span>
                        </div>
                        {currentWithdrawalBeneficiary.description && renderDropdownTipFiatDescription(currentWithdrawalBeneficiary.description)}
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.account' })}</span>
                            <span className="tip__content__block__value">{(currentWithdrawalBeneficiary.data as BeneficiaryBank).account_number}</span>
                        </div>
                        <div className="tip__content__block">
                            <span className="tip__content__block__label">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.bankOfBeneficiary' })}</span>
                            <span className="tip__content__block__value">{(currentWithdrawalBeneficiary.data as BeneficiaryBank).bank_name}</span>
                        </div>
                    </div>
                </div>
            );
        }

        return;
    }, [currentWithdrawalBeneficiary, formatMessage, renderDropdownTipFiatDescription]);

    const renderAddressDropdown = React.useCallback(() => {
        const isPending = currentWithdrawalBeneficiary.state && currentWithdrawalBeneficiary.state.toLowerCase() === 'pending';

        const dropdownClassName = classnames('pg-beneficiaries__dropdown', {
            'pg-beneficiaries__dropdown--open': isOpenDropdown,
        });

        if (type === 'fiat') {
            return (
                <div className={dropdownClassName}>
                    <div className="pg-beneficiaries__dropdown__select fiat-select select" onClick={handleToggleDropdown}>
                        <div className="select__left">
                            <span className="select__left__title">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.name' })}</span>
                            <span className="select__left__address">{currentWithdrawalBeneficiary.name}</span>
                            <span className="select__left__title">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.fiat.fullName' })}</span>
                            <span className="select__left__address">{currentWithdrawalBeneficiary.data ? (currentWithdrawalBeneficiary.data as BeneficiaryBank).full_name : ''}</span>
                        </div>
                        <div className="select__right">
                            <span className="select__right__tip" onMouseOver={handleToggleTip} onMouseOut={handleToggleTip}><TipIcon/></span>
                            <span className="select__right__select">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.select' })}</span>
                            <span className="select__right__chevron"><ChevronIcon /></span>
                        </div>
                    </div>
                    {isOpenDropdown && renderDropdownBody()}
                    {isOpenTip && renderDropdownTipFiat()}
                </div>
            );
        }

        return (
            <div className={dropdownClassName}>
                <div className="pg-beneficiaries__dropdown__select select" onClick={handleToggleDropdown}>
                    <div className="select__left">
                        <span className="select__left__title">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.name' })}</span>
                        <span className="select__left__address"><span>{currentWithdrawalBeneficiary.name}</span></span>
                    </div>
                    <div className="select__right">
                        {isPending ? (
                            <span className="select__right__pending">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.pending' })}</span>
                        ) : null}
                        <span className="select__right__tip" onMouseOver={handleToggleTip} onMouseOut={handleToggleTip}><TipIcon/></span>
                        <span className="select__right__select">{formatMessage({ id: 'page.body.wallets.beneficiaries.dropdown.select' })}</span>
                        <span className="select__right__chevron"><ChevronIcon /></span>
                    </div>
                </div>
                {isOpenDropdown && renderDropdownBody()}
                {isOpenTip && renderDropdownTipCrypto()}
            </div>
        );
    }, [
        currentWithdrawalBeneficiary.name,
        currentWithdrawalBeneficiary.state,
        currentWithdrawalBeneficiary.data,
        formatMessage,
        handleToggleDropdown,
        handleToggleTip,
        isOpenDropdown,
        isOpenTip,
        renderDropdownBody,
        renderDropdownTipCrypto,
        renderDropdownTipFiat,
        type,
    ]);

    const handleFilterByCurrency = React.useCallback(() => {
        if (beneficiaries.length && currency) {
            return beneficiaries.filter(item => item.currency.toLowerCase() === currency.toLowerCase());
        }

        return [];
    }, [beneficiaries, currency]);

    const handleFilterByState = React.useCallback((bnfs: Beneficiary[], filter: string | string[]) => {
        if (bnfs.length) {
            return bnfs.filter(item => filter.includes(item.state.toLowerCase()));
        }

        return [];
    }, []);

    const handleSetCurrentAddressOnUpdate = React.useCallback(() => {
        const filteredByCurrency = handleFilterByCurrency();
        let filteredByState = handleFilterByState(filteredByCurrency, 'active');

        if (!filteredByState.length) {
            filteredByState = handleFilterByState(filteredByCurrency, 'pending');
        }

        if (filteredByState.length) {
            handleSetCurrentAddress(filteredByState[0]);
        }
    }, [handleFilterByCurrency, handleFilterByState, handleSetCurrentAddress]);

    const filtredBeneficiaries = React.useMemo(() => handleFilterByState(handleFilterByCurrency(), ['active', 'pending']), [handleFilterByCurrency, handleFilterByState]);

    React.useEffect(() => {
        if (currency && beneficiaries.length) {
            handleSetCurrentAddressOnUpdate();
        }
        // eslint-disable-next-line
    }, [currency]);

    React.useEffect(() => {
        dispatch(memberLevelsFetch());
        // eslint-disable-next-line
    }, []);

    return (
        <div className="pg-beneficiaries">
            <span className="pg-beneficiaries__title">{type === 'coin' ? formatMessage({ id: 'page.body.wallets.beneficiaries.title' }) : formatMessage({ id: 'page.body.wallets.beneficiaries.fiat.title' })}</span>
            {filtredBeneficiaries.length ? renderAddressDropdown() : renderAddAddress()}
            {isOpenAddressModal && (
                <BeneficiariesAddModal
                    currency={currency}
                    type={type}
                    handleToggleAddAddressModal={handleToggleAddAddressModal}
                    handleToggleConfirmationModal={handleToggleConfirmationModal}
                />
            )}
            {isOpenConfirmationModal && (
                <BeneficiariesActivateModal
                    beneficiariesAddData={beneficiariesAddData}
                    handleToggleConfirmationModal={handleToggleConfirmationModal}
                />
            )}
            {isOpenFailModal && (
                <BeneficiariesFailAddModal
                    isMobileDevice={isMobileDevice}
                    handleToggleFailModal={handleToggleFailModal}
                />
            )}
        </div>
    );
};
