import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { CustomInput } from '../../components';
import { useP2PPaymentMethodsFetch, useUserPaymentMethodsFetch } from 'src/hooks';
import { selectP2PPaymentMethodsData, selectPaymentMethodList, selectPaymentMethodModal } from 'src/modules';
import { paymentMethodCreateFetch, paymentMethodDeleteFetch, paymentMethodUpdateFetch, paymentMethodModal } from 'src/modules';

export interface PaymentOptionInterface {
    name: string;
    required: boolean;
    options: string[];
    value?: string;
}

export const ProfilePayment: FC = (): ReactElement => {
    const [ paymentOptions, setPaymentOptions ] = React.useState<PaymentOptionInterface[]>([]);
    const paymentMethods = useSelector(selectP2PPaymentMethodsData);
    const userPaymentMethods = useSelector(selectPaymentMethodList);
    const modal = useSelector(selectPaymentMethodModal);
    const dispatch = useDispatch();

    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, value), [formatMessage]);

    useP2PPaymentMethodsFetch();
    useUserPaymentMethodsFetch();

    const createPaymentMethod = React.useCallback(() => {
        dispatch(paymentMethodModal({active: true, action: 'createStep1'}));
    }, [dispatch]);

    const deletePaymentMethod = React.useCallback((item) => {
        dispatch(paymentMethodModal({active: true, action: 'delete', id: item.id, name: item.name}));
    }, [dispatch]);

    const editPaymentMethod = React.useCallback((item) => {
        const paymentMethod = paymentMethods.find(pm => pm.id === item.id);
        if (!paymentMethod) {
            return;
        }

        const optionData = [];

        Object.keys(paymentMethod.options).map(key => {
            const option = paymentMethod.options[key];
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
    }, [paymentMethods, dispatch]);

    const handleHideModal = React.useCallback(() => {
        dispatch(paymentMethodModal({active: false}));
    }, [dispatch]);

    const handleDelete = React.useCallback(() => {
        if (modal.id) {
            dispatch(paymentMethodDeleteFetch({id: modal.id}));
        }
    }, [dispatch]);

    const renderModalHeader = React.useCallback(() => {
        let headerText = '';

        switch (modal.action) {
            case 'createStep1':
            case 'createStep2':
                headerText = translate('page.body.profile.payment.modal.header.create');
                break;
            case 'update':
                headerText = translate('page.body.profile.payment.modal.header.update');
                break;
            case 'delete':
                headerText = translate('page.body.profile.payment.modal.header.delete');
                break;
            default:
                break;
        }

        return (
            <div className="cr-email-form__options-group">
                <div className="cr-email-form__option">
                    <div className="cr-email-form__option-inner">
                        {headerText}
                        <span
                            className="pg-profile-page__close pg-profile-page__pull-right"
                            onClick={handleHideModal}
                        />
                    </div>
                </div>
            </div>
        );
    }, [translate, modal]);

    const renderModalBody = React.useCallback(() => {
        let body;
        let button;
        
        switch (modal.action) {
            case 'createStep1':
                body = (
                    <div>
                        {popularPaymentMethods()}
                    </div>                    
                );
                break;
            case 'createStep2':
                const {logo, options} = paymentMethods.find(p => p.id === modal.id);
                body = (
                    <div>
                        <div className="picked-payment-method">
                            {logo ? <img src={`data:image/png;base64,${logo}`} alt=""/> : null}
                            {modal.name}
                        </div>
                        <div className="holder-name">
                            <label>{translate('page.body.profile.payment.modal.body.holderName')}</label>
                            {options?.user}
                        </div>
                        <div className="custom-fields">
                            {
                                paymentOptions.map(option =>
                                    <div className="cr-email-form__group">
                                        <CustomInput
                                            type="text"
                                            label={option.name}
                                            defaultLabel={option.name}
                                            placeholder={option.name}
                                            inputValue={option.value}
                                            handleChangeInput={(value, name?) => handleCustomFieldChange(value, option.name)}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                );
                button = (
                    <div>
                        <Button
                            onClick={addPaymentMethodConfirm}
                            size="lg"
                            variant="primary"
                            block={true}
                        >{translate('page.body.profile.payment.modal.body.confirm')}</Button>
                    </div>
                );
                break;
            case 'update':
                const pm = paymentMethods.find(p => p.id === modal.id);
                body = (
                    <div>
                        <div className="picked-payment-method">
                            {pm?.logo ? <img src={`data:image/png;base64,${pm.logo}`} alt=""/> : null}
                            {modal.name}
                        </div>
                        <div className="holder-name">
                            <label>{translate('page.body.profile.payment.modal.body.holderName')}</label>
                        </div>
                        <div className="custom-fields">
                            {
                                paymentOptions.map(option =>
                                    <div className="cr-email-form__group">
                                        <CustomInput
                                            type="text"
                                            label={option.name}
                                            defaultLabel={option.name}
                                            placeholder={option.name}
                                            inputValue={option.value ? option.value : ''}
                                            handleChangeInput={(value, name?) => handleCustomFieldChange(value, option.name)}
                                        />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                );
                button = (
                    <div>
                        <Button
                            onClick={updatePaymentMethodConfirm}
                            size="lg"
                            variant="primary"
                            block={true}
                        >{translate('page.body.profile.payment.modal.body.confirm')}</Button>
                    </div>
                );
                break
            case 'delete':
                body = (
                    <div className="cr-email-form__form-content">
                        <p>{formatMessage({id: 'page.body.profile.payment.modal.body.sureDelete'}, {name: modal.name})}?</p>
                    </div>
                );
                button = (
                    <div>
                        <Button
                            onClick={handleDelete}
                            size="lg"
                            variant="primary"
                            block={true}
                        >{translate('page.body.profile.payment.modal.body.yes')}</Button>
                        <Button
                            onClick={handleHideModal}
                            size="lg"
                            variant="light"
                            block={true}
                        >{translate('page.body.profile.payment.modal.body.no')}</Button>
                    </div>
                );
                break;
            default:
                break;
        }

        return (
            <React.Fragment>
                <div className="cr-email-form__form-content">
                    {body}
                    {button}
                </div>
            </React.Fragment>
        );
    }, [translate, modal, paymentOptions, paymentMethods]);

    const popularPaymentMethods = React.useCallback(() => {
        return paymentMethods && paymentMethods.length ? (
            <div className="popular-payment-methods">
                {paymentMethods.map(item => (
                    <div className="popular-payment-method" onClick={() => pickPaymentMethodToAdd(item)}>
                        <img src={`data:image/png;base64,${item.logo}`} alt=""/>
                        {item.name}
                    </div>
                ))}
            </div>
        ) : null;
    }, [paymentMethods]);

    const pickPaymentMethodToAdd = React.useCallback((paymentMethod) => {
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

    const handleCustomFieldChange = React.useCallback((value: string, name: string) => {
        const option = paymentOptions.find(p => p.name === name);
        const index = paymentOptions.indexOf(option);
        option.value = value;
        setPaymentOptions([...paymentOptions.slice(0, index), option, ...paymentOptions.slice(index + 1)]);
    }, [paymentOptions]);

    const addPaymentMethodConfirm = React.useCallback(() => {
        const customFields = {};
        paymentOptions.map(option => customFields[option.name] = option.value);
        dispatch(paymentMethodCreateFetch({
            pm_id: modal.id,
            data: customFields,
        }));
    }, [paymentOptions, dispatch]);

    const updatePaymentMethodConfirm = React.useCallback(() => {
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
                                    <label>{key}</label>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    };

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
            {modal.active ? (
                <div className="cr-modal">
                    <div className="cr-email-form">
                        {renderModalHeader()}
                        {renderModalBody()}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
