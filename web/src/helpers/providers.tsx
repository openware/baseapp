import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import * as React from 'react';

const getLibrary = (provider: any): Web3Provider => {
    const library = new Web3Provider(provider);
    library.pollingInterval = 10000;

    return library;
};

export const Web3ProviderWrapper = (props: any) => (
    <Web3ReactProvider getLibrary={getLibrary}>{props.children}</Web3ReactProvider>
);
