import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Pagination } from '.';

const defaultProps = {
    firstElemIndex: 1,
    lastElemIndex: 6,
    total: 30,
    page: 0,
    nextPageExists: true,
    onClickPrevPage: jest.fn(),
    onClickNextPage: jest.fn(),
};

const renderComponent = (props = {}) => render(<Pagination {...{ ...defaultProps, ...props }} />);

describe('Pagination', () => {
    it('should matches snapshot', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(renderComponent().container.querySelector('.pg-history-elem__pagination')).toBeInTheDocument();
    });

    it('has pagination info with right text', () => {
        const { container } = renderComponent();
        expect(container.getElementsByTagName('p')[0].textContent).toEqual('1 - 6 of 30');
    });

    it('should test click on prev page', () => {
        const spyClickPrev = jest.fn();
        const { rerender } = renderComponent({ onClickPrevPage: spyClickPrev });
        const prevButton = screen.getAllByRole('button')[0];

        fireEvent.click(screen.getAllByRole('button')[0]);
        expect(spyClickPrev).toHaveBeenCalledTimes(0);

        rerender(<Pagination {...{ ...defaultProps, onClickPrevPage: spyClickPrev, page: 1 }} />);
        fireEvent.click(prevButton);
        expect(spyClickPrev).toHaveBeenCalledTimes(1);
    });

    it('should test click on next page', () => {
        const spyClickNext = jest.fn();
        const { rerender } = renderComponent({ onClickNextPage: spyClickNext, nextPageExists: false });
        const nextButton = screen.getAllByRole('button')[1];

        fireEvent.click(nextButton);
        expect(spyClickNext).toHaveBeenCalledTimes(0);

        rerender(<Pagination {...{ ...defaultProps, onClickNextPage: spyClickNext }} />);
        fireEvent.click(nextButton);
        expect(spyClickNext).toHaveBeenCalledTimes(1);
    });
});
