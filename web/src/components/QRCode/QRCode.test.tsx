import { render } from '@testing-library/react';
import React from 'react';
import { QRCode, QRCodeProps } from '.';

const renderComponent = (props: QRCodeProps) => render(<QRCode {...props} />);

describe('QRCode', () => {
    it('has qr-code className', () => {
        const { container } = renderComponent({ data: 'sevaerverv343', dimensions: 118 });
        expect(container.querySelector('.qr-code')).toBeInTheDocument();
    });

    it('renders correctly', () => {
        const { container } = renderComponent({ data: 'sevaerverv343', dimensions: 118 });
        expect(container).toMatchSnapshot();
    });
});
