import cr from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ArrowRightIcon } from 'src/assets/images/ArrowRightIcon';
import { CloseScreenIcon } from 'src/assets/images/CloseScreenIcon';
import { LogoutIcon } from 'src/assets/images/sidebar/LogoutIcon';
import { Logo } from 'src/components';
import { SearchBox } from '../../components';
import { organizationAccountsFetch, organizationAccountsReset, organizationAccountSwitch, selectOrganizationAccounts, userFetch } from 'src/modules';
import { setDocumentTitle } from '../../helpers';
import { Spinner } from 'react-bootstrap';

export const SwitchAccountScreen: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);
    const [loading, setLoading] = useState<boolean>(false);
    const accounts = useSelector(selectOrganizationAccounts);
    
    useEffect(() => {
        setDocumentTitle('Switch Account');

        const initialPayload = {
            page: 0,
            limit: 20,
            keyword: '',
        };
        
        dispatch(organizationAccountsFetch(initialPayload));

        return () => {
            dispatch(organizationAccountsReset());
        };
    }, [dispatch]);

    const handleSearchAccounts = useCallback((keyword: string) => {
        const payload = {
            page: 0,
            limit: 20,
            keyword,
        };

        dispatch(organizationAccountsFetch(payload));
    }, []);

    const handleSwitchAccount = useCallback((oid, uid) => {
        const payload = { oid, uid };
        dispatch(organizationAccountSwitch(payload));
        setLoading(true);
        setTimeout(() => {
            dispatch(userFetch());
            history.goBack();
        }, 1500);
    }, []);

    const getSearchLabel = useCallback(label => {
        const labelClass = cr('pg-switch-account__container__body__accounts__item',
            'pg-switch-account__container__body__accounts__item__label',
        );

        return (<div className={labelClass}>{label}</div>);
    }, []);

    const renderAccounts = useMemo(() => {
        const searchList = accounts.length ? [
                    getSearchLabel('ALL'),
                    ...accounts.map(account => {
                        return (
                            <div className="pg-switch-account__container__body__accounts__item" onClick={() => handleSwitchAccount(account.oid, account.uid)}>
                                <div className="pg-switch-account__container__body__accounts__item__name">{account.name}</div>
                                <div className="pg-switch-account__container__body__accounts__item__uid">{account.oid || account.uid}</div>
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
            {loading ?
                <div className="pg-loader-container">
                    <Spinner animation="border" variant="primary" />
                </div>
                : null
            }
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
