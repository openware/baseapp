import classnames from 'classnames';
import React, { FC, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { CustomInput, DropdownComponent } from 'src/components';
import { titleCase } from 'src/helpers';
import { PaymentOptionInterface } from './';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentMethod, PaymentMethodStateModal } from 'src/modules';
import { HOST_URL } from 'src/constants';

export interface PaymentMethodModalProps {
    paymentOptions: PaymentOptionInterface[];
    paymentMethods: PaymentMethod[];
    filtered: PaymentMethod[];
    searchKeyword: string;
    modal: PaymentMethodStateModal;
    translate: (id: string, value?: any) => string;
    hideModal: () => void;
    pickPaymentMethodToAdd: (item: PaymentMethod) => void;
    handleCustomFieldChange: (value: string, key: any) => void;
    addPaymentMethodConfirm: () => void;
    updatePaymentMethodConfirm: () => void;
    handleDelete: () => void;
    setSearchKeyword: (keyword: string) => void;
}

export const PaymentMethodModal: FC<PaymentMethodModalProps> = props => {
    const [ showError, setShowError ] = useState<boolean>(false);
    const { searchKeyword, paymentMethods, paymentOptions, modal, translate } = props;

    const renderHeader = useCallback(() => {
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

        return (<div className="cr-email-form__options-group">
            <div className="cr-email-form__option">
                <div className="cr-email-form__option-inner">
                    {headerText}
                    <span
                        className="pg-profile-page__close pg-profile-page__pull-right"
                        onClick={props.hideModal}
                    />
                </div>
            </div>
        </div>);
    }, [modal, translate]);

    const popularPaymentMethods = useCallback(() => {
        return paymentMethods && paymentMethods.length ? (
            <div className="popular-payment-methods">
                {paymentMethods.map(item => (
                    <div className="popular-payment-method" onClick={() => props.pickPaymentMethodToAdd(item)}>
                        <img className="payment-method-logo ml-2 mr-3 mb-1" src={`${HOST_URL}/api/v2/p2p/public/payment_methods/${item.id}/logo`} alt=""/>
                        {item.name}
                    </div>
                ))}
            </div>
        ) : null;
    }, [paymentMethods]);

    const handleAddSubmit = useCallback(() => {
        const hasError = paymentOptions.some(option => option.required && !option.value);
        setShowError(hasError);
        if (!hasError) {
            props.addPaymentMethodConfirm();
        }
    }, [paymentOptions]);

    const handleUpdateSubmit = useCallback(() => {
        const hasError = paymentOptions.some(option => option.required && !option.value);
        setShowError(hasError);
        if (!hasError) {
            props.updatePaymentMethodConfirm();
        }
    }, [paymentOptions]);

    const inputClass = useCallback((option: PaymentOptionInterface) => (
        classnames('cr-email-form__group', {
            'require-error': showError && option.required && !option.value,
        })
    ), [showError]);

    const renderCustomFields = useCallback((paymentOptions) => {
        return paymentOptions.map(option => {
            switch (option.type) {
                case 'dropdown':
                    return (
                        <div className={inputClass(option)}>
                            <DropdownComponent
                                list={option.options.map(i => i?.value)}
                                onSelect={value => props.handleCustomFieldChange(option.options[value].value, option.key)}
                                placeholder={option.value}
                            />
                            {showError && option.required && !option.value &&
                                <span className="error">{translate('page.body.profile.payment.modal.error.empty', {name: titleCase(option.name)})}</span>}
                        </div>
                    );
                default:
                    const keyContainsNumber = option.key.includes('number');
                    if (modal.action === 'update' && keyContainsNumber && !option.flag) {
                        option.value = '';
                        option.flag = true;
                    }

                    return (
                        <div className={inputClass(option)}>
                            <CustomInput
                                type="text"
                                label={option.description ? option.description : titleCase(option.key)}
                                defaultLabel={option.description ? option.description : titleCase(option.key)}
                                placeholder={option.name ? option.name : titleCase(option.key)}
                                inputValue={option.value}
                                handleChangeInput={value => props.handleCustomFieldChange(value, option.key)}
                            />
                            {showError && option.required && !option.value &&
                                <span className="error">{translate('page.body.profile.payment.modal.error.empty', {name: titleCase(option.name)})}</span>}
                        </div>
                    );
            }            
        });
    }, [showError, paymentMethods, paymentOptions, props.handleCustomFieldChange]);

    const renderModalBody = useCallback(() => {
        let body;
        let button;
        
        switch (props.modal.action) {
            case 'createStep1':
                body = (
                    <React.Fragment>
                        <PaymentMethodSelector
                            paymentMethods={props.filtered}
                            searchKeyword={searchKeyword}
                            setSearchKeyword={props.setSearchKeyword}
                            selectPaymentMethod={(pm) => props.pickPaymentMethodToAdd(pm)}
                            translate={translate}
                        />
                        <label>{translate('page.body.profile.payment.modal.body.popular')}</label>
                        {popularPaymentMethods()}
                    </React.Fragment>
                );
                break;
            case 'createStep2':
                const pm = paymentMethods.find(p => +p.id === +modal.payment_method_id);
                body = (
                    <div>
                        <div className="picked-payment-method">
                            {pm && <img className="payment-method-logo ml-2 mr-3 mb-1" src={`${HOST_URL}/api/v2/p2p/public/payment_methods/${pm.id}/logo`} alt=""/>}
                            {pm?.name}
                        </div>
                        <div className="custom-fields">
                            {renderCustomFields(paymentOptions)}
                        </div>
                    </div>
                );
                button = (
                    <div>
                        <Button
                            onClick={handleAddSubmit}
                            size="lg"
                            variant="primary"
                            block={true}
                        >{translate('page.body.profile.payment.modal.body.confirm')}</Button>
                    </div>
                );
                break;
            case 'update':
                const pmUpdate = paymentMethods.find(p => +p.id === +modal.payment_method_id);
                body = (
                    <div>
                        <div className="picked-payment-method">
                            {pmUpdate && <img className="payment-method-logo ml-2 mr-3 mb-1" src={`${HOST_URL}/api/v2/p2p/public/payment_methods/${pmUpdate.id}/logo`} alt=""/>}
                            {pmUpdate?.name}
                        </div>
                        <div className="custom-fields">
                            {renderCustomFields(paymentOptions)}
                        </div>
                    </div>
                );
                button = (
                    <div>
                        <Button
                            onClick={handleUpdateSubmit}
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
                        <p>{translate('page.body.profile.payment.modal.body.sureDelete', {name: modal.name})}?</p>
                    </div>
                );
                button = (
                    <div>
                        <Button
                            onClick={props.handleDelete}
                            size="lg"
                            variant="primary"
                            block={true}
                        >{translate('page.body.profile.payment.modal.body.yes')}</Button>
                        <Button
                            onClick={props.hideModal}
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
    }, [translate, modal, paymentOptions, paymentMethods, searchKeyword, showError]);

    return modal.active ? (
        <div className="cr-modal">
            <div className="cr-email-form">
                {renderHeader()}
                {renderModalBody()}
            </div>
        </div>
    ) : null;
};
