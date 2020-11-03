import { shallow } from 'enzyme';

import React from 'react';

import { TestComponentWrapper } from 'lib/test';
import { QRCode, QRCodeProps } from '.';

const setup = (props: QRCodeProps) =>
    shallow(
        <TestComponentWrapper>
            <QRCode {...props} />
        </TestComponentWrapper>
    );

describe('QRCode', () => {
    it('has qr-code className', () => {
        // tslint:disable-next-line:no-magic-numbers
        const wrapper = setup({ data: 'sevaerverv343', dimensions: 118 }).render();
        expect(wrapper.hasClass('qr-code'));
    });

    it('renders correctly', () => {
        // tslint:disable-next-line:no-magic-numbers
        const wrapper = setup({ data: 'sevaerverv343', dimensions: 118 }).render();
        expect(wrapper).toMatchSnapshot();
    });
});
