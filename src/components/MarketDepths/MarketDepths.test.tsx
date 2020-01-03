import { shallow } from 'enzyme';
import * as React from 'react';
import { MarketDepths, MarketDepthsProps } from '.';

const defaultProps: MarketDepthsProps = {
  colors: {
      fillAreaAsk: 'rgba(233,91,91,1)',
      fillAreaBid: 'rgba(91,165,132,1)',
      gridBackgroundEnd: 'rgba(31,42,52,1)',
      gridBackgroundStart: 'rgba(15,20,37,1)',
      strokeAreaAsk: 'rgba(233,91,91,1)',
      strokeAreaBid: 'rgba(91,165,132,1)',
      strokeAxis: 'rgba(122,150,166,1)',
      strokeGrid: 'rgba(98, 113, 139, 0.2)',
  },
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

const setup = (props: Partial<MarketDepthsProps> = {}) =>
    shallow(<MarketDepths {...{ ...defaultProps, ...props }} />);

describe('CryptoIcon', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('should have correct className', () => {
        const wrapper = setup();
        expect(wrapper.hasClass('cr-market-depths')).toBeTruthy();
    });

    it('always renders a market depth', () => {
        const wrapper = setup();
        expect(wrapper.length).toBe(1);
    });

    it('check data from default props', () => {
        const wrapper = setup();
        const { data } = wrapper.find('AreaChart').first().props();
        expect(data).toEqual(defaultProps.data);
    });

});
