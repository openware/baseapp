import { render } from '@testing-library/react';
import React from 'react';
import { GridItem, GridItemProps } from '.';

const defaultProps: GridItemProps = {
    children: 'Children',
};

const renderComponent = (props: Partial<GridItemProps> = {}) => render(<GridItem {...{ ...defaultProps, ...props }} />);

describe('GridItem', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(renderComponent().container.querySelector('.cr-grid-item')).toBeInTheDocument();
    });

    it('should pass along supplied className', () => {
        expect(renderComponent({ className: 'new-class' }).container.querySelector('.new-class')).toBeInTheDocument();
    });
});
