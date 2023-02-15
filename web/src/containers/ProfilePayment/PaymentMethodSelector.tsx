import React, { FC, useEffect } from 'react';
import { CustomInput } from 'src/components';
import { HOST_URL } from 'src/constants';
import { PaymentMethod } from 'src/modules';

export interface PaymentMethodSelectorProps {
    searchKeyword: string;
    paymentMethods: PaymentMethod[];
    translate: (id: string, value?: any) => string;
    setSearchKeyword: (keyword: string) => void;
    selectPaymentMethod: (pm: PaymentMethod) => void;
}

export const PaymentMethodSelector: FC<PaymentMethodSelectorProps> = (props) => {
    useEffect(() => {
        props.setSearchKeyword('');
    }, []);

    const renderDropdownList = (pm: PaymentMethod) => (
        <div className="search-dropdown__item" onClick={() => props.selectPaymentMethod(pm)}>
            <img
                className="payment-method-logo ml-2 mr-3 mb-1"
                src={`${HOST_URL}/api/v2/p2p/public/payment_methods/${pm.id}/logo`}
                alt=""
            />
            {pm.name}
        </div>
    );

    return (
        <div className="search-filter">
            <div className="search-input">
                <CustomInput
                    type="text"
                    label=""
                    defaultLabel=""
                    placeholder={props.translate('page.body.wallets.overview.seach')}
                    inputValue={props.searchKeyword}
                    handleChangeInput={props.setSearchKeyword}
                />
                {props.searchKeyword ? (
                    <div className="search-filter__reset" onClick={() => props.setSearchKeyword('')} />
                ) : null}
            </div>
            <div className="search-dropdown">{props.paymentMethods.map(renderDropdownList)}</div>
        </div>
    );
};
