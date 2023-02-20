import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { IntlProps } from '../../';
import { HistoryScreen } from '../History';

const renderComponent = (props: Partial<IntlProps> = {}) =>
    render(
        <TestComponentWrapper>
            <HistoryScreen />
        </TestComponentWrapper>,
    );

describe('HistoryScreen', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });
});
