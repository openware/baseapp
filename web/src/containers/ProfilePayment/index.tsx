import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { PaymentMethodModal } from './PaymentMethodModal';
import { titleCase } from 'src/helpers';
import { useP2PPaymentMethodsFetch, useUserPaymentMethodsFetch } from 'src/hooks';
import { PaymentMethod, selectP2PPaymentMethodsData, selectPaymentMethodList, selectPaymentMethodModal } from 'src/modules';
import { paymentMethodCreateFetch, paymentMethodDeleteFetch, paymentMethodUpdateFetch, paymentMethodModal } from 'src/modules';

export interface PaymentOptionInterface {
    name: string;
    required: boolean;
    options: string[];
    value?: string;
}

export const ProfilePayment: FC = (): ReactElement => {
    const [ paymentOptions, setPaymentOptions ] = useState<PaymentOptionInterface[]>([]);
    const [ searchKeyword, setSearchKeyword ] = useState<string>('');
    const [ filteredPaymentMethods, setFilteredPaymentMethods ] = useState<PaymentMethod[]>([]);
    const paymentMethods = useSelector(selectP2PPaymentMethodsData);
    const userPaymentMethods = useSelector(selectPaymentMethodList);
    const modal = useSelector(selectPaymentMethodModal);
    const dispatch = useDispatch();

    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, value), [formatMessage]);

    useP2PPaymentMethodsFetch();
    useUserPaymentMethodsFetch();

    const createPaymentMethod = useCallback(() => {
        dispatch(paymentMethodModal({active: true, action: 'createStep1'}));
    }, [dispatch]);

    const deletePaymentMethod = useCallback((item) => {
        dispatch(paymentMethodModal({active: true, action: 'delete', id: item.id, name: item.name}));
    }, [dispatch]);

    const editPaymentMethod = useCallback((item) => {
        const paymentMethod = userPaymentMethods.find(pm => pm.id === item.id);
        if (!paymentMethod) {
            return;
        }

        const optionData = [];

        Object.keys(paymentMethod.data).map(key => {
            const option = paymentMethod.data[key];
            optionData.push({
                name: key,
                required: option.required,
                options: option.options,
                value: item.data[key],
            });
        });

        setPaymentOptions(optionData);

        dispatch(paymentMethodModal({
            active: true,
            action: 'update',
            id: item.id,
            name: item.name,
            data: item.data,
        }));
    }, [userPaymentMethods, dispatch]);

    const handleHideModal = useCallback(() => {
        dispatch(paymentMethodModal({active: false}));
    }, [dispatch]);

    const handleDelete = useCallback(() => {
        if (modal.id) {
            dispatch(paymentMethodDeleteFetch({id: modal.id}));
        }
    }, [dispatch, modal]);

    const pickPaymentMethodToAdd = useCallback((paymentMethod) => {
        const optionData = [];

        Object.keys(paymentMethod.options).map(key => {
            const option = paymentMethod.options[key];
            optionData.push({
                name: key,
                required: option.required,
                options: option.options,
                value: '',
            });
        });

        setPaymentOptions(optionData);

        dispatch(paymentMethodModal({
            active: true,
            action: 'createStep2',
            id: paymentMethod.id,
            name: paymentMethod.name
        }));
    }, [dispatch]);

    const handleCustomFieldChange = useCallback((value: string, name: string) => {
        const option = paymentOptions.find(p => p.name === name);
        const index = paymentOptions.indexOf(option);
        option.value = value;
        setPaymentOptions([...paymentOptions.slice(0, index), option, ...paymentOptions.slice(index + 1)]);
    }, [paymentOptions]);

    const addPaymentMethodConfirm = useCallback(() => {
        const customFields = {};
        paymentOptions.map(option => customFields[option.name] = option.value);
        dispatch(paymentMethodCreateFetch({
            pm_id: modal.id,
            data: customFields,
        }));
    }, [paymentOptions, dispatch]);

    const updatePaymentMethodConfirm = useCallback(() => {
        const customFields = {};
        paymentOptions.map(option => customFields[option.name] = option.value);
        dispatch(paymentMethodUpdateFetch({
            pm_id: modal.id,
            data: customFields,
        }));
    }, [dispatch, paymentOptions]);

    const renderPaymentMethodItem = item => {
        return (
            <div className="payment-method-item">
                <div className="payment-method-item-header">
                    <div className="payment-method-item-header-left">
                        <div className="payment-method-item-header-left__logo">
                            <img src={`data:image/png;base64,${item.logo}`} alt=""/>
                        </div>
                        <div className="payment-method-item-header-left__title">{item.name}</div>
                    </div>
                    <div className="payment-method-item-header-right">
                        <div className="payment-method-item-edit" onClick={() => editPaymentMethod(item)}>
                            {translate('page.body.profile.payment.button.edit')}
                        </div>
                        <div className="payment-method-item-delete" onClick={() => deletePaymentMethod(item)}>
                            {translate('page.body.profile.payment.button.delete')}
                        </div>
                    </div>
                </div>
                <div className="payment-method-item-body">
                    {
                        Object.keys(item.data).map(key => {
                            const value = item.data[key];
                            return (
                                <div className="payment-method-item-body__col">
                                    <div>{value}</div>
                                    <label>{titleCase(key)}</label>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    };

    const handleSetSearchKeyword = useCallback((value: string) => {
        if (value) {
            const filtered = paymentMethods.filter(pm => pm.name.toLowerCase().includes(value.toLowerCase()));
            setFilteredPaymentMethods(filtered);
        } else {
            setFilteredPaymentMethods([])
        }

        setSearchKeyword(value);
    }, [setSearchKeyword, paymentMethods, setFilteredPaymentMethods]);

    return (
        <div className="pg-profile-page__payment">
            <div className="pg-profile-page-header">{translate('page.body.profile.tabs.payment')}</div>
            <div className="pg-profile-page__payment-body">
                <h2>{translate('page.body.profile.payment.title')}</h2>
                <p>{translate('page.body.profile.payment.desc')}</p>
                <div className="payment-method-list">
                    {userPaymentMethods && userPaymentMethods.length && userPaymentMethods.map(renderPaymentMethodItem)}
                </div>
                <Button
                    onClick={createPaymentMethod}
                    size="lg"
                    variant="primary"
                >
                    {translate('page.body.profile.payment.button.add')}
                </Button>
            </div>
            <PaymentMethodModal
                modal={modal}
                paymentOptions={paymentOptions}
                paymentMethods={paymentMethods}
                searchKeyword={searchKeyword}
                filtered={filteredPaymentMethods}
                translate={translate}
                hideModal={handleHideModal}
                pickPaymentMethodToAdd={pickPaymentMethodToAdd}
                handleCustomFieldChange={handleCustomFieldChange}
                addPaymentMethodConfirm={addPaymentMethodConfirm}
                updatePaymentMethodConfirm={updatePaymentMethodConfirm}
                handleDelete={handleDelete}
                setSearchKeyword={handleSetSearchKeyword}
            />
        </div>
    );
};
