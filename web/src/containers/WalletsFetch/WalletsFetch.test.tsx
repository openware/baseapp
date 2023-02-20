import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { IntlProps } from '../../';
import { WalletsFetch } from './';

const renderComponent = (props: Partial<IntlProps> = {}) =>
    render(
        <TestComponentWrapper>
            <WalletsFetch />
        </TestComponentWrapper>,
    );

describe('WalletsFetch component', () => {
    it('should match snapshot', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
