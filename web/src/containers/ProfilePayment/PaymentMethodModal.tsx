import classnames from 'classnames';
import React, { FC, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { CustomInput } from 'src/components';
import { titleCase } from 'src/helpers';
import { PaymentOptionInterface } from './';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentMethod } from 'src/modules';

export interface PaymentMethodModalProps {
    paymentOptions: PaymentOptionInterface[];
    paymentMethods: PaymentMethod[];
    filtered: PaymentMethod[];
    searchKeyword: string;
    modal: any;
    translate: (id: string, value?: any) => string;
    hideModal: () => void;
    pickPaymentMethodToAdd: (item: any) => void;
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
                        <img src={`data:image/png;base64,${item.logo}`} alt=""/>
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
                                    <div className={inputClass(option)}>
                                        <CustomInput
                                            type="text"
                                            label={titleCase(option.name)}
                                            defaultLabel={titleCase(option.name)}
                                            placeholder={titleCase(option.name)}
                                            inputValue={option.value}
                                            handleChangeInput={(value, name?) => props.handleCustomFieldChange(value, option.name)}
                                        />
                                        {showError && option.required && !option.value &&
                                            <span className="error">{translate('page.body.profile.payment.modal.error.empty', {name: titleCase(option.name)})}</span>}
                                    </div>
                                )
                            }
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
                                    <div className={inputClass(option)}>
                                        <CustomInput
                                            type="text"
                                            label={titleCase(option.name)}
                                            defaultLabel={titleCase(option.name)}
                                            placeholder={titleCase(option.name)}
                                            inputValue={option.value ? option.value : ''}
                                            handleChangeInput={(value, name?) => props.handleCustomFieldChange(value, option.name)}
                                        />
                                        {showError && option.required && !option.value && 
                                            <span className="error">{translate('page.body.profile.payment.modal.error.empty', {name: titleCase(option.name)})}</span>}
                                    </div>
                                )
                            }
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
