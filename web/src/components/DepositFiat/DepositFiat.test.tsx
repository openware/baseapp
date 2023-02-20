import { render, screen } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { DepositFiat } from './';

describe('DepositFiat', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = render(
            <TestComponentWrapper>
                <DepositFiat title={'Custom Title'} description={'Custom Description'} uid={'42389734'} />
            </TestComponentWrapper>,
        );
    });

    it('should contains title', () => {
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('should contains right description', () => {
        expect(screen.getByText('Custom Description')).toBeInTheDocument();
    });

    it('should match snapshot', () => {
        expect(wrapper.container).toMatchSnapshot();
    });
});
