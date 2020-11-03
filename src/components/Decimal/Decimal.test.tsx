import { shallow } from 'enzyme';
import * as React from 'react';

import { Decimal, DecimalProps } from '.';

const defaultProps: DecimalProps = {
    fixed: 8,
};

// tslint:disable no-magic-numbers
const setup = (props: Partial<DecimalProps> = {}) => {
    if (props.children) {
        return shallow(<Decimal {...{ ...defaultProps, ...props }} />);
    }

    return shallow(<Decimal {...{ ...defaultProps, ...props }}>123.3203020023</Decimal>);
};

describe('Decimal', () => {
    it('should render', () => {
        const wrapper = setup();
        expect(wrapper).toMatchSnapshot();
    });

    it('should have className for number after dot', () => {
        const wrapper = setup();
        expect(wrapper.find('span').last().hasClass('cr-decimal__opacity')).toBeTruthy();
    });

    it('should handle empty string child', () => {
        const wrapper = shallow(<Decimal fixed={8} children={''} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle string child', () => {
        const wrapper = shallow(<Decimal fixed={8} children={'123.3203020023'} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle small string child', () => {
        const wrapper = shallow(<Decimal fixed={8} children={'0.00000007'} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle small exponential string child', () => {
        const wrapper = shallow(<Decimal fixed={8} children={'3e-8'} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle zero number value child', () => {
        const wrapper = shallow(<Decimal fixed={8} children={0} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle number child', () => {
        const wrapper = shallow(<Decimal fixed={8} children={123.3203020023} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle small number child', () => {
        const wrapper = shallow(<Decimal fixed={8} children={0.00000007} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle smallest number child', () => {
        const wrapper = shallow(<Decimal fixed={8} children={0.000000001} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle large number child', () => {
        const wrapper = shallow(<Decimal fixed={8} children={12345678.01234567} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle extremly large number child', () => {
        const wrapper = shallow(<Decimal fixed={4} children={0.12345678} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('should handle undefined value', () => {
        const wrapper = shallow(<Decimal fixed={8}>{undefined}</Decimal>);
        expect(wrapper.find('span').first().props().children).toEqual('0');
        expect(Decimal.format('0', 3)).toEqual('0.000');
    });

    it('should handle format with function Decimal.format', () => {
        expect(Decimal.format(123.3203020023, 3)).toEqual('123.320');
        expect(Decimal.format(0.12345678, 4)).toEqual('0.1234');
        expect(Decimal.format(3, 4)).toEqual('3.0000');
        expect(Decimal.format(3, 0)).toEqual('3');
    });

    it('should handle format small numbers with function Decimal.format', () => {
        const formatWithFunc = Decimal.format(0.00000006, 8);
        expect(formatWithFunc).toEqual('0.00000006');
    });

    it('should handle format extra small numbers with function Decimal.format', () => {
        const formatWithFunc = Decimal.format(0.0000000167, 8);
        expect(formatWithFunc).toEqual('0.00000001');
    });

    it('should handle format extra big numbers with function Decimal.format', () => {
        const formatWithFunc = Decimal.format(1234567890123, 8);
        expect(formatWithFunc).toEqual('1234567890123.00000000');
    });

    it('should handle format exponential numbers with function Decimal.format', () => {
        const formatWithFunc = Decimal.format('1e-8', 8);
        expect(formatWithFunc).toEqual('0.00000001');
    });

    it('should handle format with function Decimal.getNumberBeforeDot', () => {
        const formatWithFunc = Decimal.getNumberBeforeDot(123.3203020023, 3);
        expect(formatWithFunc).toEqual('123');
    });

    it('should handle format with function Decimal.getNumberAfterDot', () => {
        const formatWithFunc = Decimal.getNumberAfterDot(123.3203020023, 3);
        expect(formatWithFunc).toEqual('.320');
    });

    it('should handle format with thousands separator', () => {
        expect(Decimal.format(123456789, 2, '')).toEqual('123456789.00');
        expect(Decimal.format(123456789, 2, ',')).toEqual('123,456,789.00');
        expect(Decimal.format(123456789.012345678, 6, ',')).toEqual('123,456,789.012345');
        expect(Decimal.format(123456789.012345678, 6, ' ')).toEqual('123 456 789.012345');
        expect(Decimal.format(1234567890123456, 0, ',')).toEqual('1,234,567,890,123,456');
    });

    it('should handle format with float separator', () => {
        expect(Decimal.format(0.0000000167, 8, '', '')).toEqual('0.00000001');
        expect(Decimal.format(0.0000000167, 8, '', '.')).toEqual('0.00000001');
        expect(Decimal.format(0.0000000167, 8, '', ',')).toEqual('0,00000001');
        expect(Decimal.format(0.0000000167, 8, '', ' ')).toEqual('0 00000001');
        expect(Decimal.format(1234567890123, 8, '', ',')).toEqual('1234567890123,00000000');
    });

    it('should handle format with thousands and float separator', () => {
        expect(Decimal.format(0.0000000167, 8, '', '')).toEqual('0.00000001');
        expect(Decimal.format(0.0000000167, 8, '', '.')).toEqual('0.00000001');
        expect(Decimal.format(0.0000000167, 8, ' ', ',')).toEqual('0,00000001');
        expect(Decimal.format(123456789.012345678, 6, '.', '')).toEqual('123456789.012345');
        expect(Decimal.format(123456789.012345678, 6, ',', ',')).toEqual('123456789.012345');
        expect(Decimal.format(123456789.012345678, 6, ' ', ' ')).toEqual('123456789.012345');
        expect(Decimal.format(123456789.012345678, 6, ' ', ',')).toEqual('123 456 789,012345');
        expect(Decimal.format(1234567890123456, 1, ' ', ',')).toEqual('1 234 567 890 123 456,0');
        expect(Decimal.format(0.0000000167, 8, '.', ',')).toEqual('0,00000001');
        expect(Decimal.format(123456789.012345678, 6, '.', ',')).toEqual('123.456.789,012345');
        expect(Decimal.format(1234567890.0134, 2, '.', ',')).toEqual('1.234.567.890,01');
    });

    it('should handle zero fixed value', () => {
        const wrapper = setup({ fixed: 0, children: '123.092' });
        expect(wrapper.find('span').first().props().children).toEqual('123');
    });

    it('should rounding child and afterDot - non-highlighted', () => {
        const wrapper = setup({ children: '123.12399999', fixed: 4 });
        const spans = wrapper.find('span');
        expect(spans.length).toEqual(2);
        // first span - highlighted
        expect(spans.first().hasClass('cr-decimal__opacity')).toBeFalsy();
        expect(spans.first().props().children).toEqual('123');
        // second span - rounded and non-highlighted
        expect(spans.last().hasClass('cr-decimal__opacity')).toBeTruthy();
        expect(spans.last().props().children).toEqual('.1239');
    });

    it('should handle prevValue prop', () => {
        const wrapper = setup({ fixed: 5, prevValue: '125.1234123', children: '123.32030200230000' });
        const spans = wrapper.find('span');
        expect(spans.length).toEqual(2);
        // first span - non-ighlighted
        expect(spans.first().hasClass('cr-decimal__opacity')).toBeTruthy();
        expect(spans.first().props().children).toEqual('12');
        // second span - highlighted
        expect(spans.last().hasClass('cr-decimal__opacity')).toBeFalsy();
        expect(spans.last().props().children).toEqual('3.32030');
    });

    it('should handle thousands separator formatted prevValue prop', () => {
        const wrapper = setup({ fixed: 2, prevValue: '123456.12', children: '123456.14', thousSep: ',' });
        const spans = wrapper.find('span');
        expect(spans.length).toEqual(2);
        // first span - non-ighlighted
        expect(spans.first().hasClass('cr-decimal__opacity')).toBeTruthy();
        expect(spans.first().props().children).toEqual('123,456.1');
        // second span - highlighted
        expect(spans.last().hasClass('cr-decimal__opacity')).toBeFalsy();
        expect(spans.last().props().children).toEqual('4');
    });

    it('should handle separators formatted prevValue prop', () => {
        const wrapper = setup({
            fixed: 4,
            prevValue: '12345678.1234',
            children: '12346789.1234',
            thousSep: ' ',
            floatSep: ',',
        });
        const spans = wrapper.find('span');
        expect(spans.length).toEqual(2);
        // first span - non-ighlighted
        expect(spans.first().hasClass('cr-decimal__opacity')).toBeTruthy();
        expect(spans.first().props().children).toEqual('12 34');
        // second span - highlighted
        expect(spans.last().hasClass('cr-decimal__opacity')).toBeFalsy();
        expect(spans.last().props().children).toEqual('6 789,1234');
    });

    it('should handle small prevValue prop', () => {
        const wrapper = setup({ fixed: 8, prevValue: '0.00000001', children: '0.00000002' });
        const spans = wrapper.find('span');
        expect(spans.length).toEqual(2);
        // first span - non-ighlighted
        expect(spans.first().hasClass('cr-decimal__opacity')).toBeTruthy();
        expect(spans.first().props().children).toEqual('0.0000000');
        // second span - highlighted
        expect(spans.last().hasClass('cr-decimal__opacity')).toBeFalsy();
        expect(spans.last().props().children).toEqual('2');
    });

    it('should not handle prevValue prop', () => {
        const wrapper = setup({ fixed: 8, prevValue: '0.00000001', children: '0.00000001' });
        const spans = wrapper.find('span');
        expect(spans.length).toEqual(2);
        // first span - non-ighlighted
        expect(spans.first().hasClass('cr-decimal__opacity')).toBeTruthy();
        expect(spans.first().props().children).toEqual('0.00000001');
        // second span - highlighted
        expect(spans.last().hasClass('cr-decimal__opacity')).toBeFalsy();
        expect(spans.last().props().children).toEqual('');
    });
});
