import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { SinonSpy, spy } from 'sinon';
import { FilterInput, FilterInputProps } from './';

const data = [
    {
        active: true,
        address: '0xdeadbeef',
        cryptoAmount: 10,
        cryptoCode: 'BTC',
        fiatAmount: 100,
        fiatCode: 'USD',
        lockedAmount: 0,
    },
    {
        active: false,
        address: '0xdvrervef',
        cryptoAmount: 10,
        cryptoCode: 'ETH',
        fiatAmount: 100,
        fiatCode: 'USD',
        lockedAmount: 0,
    },
];

const defaults: FilterInputProps = {
    data,
    filter: (item: (typeof data)[0], term) => String(item.cryptoCode).toLowerCase().indexOf(term.toLowerCase()) !== -1,
    onFilter: spy(),
};

const renderComponent = (props: Partial<FilterInputProps> = {}) =>
    render(<FilterInput {...{ ...defaults, ...props }} />);

describe('FilterInput', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = renderComponent();
    });

    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should render 1 input tag', () => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should have correct className', () => {
        expect(wrapper.container.querySelector('.cr-search')).toBeInTheDocument();
    });

    it('should render correct list from data', () => {
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'b' } });

        expect((defaults.onFilter as SinonSpy).calledOnceWith([defaults.data[0]])).toBeTruthy();
    });
});
