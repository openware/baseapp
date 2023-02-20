import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { IntlProps } from '../../';
import { SignInScreen } from '../SignInScreen';

const renderComponent = (props: Partial<IntlProps> = {}) =>
    render(
        <TestComponentWrapper>
            <SignInScreen />
        </TestComponentWrapper>,
    );

describe('SignInScreen', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
