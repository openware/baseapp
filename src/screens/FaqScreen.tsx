/* tslint:disable jsx-no-lambda  jsx-no-multiline-js */
import * as React from 'react';

interface FaqState {
    password: boolean;
    authenticator: boolean;
    withdraw: boolean;
    tradePlatform: boolean;
    marketOrderBuy: boolean;
    marketOrderSell: boolean;
    orderSection: boolean;
    cancelOrder: boolean;
    history: boolean;
    resetPassword: boolean;
    cryptocurrencies: boolean;
}

class FaqScreen extends React.Component<FaqState> {
    public state = {
        password: false,
        authenticator: false,
        withdraw: false,
        tradePlatform: false,
        marketOrderBuy: false,
        marketOrderSell: false,
        orderSection: false,
        cancelOrder: false,
        history: false,
        resetPassword: false,
        cryptocurrencies: false,
    };
    public handleClick(block: string): void {
        this.setState(prev => ({
            [block]: !prev[block],
        }));
    }
    public render() {
        return (
            <div className="pg-container pg-faq"/>
        );
    }
}

export {
    FaqScreen,
};
