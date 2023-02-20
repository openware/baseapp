import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { Wallet } from '../../modules';
import { DepositCrypto } from './';

describe('DepositCrypto', () => {
    let component;
    const handleOnCopy = jest.fn();
    const handleGenerateAddress = jest.fn();
    const wallet: Wallet = {
        currency: 'eth',
        name: '',
        fixed: 0,
        type: 'coin',
        account_type: '',
        networks: [],
        deposit_addresses: [
            {
                address: '0xq',
                currencies: ['eth'],
                blockchain_key: 'erc-20',
            },
        ],
    };

    beforeEach(() => {
        component = render(
            <TestComponentWrapper>
                <DepositCrypto
                    dimensions={118}
                    error={'error123'}
                    handleGenerateAddress={handleGenerateAddress}
                    handleOnCopy={handleOnCopy}
                    text={'text123'}
                    wallet={wallet}
                    disabled={false}
                    network="erc-20"
                />
                ,
            </TestComponentWrapper>,
        );
    });

    it('should contains QRCode', () => {
        expect(component.container.querySelector('.qr-code-wrapper')).toBeInTheDocument();
    });

    it('should contains CopyableTextField', () => {
        expect(component.container.querySelector('.cr-copyable-text-field')).toBeInTheDocument();
    });

    it('should match snapshot', () => {
        expect(component.container).toMatchSnapshot();
    });
});
