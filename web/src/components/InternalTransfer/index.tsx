import classnames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { DropdownComponent, Decimal } from '../';
import { isUsernameEnabled } from '../../api';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { Modal } from '../../components';
import {
    createInternalTransfersFetch,
    selectInternalTransfersCreateSuccess,
    selectUserInfo,
    selectWallets,
    walletsFetch,
} from '../../modules';
import { InternalTransferInput } from './InternalInput';

export const InternalTransferComponent = () => {
    const { formatMessage } = useIntl();

    const dispatch = useDispatch();
    const history = useHistory();
    const wallets = useSelector(selectWallets);
    const user = useSelector(selectUserInfo);
    const transferSuccess = useSelector(selectInternalTransfersCreateSuccess);

    const [username, setUsername] = useState('');
    const [currency, setCurrency] = useState('');
    const [amount, setAmount] = useState('');
    const [otp, setOtp] = useState('');
    const [clear, setClear] = useState(true);

    const [show, setShow] = useState(false);

    React.useEffect(() => {
        dispatch(walletsFetch());
        setClear(false);
    }, []);

    React.useEffect(() => {
        if (transferSuccess) {
            handleResetState();
            setClear(true);
        }
    }, [transferSuccess]);

    const walletsList = wallets.length ? wallets.map(item => item.currency && item.currency.toUpperCase()) : [];

    const wallet = wallets.length && wallets.find(item => item.currency.toLowerCase() === currency.toLowerCase());

    const balanceError = useMemo(() => classnames('cr-internal-transfer__group--balance', {
        'cr-internal-transfer__group--error': wallet && wallet.balance && +wallet.balance < +amount,
    }), [amount, wallet]);

    const translationUsername = isUsernameEnabled() ? 'username' : 'uid';

    const handleCreateTransfer = useCallback(() => {
        const payload = {
            currency: currency.toLowerCase(),
            username_or_uid: username,
            amount,
            otp
        };

        dispatch(createInternalTransfersFetch(payload));
        setShow(false);
    }, [username, otp, amount, currency, dispatch]);

    const translate = useCallback((id: string) => formatMessage({ id: id }), [formatMessage]);

    const handleNavigateTo2fa = useCallback((enable2fa: boolean) => {
        history.push('/security/2fa', { enable2fa });
    }, []);

    const handleResetState = () => {
        setShow(false);
        setUsername('');
        setCurrency('');
        setAmount('');
        setOtp('');
        setClear(false);
    }

    const renderFooter = useMemo(() => {
        return (
            <Button
                block={true}
                type="button"
                onClick={handleCreateTransfer}
                size="lg"
                variant="primary"
            >
                {translate('page.body.internal.transfer.continue')}
            </Button>
        );
    }, [username, otp, amount, currency, handleCreateTransfer, translate]);

    const renderHeader = useMemo(() => {
        return (
            <React.Fragment>
                <div className="cr-modal__container-header-text">
                    {translate('page.body.internal.transfer.header')}
                </div>
                <CloseIcon className={'cr-modal__container-header-cancel'} onClick={() => setShow(false)}/>
            </React.Fragment>
        );
    }, [translate, setShow]);

    const renderBody = useMemo(() => {
        return (
            <React.Fragment>
                <div className="cr-modal__container-content__transfer">
                    {translate('page.body.internal.transfer.modal.content.transfer')}
                    <span><Decimal fixed={wallet ? wallet.fixed : 0} thousSep=",">{amount.toString()}</Decimal>{currency}</span>
                    {translate('page.body.internal.transfer.modal.content.to')}
                    <span>{username}</span>
                    {translate('page.body.internal.transfer.modal.content.account')}
                </div>
                <div className="cr-modal__container-content--notice">
                    {translate(`page.body.internal.transfer.notice.${translationUsername}`)}
                </div>
            </React.Fragment>
        );
    }, [translate, translationUsername, amount, currency, username]);

    return (
        <div className="cr-internal-transfer">
            <div className="cr-internal-transfer__header">{translate('page.body.internal.transfer.header')}</div>
            <div className="cr-internal-transfer__inputs">
                <InternalTransferInput
                    field={translationUsername}
                    handleChangeInput={setUsername}
                    value={username}
                />
                <div className="cr-internal-transfer__group">
                    <InternalTransferInput
                        field="amount"
                        handleChangeInput={setAmount}
                        value={amount}
                        fixed={wallet ? wallet.fixed : 0}
                    />
                    <DropdownComponent
                        className="pg-confirm__content-address__row__content-number-dropdown"
                        list={walletsList}
                        onSelect={value => setCurrency(walletsList[value])}
                        placeholder="Currency"
                        clear={clear}
                    />
                    <div
                        onClick={() => setAmount(wallet ? Decimal.format(wallet.balance, wallet.fixed, '.') : '')}
                        className={balanceError}
                    >
                        {translate('page.body.internal.transfer.account.balance')}
                        {wallet && wallet.balance && currency !== '' ? (
                            <Decimal fixed={wallet ? wallet.fixed : 0} thousSep=",">
                                {wallet.balance.toString()}
                            </Decimal>
                        ) : 0} {currency}
                        {(wallet && wallet.balance && +wallet.balance < +amount) ? (
                            translate('page.body.internal.transfer.insufficient.balance')
                        ) : null}
                    </div>
                </div>
                <InternalTransferInput
                    field="otp"
                    handleChangeInput={setOtp}
                    value={otp}
                />
            </div>
            <div className="cr-internal-transfer__inputs">
                <Button
                    block={true}
                    type="button"
                    onClick={() => setShow(!show)}
                    size="lg"
                    variant="primary"
                    disabled={!username || !otp || !(+amount) || !currency || !(wallet && wallet.balance && +wallet.balance >= +amount)}
                >
                        {translate('page.body.internal.transfer.continue')}
                </Button>
            </div>
            <Modal
                show={show}
                header={renderHeader}
                content={renderBody}
                footer={renderFooter}
            />
            {!user.otp && <div className="cr-internal-transfer--require-otp">
                {translate('page.body.internal.transfer.please.enable.2fa')}
                <div onClick={() => handleNavigateTo2fa(true)} className="cr-internal-transfer--require-otp-link">
                    {translate('page.body.internal.transfer.enable')}
                </div>
            </div>}
        </div>
    );
};
