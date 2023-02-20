import { render } from '@testing-library/react';
import * as React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { IntlProps } from '../../';
import { ConfirmScreen } from '../ConfirmScreen';

const renderComponent = (props: Partial<IntlProps> = {}) =>
    render(
        <TestComponentWrapper>
            <ConfirmScreen />
        </TestComponentWrapper>,
    );

describe('ConfirmScreen test', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
