import { render } from '@testing-library/react';
import React from 'react';
import { TestComponentWrapper } from 'src/lib/test';
import { MarketDepths, MarketDepthsProps } from '.';

class ResizeObserver {
    observe() {
        // do nothing
    }
    unobserve() {
        // do nothing
    }
    disconnect() {
        // do nothing
    }
}

window.ResizeObserver = ResizeObserver;

const defaultProps: MarketDepthsProps = {
    data: [
        { x: '', bid: 4500, amt: 1 },
        { x: '', bid: 3500, amt: 2 },
        { x: '$ 4.000', bid: 2359, amt: 3 },
        { x: '', bid: 2256 },
        { x: '', bid: 2222 },
        { x: '', bid: 2190 },
        { x: '$ 3.526', bid: 2014 },
        { x: '', bid: 2003 },
        { x: '', bid: 1970 },
        { x: '', bid: 1905 },
        { x: '', bid: 1900 },
        { x: '', bid: 1890 },
        { x: '', bid: 1670 },
        { x: '$ 3.150', bid: 560 },
        { x: '', bid: 480 },
        { x: '', bid: 470 },
        { x: '', bid: 310 },
        { x: '', bid: 234 },
        { x: '', bid: 100, ask: 110 },
        { x: '', ask: 800 },
        { x: '', ask: 940 },
        { x: '', ask: 967 },
        { x: '', ask: 999 },
        { x: '$ 3.150', ask: 1100 },
        { x: '', ask: 1130 },
        { x: '', ask: 1800 },
        { x: '', ask: 2100 },
        { x: '', ask: 2600 },
        { x: '$ 3.526', ask: 3800 },
        { x: '', ask: 4100 },
        { x: '', ask: 4300 },
        { x: '', ask: 4370 },
        { x: '', ask: 4500 },
        { x: '', ask: 4680 },
        { x: '', ask: 4790 },
        { x: '$ 4.000', ask: 4800 },
        { x: '', ask: 5100 },
        { x: '', ask: 5250 },
    ],
};

const renderComponent = (props: Partial<MarketDepthsProps> = {}) =>
    render(
        <TestComponentWrapper>
            <MarketDepths {...{ ...defaultProps, ...props }} />
        </TestComponentWrapper>,
    );

describe('CryptoIcon', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should have correct className', () => {
        expect(renderComponent().container.querySelector('.cr-market-depths')).toBeInTheDocument();
    });

    it('always renders a market depth', () => {
        expect(renderComponent().container).toBeInTheDocument();
    });
});
