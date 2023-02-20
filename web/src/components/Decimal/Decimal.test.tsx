import { render, screen } from '@testing-library/react';
import React from 'react';
import { Decimal, DecimalProps } from '.';

const defaultProps: DecimalProps = {
    fixed: 8,
};

const renderComponent = (props: Partial<DecimalProps> = {}) => {
    if (props.children) {
        return render(<Decimal {...{ ...defaultProps, ...props }} />);
    }

    return render(<Decimal {...{ ...defaultProps, ...props }}>123.3203020023</Decimal>);
};

describe('Decimal', () => {
    it('should render', () => {
        expect(renderComponent().container).toMatchSnapshot();
    });

    it('should have className for number after dot', () => {
        expect(renderComponent().container.querySelector('.cr-decimal__opacity')).toBeInTheDocument();
    });

    it('should handle empty string child', () => {
        const { container } = render(<Decimal fixed={8} children={''} />);
        expect(container).toMatchSnapshot();
    });

    it('should handle string child', () => {
        const { container } = render(<Decimal fixed={8} children={'123.3203020023'} />);
        expect(container).toMatchSnapshot();
    });

    it('should handle small string child', () => {
        const { container } = render(<Decimal fixed={8} children={'0.00000007'} />);
        expect(container).toMatchSnapshot();
    });

    it('should handle small exponential string child', () => {
        const { container } = render(<Decimal fixed={8} children={'3e-8'} />);
        expect(container).toMatchSnapshot();
    });

    it('should handle zero number value child', () => {
        const { container } = render(<Decimal fixed={8} children={0} />);
        expect(container).toMatchSnapshot();
    });

    it('should handle number child', () => {
        const { container } = render(<Decimal fixed={8} children={123.3203020023} />);
        expect(container).toMatchSnapshot();
    });

    it('should handle small number child', () => {
        const { container } = render(<Decimal fixed={8} children={0.00000007} />);
        expect(container).toMatchSnapshot();
    });

    it('should handle smallest number child', () => {
        const { container } = render(<Decimal fixed={8} children={0.000000001} />);
        expect(container).toMatchSnapshot();
    });

    it('should handle large number child', () => {
        const { container } = render(<Decimal fixed={8} children={12345678.01234567} />);
        expect(container).toMatchSnapshot();
    });

    it('should handle extremly large number child', () => {
        const { container } = render(<Decimal fixed={4} children={0.12345678} />);
        expect(container).toMatchSnapshot();
    });

    it('should handle undefined value', () => {
        render(<Decimal fixed={8}>{undefined}</Decimal>);
        expect(screen.getAllByText('0').length).toEqual(2);
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

    it('should handle format negative values with thousands separator', () => {
        expect(Decimal.format(-123456789, 2, '')).toEqual('-123456789.00');
        expect(Decimal.format(-123456789, 2, ',')).toEqual('-123,456,789.00');
        expect(Decimal.format(-123456789.012345678, 6, ',')).toEqual('-123,456,789.012345');
        expect(Decimal.format(-123456789.012345678, 6, ' ')).toEqual('-123 456 789.012345');
        expect(Decimal.format(-1234567890123456, 0, ',')).toEqual('-1,234,567,890,123,456');
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
        renderComponent({ fixed: 0, children: '123.092' });
        expect(screen.queryByText('123')).toBeInTheDocument();
    });

    it('should rounding child and afterDot - non-highlighted', () => {
        const { container } = renderComponent({ children: '123.12399999', fixed: 4 });
        const spans = container.getElementsByTagName('span');
        expect(spans.length).toEqual(2);
        // first span - highlighted
        expect(spans[0].className).not.toEqual('cr-decimal__opacity');
        expect(spans[0].innerHTML).toEqual('123');
        // second span - rounded and non-highlighted
        expect(spans[1].className).toEqual('cr-decimal__opacity');
        expect(spans[1].innerHTML).toEqual('.1239');
    });

    it('should handle prevValue prop', () => {
        const { container } = renderComponent({
            fixed: 5,
            prevValue: '125.1234123',
            children: '123.32030200230000',
        });
        const spans = container.getElementsByTagName('span');
        expect(spans.length).toEqual(2);
        // first span - non-highlighted
        expect(spans[0].className).toEqual('cr-decimal__opacity');
        expect(spans[0].innerHTML).toEqual('12');
        // second span - highlighted
        expect(spans[1].className).not.toEqual('cr-decimal__opacity');
        expect(spans[1].innerHTML).toEqual('3.32030');
    });

    it('should handle thousands separator formatted prevValue prop', () => {
        const { container } = renderComponent({
            fixed: 2,
            prevValue: '123456.12',
            children: '123456.14',
            thousSep: ',',
        });
        const spans = container.getElementsByTagName('span');
        expect(spans.length).toEqual(2);
        // first span - non-highlighted
        expect(spans[0].className).toEqual('cr-decimal__opacity');
        expect(spans[0].innerHTML).toEqual('123,456.1');
        // second span - highlighted
        expect(spans[1].className).not.toEqual('cr-decimal__opacity');
        expect(spans[1].innerHTML).toEqual('4');
    });

    it('should handle separators formatted prevValue prop', () => {
        const { container } = renderComponent({
            fixed: 4,
            prevValue: '12345678.1234',
            children: '12346789.1234',
            thousSep: ' ',
            floatSep: ',',
        });
        const spans = container.getElementsByTagName('span');
        expect(spans.length).toEqual(2);
        // first span - non-highlighted
        expect(spans[0].className).toEqual('cr-decimal__opacity');
        expect(spans[0].innerHTML).toEqual('12 34');
        // second span - highlighted
        expect(spans[1].className).not.toEqual('cr-decimal__opacity');
        expect(spans[1].innerHTML).toEqual('6 789,1234');
    });

    it('should handle small prevValue prop', () => {
        const { container } = renderComponent({ fixed: 8, prevValue: '0.00000001', children: '0.00000002' });
        const spans = container.getElementsByTagName('span');
        expect(spans.length).toEqual(2);
        // first span - non-highlighted
        expect(spans[0].className).toEqual('cr-decimal__opacity');
        expect(spans[0].innerHTML).toEqual('0.0000000');
        // second span - highlighted
        expect(spans[1].className).not.toEqual('cr-decimal__opacity');
        expect(spans[1].innerHTML).toEqual('2');
    });

    it('should not handle prevValue prop', () => {
        const { container } = renderComponent({ fixed: 8, prevValue: '0.00000001', children: '0.00000001' });
        const spans = container.getElementsByTagName('span');
        expect(spans.length).toEqual(2);
        // first span - non-highlighted
        expect(spans[0].className).toEqual('cr-decimal__opacity');
        expect(spans[0].innerHTML).toEqual('0.00000001');
        // second span - highlighted
        expect(spans[1].className).not.toEqual('cr-decimal__opacity');
        expect(spans[1].innerHTML).toEqual('');
    });
});
