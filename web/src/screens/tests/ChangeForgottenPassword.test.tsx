import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { IntlProps } from '../../';
import { ChangeForgottenPasswordScreen } from '../ChangeForgottenPasswordScreen';

const renderComponent = (props: Partial<IntlProps> = {}) =>
    render(
        <TestComponentWrapper>
            <ChangeForgottenPasswordScreen />
        </TestComponentWrapper>,
    );

describe('ChangeForgottenPasswordScreen test', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
