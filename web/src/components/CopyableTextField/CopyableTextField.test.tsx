import { render } from '@testing-library/react';
import * as React from 'react';
import { CopyableTextField, CopyableTextFieldProps } from './';

const defaultProps: CopyableTextFieldProps = {
    value: '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4dfE',
    fieldId: 'copy_id',
};

const renderComponent = (props: Partial<CopyableTextFieldProps> = {}) =>
    render(<CopyableTextField {...{ ...defaultProps, ...props }} />);

describe('CopyableTextField', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should contain cr-copyable-text-field className', () => {
        expect(renderComponent().container.querySelector('.cr-copyable-text-field')).toBeInTheDocument();
    });
});
