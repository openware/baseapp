import cr from 'classnames';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ArrowRightIcon } from 'src/assets/images/ArrowRightIcon';
import { CloseScreenIcon } from 'src/assets/images/CloseScreenIcon';
import { LogoutIcon } from 'src/assets/images/sidebar/LogoutIcon';
import { Logo } from 'src/components';
import { SearchBox } from 'src/custom/components';
import { organizationAccountsFetch, organizationAccountSwitch, selectOrganizationAccounts } from 'src/modules';
import { setDocumentTitle } from '../../../helpers';

export const SwitchAccountScreen: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

    const accounts = useSelector(selectOrganizationAccounts);
    
    useEffect(() => {
        setDocumentTitle('Switch Account');
    }, [dispatch]);

    const handleSearchAccounts = useCallback((keyword: string) => {
        const payload = {
            page: 0,
            limit: 20,
            keyword,
        };

        dispatch(organizationAccountsFetch(payload));
    }, []);

    const handleSwitchAccount = useCallback(oid => {
        const payload = { oid };
        dispatch(organizationAccountSwitch(payload));
    }, []);

    const getSearchLabel = useCallback(label => {
        const labelClass = cr('pg-switch-account__container__body__accounts__item',
            'pg-switch-account__container__body__accounts__item__label',
        );

        return (<div className={labelClass}>{label}</div>);
    }, []);

    const renderAccounts = useMemo(() => {
        const list = accounts.reduce((acc, org) => {
            return [...acc, ...org.uids.map(uid => { return {name: org.name, uid, oid: org.oid}})];
        }, []);

        const searchList = list.length ? [
                    getSearchLabel('ALL'),
                    ...list.map(account => {
                        return (
                            <div className="pg-switch-account__container__body__accounts__item" onClick={() => handleSwitchAccount(account.oid)}>
                                <div className="pg-switch-account__container__body__accounts__item__name">{account.name}</div>
                                <div className="pg-switch-account__container__body__accounts__item__uid">{account.uid}</div>
                                <ArrowRightIcon />
                            </div>
                        );
                    })
                ]
         : [];

        return (
            <div className="pg-switch-account__container__body__accounts">
                {searchList}
            </div>
        );
    }, [accounts])

    return (
        <div className="pg-switch-account">
            <div className="pg-switch-account__container">
                <div className="pg-switch-account__container__header">
                    <Logo />
                    <CloseScreenIcon className="close-icon" onClick={() => history.goBack()}/>
                </div>
                <div className="pg-switch-account__container__body">
                    <div className="pg-switch-account__container__body__description">
                        <div className="pg-switch-account__container__body__description__left">Switch Account</div>
                        <div className="pg-switch-account__container__body__description__right">
                        <div className="button" onClick={() => null}>
                            Login to Default Account
                            <LogoutIcon />
                        </div>
                        </div>
                    </div>
                    <SearchBox
                        placeholder={translate('page.body.profile.account.switch.search')}
                        searchMethod={handleSearchAccounts}
                    />
                    {renderAccounts}
                </div>
            </div>
        </div>
    );
};
