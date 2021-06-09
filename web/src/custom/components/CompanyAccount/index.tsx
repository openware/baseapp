import React, { useCallback, useMemo } from 'react';
import classnames from 'classnames';
import { useIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { changePasswordFetch, entropyPasswordFetch, selectCurrentPasswordEntropy, selectUserInfo } from 'src/modules';
import { isUsernameEnabled } from 'src/api';
import { ChangePassword } from 'src/components';
import { DownloadBalance } from '..';

const CompanyAccountComponent: React.FC = () => {
    const [showChangePasswordModal, setShowChangePasswordModal] = React.useState<boolean>(false);
    const [showDownloadBalanceModal, setShowDownloadBalanceModal] = React.useState<boolean>(false);

    const { formatMessage } = useIntl();    
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const currentPasswordEntropy = useSelector(selectCurrentPasswordEntropy);

    const renderCompanyDetail = useMemo(() => {
        return (
            <div className="company-info">
                <div className="company-info__icon"></div>
                <div className="company-info__content">
                    <div className="company-info__content__name">{user.organization?.name}</div>
                    <div className="company-info__content__id">{user.organization?.oid}</div>
                </div>
                <div className="company-info__status">{translate('page.body.profile.company.status.active')}</div>
            </div>
        );
    }, [user]);

    const renderAccountDetail = useMemo(() => {
        return (
            <div className="company-info__content">
                <div className="company-info__content__name">{isUsernameEnabled() ? user.username : user.email}</div>
                <div className="company-info__content__id">{user.uid}</div>
            </div>
        )
    }, [user]);

    const handleChangePassword = useCallback(({ old_password, new_password, confirm_password }) => {
        dispatch(changePasswordFetch({ old_password, new_password, confirm_password }));
    }, []);

    const toggleChangePasswordModal = useCallback(() => {
        setShowChangePasswordModal(!showChangePasswordModal);
    }, [showChangePasswordModal]); 

    const fetchCurrentPasswordEntropy = useCallback(payload => {
        dispatch(entropyPasswordFetch(payload));
    }, []);

    const changePasswordModal = useMemo(() => {
        return (
            showChangePasswordModal ?
            <div className="cr-modal">
                <form className="cr-email-form">
                    <div className="pg-change-password-screen">
                        <ChangePassword
                            handleChangePassword={handleChangePassword}
                            title={translate('page.body.profile.header.account.content.password.change')}
                            closeModal={toggleChangePasswordModal}
                            currentPasswordEntropy={currentPasswordEntropy}
                            fetchCurrentPasswordEntropy={fetchCurrentPasswordEntropy}
                        />
                    </div>
                </form>
            </div>
            : null
        );
    }, [showChangePasswordModal, currentPasswordEntropy]);

    const toggleDownloadBalanceModal = useCallback(() => {
        setShowDownloadBalanceModal(!showDownloadBalanceModal);
    }, [showDownloadBalanceModal]);

    const handleDownloadBalance = useCallback((startDate, endDate) => {
        //TODO: implement download balance

        setShowDownloadBalanceModal(false);
    }, []);

    const downloadBalanceModal = useMemo(() => {
        return (
            showDownloadBalanceModal ?
            <div className="cr-modal">
                <DownloadBalance 
                    title={translate('page.body.profile.header.company.profile.downloadBalance.title')}
                    closeModal={toggleDownloadBalanceModal}
                    handleDownloadBalance={handleDownloadBalance}
                />
            </div>
            : null
        );
    }, [showDownloadBalanceModal]);

    return (
        <React.Fragment>
            {changePasswordModal}
            {downloadBalanceModal}
            <div className="cr-company-account">
                <div className="cr-company-account__title">{translate('page.body.profile.header.company.profile.detail')}</div>
                <div className="cr-company-account__content">
                    <div className="cr-company-account__content__left">
                        {renderCompanyDetail}
                    </div>
                    <div className="cr-company-account__content__right">
                        <Button
                            className="cr-company-account__content__right__download"
                            onClick={toggleDownloadBalanceModal}
                            size="lg"
                            variant="primary"
                        >
                            {translate('page.body.profile.header.company.profile.downloadBalance.button')}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="cr-company-account">
                <div className="cr-company-account__title">{translate('page.body.profile.header.company.profile.account')}</div>
                <div className="cr-company-account__content">
                    <div className="cr-company-account__content__left">
                        <div className="company-info">
                            {renderAccountDetail}
                        </div>
                    </div>
                    <div className="cr-company-account__content__right">
                        <Button
                            className="cr-company-account__content__right__download"
                            onClick={toggleChangePasswordModal}
                            size="lg"
                            variant="primary"
                        >
                            {translate('page.body.profile.header.company.profile.changePassword')}
                        </Button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
};

export const CompanyAccount = React.memo(CompanyAccountComponent);
